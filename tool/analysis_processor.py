cleanString = lambda x: re.sub(r"[^a-zA-Z]", "", re.sub(r"\\u[0-9a-fA-F]{4}", "", x))


def getMaxMatchSubstring(substring, superstring):
	clean_sub = cleanString(substring)

	low = 0
	high = len(clean_sub)
	best_match = None
	while low <= high:
		mid = (low + high) // 2
		current = clean_sub[:mid]

		if current in superstring:
			best_match = current
			low = mid + 1
		else:
			high = mid - 1

	return best_match


def getCleanedMatch(sub_match, substring, superstring):

	i = superstring.find(sub_match)
	if i == -1:
		return None

	target_alpha_len = len(cleanString(substring))

	if target_alpha_len == 0:
		return None

	low = 0
	high = len(superstring)
	end_index = high

	while low <= high:
		mid = (low + high) // 2

		current_alpha_len = len(cleanString(superstring[i:mid]))

		if current_alpha_len >= target_alpha_len:

			end_index = mid
			high = mid - 1
		else:
			low = mid + 1

	if high == 0:
		return None

	return superstring[i:end_index]


# [TODO]:
# - Supplemental RAG retreval
# 	- add alt embeddings for RETRIEVAL_DOCUMENT
# - Better question generation, (more general)
# - Clustering, filtering and pruning questions
# - Re-analysis mode
# - Make getCleanedMatch better for parts where we get multiple matches of substring edge case
# - Make extractContent more robust
# - Thinkabout where we can parellelise API calls


import datetime
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import re
import datetime
import hashlib
import ast
from question_analysis import LLMInterface
from model_management import GeminiModel
import numpy as np
import json
import os
from google.genai import types
import concurrent.futures

QUESTIONS_FILE = "./questions_filter_after.json"
POLICIES_FILE = "./policies_testing.json"


def splitParargraphs(input_string):
	return input_string.split("\n\n")


def splitNewlines(input_string):
	while "\n\n" in input_string:
		input_string = input_string.replace("\n\n", "\n")
	return input_string.split("\n")


def __loadJson(filepath):
	if not os.path.exists(filepath):
		return {}
	try:
		with open(filepath, "r", encoding="utf-8") as f:
			return json.load(f)
	except json.JSONDecodeError:
		return {}


def __saveJson(filepath, data):
	with open(filepath, "w", encoding="utf-8") as f:
		json.dump(data, f, indent=4, default=str)


temp_cache_questions = __loadJson(QUESTIONS_FILE)


def _loadJson(filepath):
	if not os.path.exists(filepath):
		return {}
	try:
		with open(filepath, "r", encoding="utf-8") as f:
			return json.load(f)
	except json.JSONDecodeError:
		return {}


def _saveJson(filepath, data):
	with open(filepath, "w", encoding="utf-8") as f:
		json.dump(data, f, indent=4, default=str)


def loadQuestions(debug=True):
	if debug:
		return temp_cache_questions
	return _loadJson(QUESTIONS_FILE)


def loadPolicies():
	return _loadJson(POLICIES_FILE)


def updateQuestionEntry(question_text, new_policy_data):
	data = _loadJson(QUESTIONS_FILE)
	data[question_text].update(new_policy_data)
	_saveJson(QUESTIONS_FILE, data)


def updateQuestionEntry2(question_text, policy_hash, chunk_hash, new_policy_data):
	data = _loadJson(QUESTIONS_FILE)
	data[question_text][policy_hash][chunk_hash].update(new_policy_data)
	_saveJson(QUESTIONS_FILE, data)


def addNewQuestionChunk(question_text, policy_hash, chunk_hash, debug=True):
	if debug:
		temp_cache_questions[question_text]["policy_data"][policy_hash].update(
			{chunk_hash: []}
		)

	else:
		data = _loadJson(QUESTIONS_FILE)

		data[question_text]["policy_data"][policy_hash].update({chunk_hash: []})
		_saveJson(QUESTIONS_FILE, data)


def addNewQuestion(question_text, question_data, debug=True):
	if debug:
		temp_cache_questions[question_text] = question_data
	else:
		data = _loadJson(QUESTIONS_FILE)
		data[question_text] = question_data
		_saveJson(QUESTIONS_FILE, data)


# def updateQuestionChunk(
# 	question_text, policy_hash, chunk_hash, new_substring_data, debug=True
# ):
# 	if new_substring_data == []:
# 		return
# 	if debug:
# 		temp_cache_questions[question_text]["policy_data"][policy_hash][chunk_hash].append(
# 			new_substring_data
# 		)
# 	else:
# 		data = _loadJson(QUESTIONS_FILE)
# 		data[question_text]["policy_data"][policy_hash][chunk_hash].append(new_substring_data)
# 		_saveJson(QUESTIONS_FILE, data)


# def updateQuestionChunk(question_text, policy_hash, chunk_hash, new_substring_data):
# 	if new_substring_data == []:
# 		return
# 	data = _loadJson(QUESTIONS_FILE)
# 	data[question_text]["policy_data"][policy_hash][chunk_hash].append(new_substring_data)
# 	_saveJson(QUESTIONS_FILE, data)


def updatePolicyEntry(policy_name, new_version_data):
	data = _loadJson(POLICIES_FILE)
	data[policy_name].update(new_version_data)
	_saveJson(POLICIES_FILE, data)


def addNewPolicy(policy_name, policy_data):
	data = _loadJson(POLICIES_FILE)
	data[policy_name] = policy_data
	_saveJson(POLICIES_FILE, data)


def isInString(string, substring):
	return substring in string


def getSubstringIndices(string, substring):
	start_index = string.find(substring)
	end_index = start_index + len(substring)
	return (start_index, end_index)


import time


class AnalysisProcessor:

	modes = ["ANALYSIS", "DEBUG_QUESTION_GENERATION"]
	substring_modes = ["PROMPT", "FACT_EMBEDDINGS", "TESTING", "CROSS_FACTS"]

	useRetreval = True
	MARKDOWN_LINK_PATTERN = re.compile(r"(\[.*?\])\((.*?)\)")
	URL_PLACEHOLDER = "(DYNAMIC_URL_REMOVED)"

	@staticmethod
	def extractContent(url, headers=None):
		if headers is None:
			headers = {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
			}

			response = requests.get(url, headers=headers, timeout=10)
			response.raise_for_status()
			html_content = response.text

			return BeautifulSoup(html_content, "lxml").find("main")

	@staticmethod
	def extractMarkdown(main_content):
		return md(str(main_content), heading_style="ATX")

	@staticmethod
	def splitMarkdown(markdown_text):
		heading_pattern = r"^#{1,6}\s+.*"
		parts = re.split(heading_pattern, markdown_text, flags=re.MULTILINE)
		content_list = [part.strip() for part in parts[1:] if part.strip()]
		return content_list

	@staticmethod
	def removePreamble(markdown_text):
		pattern = r"\A.*?(?=^#\s)"
		cleaned_text = re.sub(pattern, "", markdown_text, flags=re.DOTALL | re.MULTILINE)
		return cleaned_text

	@staticmethod
	def normaliseMarkdownLinks(markdown_text):
		def replacer(match):
			return match.group(1) + AnalysisProcessor.URL_PLACEHOLDER

		normalized_text = AnalysisProcessor.MARKDOWN_LINK_PATTERN.sub(replacer, markdown_text)
		return normalized_text

	@staticmethod
	def getHash(data):
		return hashlib.sha256(data.encode("utf-8")).hexdigest()

	@staticmethod
	def processSimilarity(emb_a, emb_b):
		return np.dot(emb_a, emb_b) / (np.linalg.norm(emb_a) * np.linalg.norm(emb_b))

	@staticmethod
	def processUrl(policy_url):
		raw_policy_content = AnalysisProcessor.extractContent(policy_url)
		raw_markdown_content = AnalysisProcessor.extractMarkdown(raw_policy_content)
		policy_content = AnalysisProcessor.removePreamble(raw_markdown_content)
		normalised_content = AnalysisProcessor.normaliseMarkdownLinks(policy_content)
		policy_hash = AnalysisProcessor.getHash(normalised_content)
		return policy_content, policy_hash

	def getDuplicateQuestions(self, question_data):
		# saved_data = loadQuestions()
		preprocessed_questions = []
		for i, q in enumerate(question_data):
			embedding_vector = q["embedding_vector"]
			question = q["question"]
			if question in self.question_data:
				print(f"Exact duplicated: {question}")
				continue
			for k, v in self.question_data.items():
				trail_embedding = v["embedding_vector"]

				if AnalysisProcessor.processSimilarity(embedding_vector, trail_embedding) > 0.98:
					print(f"Near duplicate found: '{k}','{question}'")	# works suprisingly well

					preprocessed_questions.append([i, k])
					break

		return preprocessed_questions

	def isStored(self, policy_name, policy_hash):
		policy_data = loadPolicies()
		return (policy_name in policy_data) and (policy_hash in policy_data[policy_name])

	def swapSeenQuestions(self, with_embeddings):

		_ = list(with_embeddings.keys())[0]
		question_data = with_embeddings[_]
		preprocessed_questions = self.getDuplicateQuestions(question_data)

		modified_question_set = with_embeddings	# ast.literal_eval(_question_set)
		question_dict_key = list(modified_question_set.keys())[0]
		modified_question_data = modified_question_set[question_dict_key]
		for i in preprocessed_questions:
			modified_question_data[i[0]].update({"question": i[1]})

		return modified_question_data

	def processChunks(self, policy_content):
		proto_chunks = AnalysisProcessor.splitMarkdown(policy_content)
		_embeddings = self.analysis_model.client.models.embed_content(
			model="gemini-embedding-001",
			contents=proto_chunks,
			config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
		)
		embeddings = [e for e in _embeddings.embeddings]
		chunks = []
		for i, chunk in enumerate(proto_chunks):
			# if self.useRetreval and type(embeddings == list):
			chunks.append(
				{
					"chunk_content": {AnalysisProcessor.getHash(chunk): chunk},
					"retrieval_embedding_vector": embeddings[i].values,
				}
			)

		return chunks

	def __init__(self, data_source, mode=0, substring_mode=1, debug=False):
		_mode = 0
		if type(mode) == int and mode < len(self.modes):
			_mode = mode
		_substring_mode = 1
		if type(substring_mode) == int and substring_mode < len(self.substring_modes):
			_substring_mode = substring_mode
		self.debug = debug
		self.substring_mode = self.substring_modes[_substring_mode]
		self.mode = self.modes[_mode]
		self.data_source = data_source
		self.analysis_model = GeminiModel()
		self.model_interface = LLMInterface(self.analysis_model)
		self.question_data = None
		self.policy_data = None

		self.loadData()

	def updatePolicyData(self, policy_content, policy_chunks, policy_name, policy_hash):
		fetch_date = datetime.datetime.now().__str__()

		policy_data = {
			policy_hash: {
				"policy_content": policy_content,
				"policy_chunks": policy_chunks,
				"fetch_date": fetch_date,
			}
		}
		if policy_name in loadPolicies():
			self.updatePolicyEntry(policy_name, policy_data)
		else:
			self.addNewPolicy(policy_name, policy_data)

	def addNewPolicy(self, policy_name, policy_data):
		self.policy_data[policy_name] = policy_data

	def loadData(self):
		if self.debug == False:
			self.question_data = loadQuestions(debug=False)
			self.policy_data = loadPolicies()
		else:
			if self.question_data is None:
				self.question_data = {}
			if self.policy_data is None:
				self.policy_data = {}

	def saveData(self):

		if self.debug == False:
			_saveJson(QUESTIONS_FILE, self.question_data)
			_saveJson(POLICIES_FILE, self.policy_data)

	def addNewQuestionChunk(self, question_text, policy_hash, chunk_hash, debug=True):

		self.question_data[question_text]["policy_data"][policy_hash].update({chunk_hash: []})

	def addNewQuestion(self, question_text, question_data, debug=True):

		self.question_data[question_text] = question_data

	def updateQuestionChunk(
		self, question_text, policy_hash, chunk_hash, new_substring_data
	):

		self.question_data[question_text]["policy_data"][policy_hash][chunk_hash].append(
			new_substring_data
		)

	def updatePolicyEntry(self, policy_name, new_version_data):
		self.policy_data[policy_name].update(new_version_data)

	def filterDuplicates(self):
		if self.debug == False:
			self.loadData()
		old_data = self.question_data.copy()
		indexed_questions = []
		indexed_embeddings = []
		for k, v in old_data.items():
			indexed_questions.append(k)
			indexed_embeddings.append(v["embedding_vector"])
		array_indexed_embeddings = np.array(indexed_embeddings)
		array_indexed_questions = np.array(indexed_questions)

		sim_matrix = array_indexed_embeddings @ array_indexed_embeddings.T

		is_duplicate_matrix = np.triu(sim_matrix > 0.98, k=1)

		duplicates_mask = np.any(is_duplicate_matrix, axis=0)

		masters_all = np.argmax(is_duplicate_matrix, axis=0)

		indices_to_drop = np.where(duplicates_mask)[0]
		associated_masters = masters_all[duplicates_mask]
		strings_to_pop = array_indexed_questions[indices_to_drop]
		strings_overrides = array_indexed_questions[associated_masters]

		print(f"Strings to remove:")

		for i, key in enumerate(strings_to_pop):
			print(f"duplicate: {key}, main:{strings_overrides[i]}")
			policy_data = self.question_data[key]["policy_data"]
			for k, v in policy_data.items():
				if k in self.question_data[strings_overrides[i]]["policy_data"]:
					print(f"updating: {self.question_data[strings_overrides[i]]["policy_data"][k]}")
					print(f"with: {v}")
					self.question_data[strings_overrides[i]]["policy_data"][k].update(v)
				else:
					print(f"adding: {dict({k:v})}")
					print(f"to: {self.question_data[strings_overrides[i]]["policy_data"]}")

					self.question_data[strings_overrides[i]]["policy_data"].update({k: v})
			policy_data = self.question_data.pop(key)
		self.saveData()

	def processPolicyChunks(self, chunk, policy_hash, policy_name=None, index=0):
		print(f"STARTING chunk {index} in {policy_name}")
		chunk_hash = list(chunk["chunk_content"].keys())[0]
		chunk_content = list(chunk["chunk_content"].values())[0]

		_question_set: str = self.model_interface.generateQuestions(chunk_content)
		start_time = time.time()
		with_embeddings: dict = self.model_interface.processEmbeddings(
			_question_set, add_facts=False
		)
		reformed_question_set = list(with_embeddings.values())[0]
		for i in reformed_question_set:
			question = i["question"]
			if question in self.question_data:
				if policy_hash in self.question_data[question]["policy_data"]:
					if chunk_hash in self.question_data[question]["policy_data"][policy_hash]:
						continue
					else:
						self.addNewQuestionChunk(question, policy_hash, chunk_hash)

			else:
				self.addNewQuestion(
					question,
					{
						"embedding_vector": i["embedding_vector"],
						"policy_data": {policy_hash: {chunk_hash: []}},
					},
				)
		print(f"FINISHED chunk {index} in {policy_name}")

	def processPolicy(self, policy_name, policy_url):
		print(f"STARTING policy processing {policy_name}")

		policy_content, policy_hash = AnalysisProcessor.processUrl(policy_url)

		policy_chunks = self.processChunks(policy_content)
		self.updatePolicyData(policy_content, policy_chunks, policy_name, policy_hash)

		iterations = 0
		start_time = 0
		num_policy_chunks = len(policy_chunks)
		print(f"total chunks for {policy_name}: {num_policy_chunks}")
		executor = concurrent.futures.ThreadPoolExecutor(max_workers=num_policy_chunks)
		e_dict = dict()
		for index, chunk in enumerate(policy_chunks):
			e_dict[index] = executor.submit(
				self.processPolicyChunks, chunk, policy_hash, policy_name, index
			)
		executor.shutdown(wait=True)
		print(f"FINISHED ALL chunks for {policy_name}")

		# self.saveData()

	def addFactEmbeddings(self):
		question_emb = self.model_interface.processFactEmbeddings(self.question_data)
		for i in question_emb:
			self.question_data[i[0]].update({"retrieval_embedding_vector": i[1]})

	def runAnalyses(self, mode=None, limit_iterations=None):
		self.loadData()
		if mode is not None and mode in self.modes:
			self.mode = mode
		print("STARTING ALL policy processing")

		policies_total = len(list(self.data_source.keys()))
		executor = concurrent.futures.ThreadPoolExecutor(max_workers=policies_total)
		e = dict()
		for policy_name, policy_url in self.data_source.items():
			e[f"{[policy_name]}_{policy_url}"] = executor.submit(
				self.processPolicy, policy_name, policy_url
			)
		executor.shutdown(wait=True)
		print("FINISHED PROCESSING ALL Policies")
		self.saveData()

		self.filterDuplicates()
		print("FINISHED FILTERING Retrieval Embeddings")

		self.addFactEmbeddings()
		print("FINISHED adding Retrieval Embeddings")
		self.saveData()

	def getUpdates(self):
		self.loadData()
		needs_facts = []
		needs_prompts = []
		for k, v in self.question_data.items():
			policy_data = v["policy_data"]
			for l, w in policy_data.items():
				for m, x in w.items():
					if type(x) != list or len(x) == 0:
						needs_facts.append([k, l, m])
						needs_prompts.append([k, l, m])
					else:
						has_facts = False
						has_prompts = False
						for i in x:
							if has_facts and has_prompts:
								break
							if "method" not in i:
								needs_facts.append([k, l, m])
								needs_prompts.append([k, l, m])
								break
							else:
								method = i["method"]
								if method == "PROMPT":
									has_prompts = True
								elif method == "FACT_EMBEDDINGS":
									has_facts = True
						if not has_facts:
							needs_facts.append([k, l, m])
						if not has_prompts:
							needs_prompts.append([k, l, m])
		return needs_facts, needs_prompts

	def runSubstringAnalysis(self, substring_mode=None):

		self.loadData()

		if substring_mode is not None and substring_mode in self.substring_modes:
			self.substring_mode = substring_mode
		if self.substring_mode == "PROMPT":
			pass

			# similarly use whole question retrieval_embedding_vector to identify any other missed duplicates

		elif self.substring_mode == "FACT_EMBEDDINGS":
			needs_facts, _ = self.getUpdates()

			for item in needs_facts:
				policy = None
				chunk = None
				for k, v in self.policy_data.items():
					if item[1] in v:
						policy = v[item[1]]
						break
				if policy is not None:
					chunks = policy["policy_chunks"]
					for c in chunks:
						chunk_data = c["chunk_content"]
						if item[2] in chunk_data:
							chunk = chunk_data[item[2]]
							break

					if chunk is not None:
						chunk_lines = splitNewlines(chunk)
						fact_embedding = self.question_data[item[0]]["retrieval_embedding_vector"]
						chunk_embeddings: list = [
							e.values
							for e in self.analysis_model.client.models.embed_content(
								model="gemini-embedding-001",
								contents=chunk_lines,
								config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
							).embeddings
						]
						mat = np.dot(chunk_embeddings, fact_embedding)
						idx = np.argmax(mat)
						# print(f"arg_max: {mat[idx]}")
						substring = chunk_lines[idx]
						substring_indices = getSubstringIndices(policy["policy_content"], substring)
						question_update = {
							"substring": substring,
							"substring_indices": substring_indices,
							"method": "FACT_EMBEDDINGS",
						}
						self.updateQuestionChunk(*item, question_update)
			self.saveData()

		elif self.substring_mode == "TESTING":
			needs_facts, needs_prompts = self.getUpdates()
			print(len(needs_facts), len(needs_prompts))
		elif self.substring_mode == "CROSS_FACTS":
			all_q_embeddings = []
			all_qs = []
			for k, v in self.question_data.items():
				all_q_embeddings.append(v["retrieval_embedding_vector"])
				all_qs.append(k)

			all_secs = []
			all_sec_emb = []
			all_sec_hashes = []

			for _policy_name, v in self.policy_data.items():
				for _policy_hash, w in v.items():
					for i in w["policy_chunks"]:
						all_secs.append(list(i["chunk_content"].values())[0])
						all_sec_hashes.append(list(i["chunk_content"].keys())[0])

						all_sec_emb.append(i["retrieval_embedding_vector"])
			sim_matrix = np.dot(np.array(all_q_embeddings), np.array(all_sec_emb).T)
			threshold = 0.7
			indices_tuple = np.where(sim_matrix > threshold)
			for i in indices_tuple:
				chunk = all_secs[i[1]]
				chunk_hash = all_sec_hashes[i[1]]

				question = all_qs[i[0]]
				q_emb = all_q_embeddings[i[0]]

				chunk_lines = splitNewlines(chunk)
				chunk_embeddings: list = [
					e.values
					for e in self.analysis_model.client.models.embed_content(
						model="gemini-embedding-001",
						contents=chunk_lines,
						config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
					).embeddings
				]
				mat = np.dot(chunk_embeddings, q_emb)
				idx = np.argmax(mat)
				if mat[idx] > 0.8:
					substring = chunk_lines[idx]
					policy = None
					# policy_name = None
					policy_hash = None

					for _policy_name, v in self.policy_data.items():
						for _policy_hash, w in v.items():
							for i in w["policy_chunks"]:
								if chunk_hash in w["policy_chunks"]["chunk_content"]:
									policy = w["policy_content"]
									policy_hash = _policy_hash
									# policy_name = _policy_name

									break
						if policy is not None:
							break
					if policy is not None:
						substring_indices = getSubstringIndices(policy, substring)
						print(f"Found High Likelihood affirmation: {question}-{substring}")
						question_update = {
							"substring": substring,
							"substring_indices": substring_indices,
							"method": "CROSS_FACTS",
						}
						self.updateQuestionChunk(question, policy_hash, chunk_hash, question_update)
			self.saveData()

	# needs_facts, needs_prompts = self.getUpdates()
	# print(len(needs_facts), len(needs_prompts))
