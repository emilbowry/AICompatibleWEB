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

QUESTIONS_FILE = "./questions.json"
POLICIES_FILE = "./policies.json"


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

	@staticmethod
	def processChunks(policy_content):
		proto_chunks = AnalysisProcessor.splitMarkdown(policy_content)
		chunks = []
		for i in proto_chunks:
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

	def __init__(self, data_source):
		self.data_source = data_source

	def runAnalyses(self):

		analysis_model = GeminiModel()
		model_interface = LLMInterface(analysis_model)

		for policy_name, policy_url in self.data_source.items():
			policy_content, policy_hash = AnalysisProcessor.processUrl(policy_url)

			if self.isStored(policy_name, policy_hash):
				continue

			policy_chunks = AnalysisProcessor.processChunks(policy_content)
			self.updatePolicyData(policy_content, policy_chunks, policy_name, policy_hash)

			# iterations = 0

			for chunk in policy_chunks:
				# if iterations == 5:
				# 	break
				chunk_hash = list(chunk.keys())[0]
				chunk_content = list(chunk.values())[0]

				_question_set: str = model_interface.generateQuestions(chunk_content)
				with_embeddings: dict = model_interface.process_embeddings(_question_set)

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

				_substring_set = model_interface.generateSubstring(
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
					if question in saved_question_data:
						question_update = {
							"substring": substring,
							"substring_indices": substring_indices,
							"chunk_hash": chunk_hash,
						}
						if policy_hash in saved_question_data:
							previous = saved_question_data[policy_hash]
							update = [*previous, question_update]
							updateQuestionEntry(
								question,
								{policy_hash: update},
							)

					else:
						addNewQuestion(
							question,
							{
								"embedding_vector": question_data[i]["embedding_vector"],
								policy_hash: [
									{
										"substring": substring,
										"substring_indices": substring_indices,
										"chunk_hash": chunk_hash,
									}
								],
							},
						)
