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

QUESTIONS_FILE = "./questions.json"
POLICIES_FILE = "./policies.json"


# [TODO]:
# - Supplemental RAG retreval
# 	- add alt embeddings for RETRIEVAL_DOCUMENT
# - Better question generation, (more general)
# - Clustering, filtering and pruning questions
# - Re-analysis mode
# - Make getCleanedMatch better for parts where we get multiple matches of substring edge case
# - Make extractContent more robust
# - Thinkabout where we can parellelise API calls


def splitParargraphs(input_string):
	return input_string.split("\n\n")


def splitNewlines(input_string):
	while "\n\n" in input_string:
		input_string = input_string.replace("\n\n", "\n")
	return input_string.split("\n")


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


def loadQuestions():
	return _loadJson(QUESTIONS_FILE)


def loadPolicies():
	return _loadJson(POLICIES_FILE)


def updateQuestionEntry(question_text, new_policy_data):
	data = _loadJson(QUESTIONS_FILE)
	data[question_text].update(new_policy_data)
	_saveJson(QUESTIONS_FILE, data)


def addNewQuestion(question_text, question_data):
	data = _loadJson(QUESTIONS_FILE)
	data[question_text] = question_data
	_saveJson(QUESTIONS_FILE, data)


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


class AnalysisProcessor:

	modes = ["ANALYSIS", "DEBUG_QUESTION_GENERATION"]
	substring_modes = ["PROMPT", "FACT_EMBEDDINGS"]

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

	def processChunks(self, policy_content):
		proto_chunks = AnalysisProcessor.splitMarkdown(policy_content)
		if self.useRetreval:
			_embeddings = self.analysis_model.client.models.embed_content(
				model="gemini-embedding-001",
				contents=proto_chunks,
				config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY"),
			)
			embeddings = [e for e in _embeddings.embeddings]
		chunks = []
		for i, chunk in enumerate(proto_chunks):
			if self.useRetreval and type(embeddings == list):
				chunks.append(
					{
						AnalysisProcessor.getHash(chunk): chunk,
						"retrieval_embedding_vector": embeddings[i].values,
					}
				)
				if i == 0:
					print(embeddings[0].values)
			else:
				chunks.append({AnalysisProcessor.getHash(i): i})
		return chunks

	@staticmethod
	def getDuplicateQuestions(question_data):
		preprocessed_questions = []
		for i, q in enumerate(question_data):
			embedding_vector = q["embedding_vector"]
			for k, v in loadQuestions().items():
				trail_embedding = v["embedding_vector"]

				if AnalysisProcessor.processSimilarity(embedding_vector, trail_embedding) > 0.98:
					print(f"duplicate found: '{k}','{i}'")	# works suprisingly well

					preprocessed_questions.append([i, k])
					break

		return preprocessed_questions

	def isStored(self, policy_name, policy_hash):
		policy_data = loadPolicies()
		return (policy_name in policy_data) and (policy_hash in policy_data[policy_name])

	@staticmethod
	def updatePolicyData(policy_content, policy_chunks, policy_name, policy_hash):
		fetch_date = datetime.datetime.now().__str__()

		policy_data = {
			policy_hash: {
				"policy_content": policy_content,
				"policy_chunks": policy_chunks,
				"fetch_date": fetch_date,
			}
		}
		if policy_name in loadPolicies():
			updatePolicyEntry(policy_name, policy_data)
		else:
			addNewPolicy(policy_name, policy_data)

	def __init__(self, data_source, mode=0, substring_mode=1):
		_mode = 0
		if type(mode) == int and mode < len(self.modes):
			_mode = mode
		_substring_mode = 1
		if type(substring_mode) == int and substring_mode < len(self.substring_modes):
			_substring_mode = substring_mode
		self.substring_mode = self.substring_modes[_substring_mode]
		self.mode = self.modes[_mode]
		self.data_source = data_source
		self.analysis_model = GeminiModel()
		self.model_interface = LLMInterface(self.analysis_model)

	def promptBasedSubstring(
		self, _question_set, chunk_content, policy_content, chunk_hash, policy_hash
	):

		with_embeddings: dict = self.model_interface.processEmbeddings(_question_set)

		_ = list(with_embeddings.keys())[0]
		question_data = with_embeddings[_]
		preprocessed_questions = self.getDuplicateQuestions(question_data)

		modified_question_set = ast.literal_eval(_question_set)
		question_dict_key = list(modified_question_set.keys())[0]
		modified_question_data = modified_question_set[question_dict_key]
		for i in preprocessed_questions:
			modified_question_data[i[0]].update({"question": i[1]})

		input_question_data = json.dumps(
			{question_dict_key: modified_question_data}, indent=2
		)

		_substring_set = self.model_interface.generateSubstring(
			chunk_content, input_question_data
		)
		substring_set = ast.literal_eval(_substring_set)

		_ = list(substring_set.keys())[0]
		substring_data = substring_set[_]
		for i, s in enumerate(substring_data):
			substring = s["substring"]
			question = question_data[i]["question"]

			substring_indices = None
			if not substring in chunk_content:

				print("NOT IN POLICY")

				minimal_match = getMaxMatchSubstring(substring, chunk_content)
				if minimal_match is not None or minimal_match != "":
					_substring = getCleanedMatch(minimal_match, substring, chunk_content)
					if _substring is not None or _substring != "":
						print(f"found match: {substring} => {_substring}")

						substring = _substring
					else:
						substring = None
				else:
					substring = None
			if substring is None:
				continue
			substring_indices = getSubstringIndices(policy_content, substring)
			saved_question_data = loadQuestions()
			question_update = {
				"substring": substring,
				"substring_indices": substring_indices,
				"chunk_hash": chunk_hash,
				"method": "PROMPT",
			}
			if question in saved_question_data:

				if policy_hash in saved_question_data:
					previous = saved_question_data[policy_hash]
					update = [*previous, question_update]
					updateQuestionEntry(
						question,
						{policy_hash: [update]},
					)

			else:
				addNewQuestion(
					question,
					{
						"embedding_vector": question_data[i]["embedding_vector"],
						policy_hash: [question_update],
					},
				)

	def factBasedSubstrings(
		self, _question_set, chunk_content, policy_content, chunk_hash, policy_hash
	):
		with_embeddings: dict = self.model_interface.processEmbeddings(_question_set)

		_ = list(with_embeddings.keys())[0]
		question_data = with_embeddings[_]
		preprocessed_questions = self.getDuplicateQuestions(question_data)

		modified_question_set = ast.literal_eval(_question_set)
		question_dict_key = list(modified_question_set.keys())[0]
		modified_question_data = modified_question_set[question_dict_key]
		for i in preprocessed_questions:
			modified_question_data[i[0]].update({"question": i[1]})

		questions = modified_question_data
		chunk_lines = splitNewlines(chunk_content)
		facts = [GeminiModel.preprocessStatement_alt(q["question"]) for q in questions]

		fact_embeddings: list = [
			e.values
			for e in self.analysis_model.client.models.embed_content(
				model="gemini-embedding-001",
				contents=facts,
				config=types.EmbedContentConfig(task_type="FACT_VERIFICATION"),
			).embeddings
		]

		chunk_embeddings: list = [
			e.values
			for e in self.analysis_model.client.models.embed_content(
				model="gemini-embedding-001",
				contents=chunk_lines,
				config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
			).embeddings
		]
		saved_question_data = loadQuestions()

		for i, fact in enumerate(fact_embeddings):
			idx = np.argmax(np.dot(chunk_embeddings, fact))
			substring = chunk_lines[idx]
			substring_indices = getSubstringIndices(policy_content, substring)
			q = questions[i]["question"]
			question_update = {
				"substring": substring,
				"substring_indices": substring_indices,
				"chunk_hash": chunk_hash,
				"method": "FACT_EMBEDDINGS",
			}

			if q in saved_question_data:

				if policy_hash in saved_question_data:
					previous = saved_question_data[policy_hash]
					update = [*previous, question_update]
					updateQuestionEntry(
						q,
						{policy_hash: update},
					)

			else:
				addNewQuestion(
					q,
					{
						"embedding_vector": question_data[i]["embedding_vector"],
						"retreval_embedding_vector": fact,
						policy_hash: [question_update],
					},
				)

	def runAnalyses(self, mode=None, limit_iterations=None):
		if mode is not None and mode in self.modes:
			self.mode = mode

		for policy_name, policy_url in self.data_source.items():
			policy_content, policy_hash = AnalysisProcessor.processUrl(policy_url)

			if self.isStored(policy_name, policy_hash):
				if self.mode == "DEBUG_QUESTION_GENERATION":
					policy_chunks = loadPolicies()[policy_name][policy_hash]["policy_chunks"]
				else:
					continue
			else:

				policy_chunks = self.processChunks(policy_content)
				self.updatePolicyData(policy_content, policy_chunks, policy_name, policy_hash)

			iterations = 0

			for chunk in policy_chunks:
				if limit_iterations is not None and type(iterations) == int:
					print(iterations)
					if iterations >= limit_iterations:
						break
				iterations += 1

				chunk_hash = list(chunk.keys())[0]
				# chunk_embedding = chunk.pop("retreval_embedding_vector")
				chunk_content = list(chunk.values())[0]

				_question_set: str = self.model_interface.generateQuestions(chunk_content)
				question_set = ast.literal_eval(_question_set)
				if self.mode == "DEBUG_QUESTION_GENERATION":

					_ = list(question_set.keys())[0]
					question_data = question_set[_]
					for i, q in enumerate(question_data):
						question = question_data[i]["question"]
						addNewQuestion(question, {})
				else:
					if self.substring_mode == "PROMPT":
						self.promptBasedSubstring(
							_question_set, chunk_content, policy_content, chunk_hash, policy_hash
						)
					elif self.substring_mode == "FACT_EMBEDDINGS":
						self.factBasedSubstrings(
							_question_set, chunk_content, policy_content, chunk_hash, policy_hash
						)
					elif self.substring_mode == "TESTING":
						saved_question_data = loadQuestions()
						saved_policy_data = loadPolicies()
						computed_policies = []
						for k, v in saved_policy_data:
							policy_name = k
							if type(v) == dict:
								saved_policy_hashes = list(v.keys())
								for i in saved_policy_hashes:
									chunk_hashes = []

									for j in v[saved_policy_hashes]["policy_chunks"]:


# Split into a question computation pipeline, that generates the question, dict with embedding_vector, retreval_embedding_vector?, and relevant policy_hash:{chunk_hash} signiture.
# Means we can filter questions before processing
# Then seperate the substring information into its own pipeline
