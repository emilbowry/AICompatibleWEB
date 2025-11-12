import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import re
import datetime
import hashlib

current_date = datetime.datetime.now().__str__()
# # String methods


def isInString(string, substring):
	return substring in string


def getSubstringIndices(string, substring):
	start_index = string.find(substring)
	end_index = start_index + len(substring)
	return (start_index, end_index)


# def getHash(data):
# 	# return hash(data)
# 	return hashlib.sha256(data.encode("utf-8")).hexdigest()
# Markdown Methods


def splitMarkdown(markdown_text):
	heading_pattern = r"^#{1,6}\s+.*"
	parts = re.split(heading_pattern, markdown_text, flags=re.MULTILINE)
	content_list = [part.strip() for part in parts[1:] if part.strip()]
	return content_list


def removePreamble(markdown_text):
	pattern = r"\A.*?(?=^#\s)"
	cleaned_text = re.sub(pattern, "", markdown_text, flags=re.DOTALL | re.MULTILINE)
	return cleaned_text


MARKDOWN_LINK_PATTERN = re.compile(r"(\[.*?\])\((.*?)\)")
URL_PLACEHOLDER = "(DYNAMIC_URL_REMOVED)"


def normalize_markdown_links(markdown_text):

	def replacer(match):
		return match.group(1) + URL_PLACEHOLDER

	normalized_text = MARKDOWN_LINK_PATTERN.sub(replacer, markdown_text)
	return normalized_text


def getHash(data):

	cleaned_data = normalize_markdown_links(data)

	return hashlib.sha256(cleaned_data.encode("utf-8")).hexdigest()


# URL Methods

# url = "https://openai.com/policies/privacy-policy/"
# url = "https://www.gemini.com/en-SG/legal/privacy-policy"
# url = "https://www.anthropic.com/legal/privacy"

data_source = {
	"gemini": "https://www.gemini.com/en-SG/legal/privacy-policy",
	"openai": "https://openai.com/policies/privacy-policy/",
	"anthropic": "https://www.anthropic.com/legal/privacy",
}


def extractContent(url, headers=None):
	if headers is None:
		headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
		}

		response = requests.get(url, headers=headers, timeout=10)
		response.raise_for_status()
		html_content = response.text

		soup = BeautifulSoup(html_content, "lxml")

		main_content_element = soup.find("main")

		return main_content_element


def extractMarkdown(main_content):
	return md(str(main_content), heading_style="ATX")


_policy_data = {"policy_markdown": "", "fetch_date": "", "chunks": []}

chunk = {"": ""}
policy_breakdowns = {}
# Policy Methods


def _processPolicy(markdown_content, policy_name, policy_url, policy_hash):
	data = _policy_data.copy()
	data["policy_markdown"] = markdown_content
	data["fetch_date"] = datetime.datetime.now().__str__()
	chunks = []
	proto_chunks = splitMarkdown(markdown_content)
	for i in proto_chunks:
		chunks.append({getHash(i): i})

	data["chunks"] = chunks

	policy_breakdowns[policy_name][policy_hash] = data


def processPolicy(all_policy_data, policy_name, policy_url):
	main_content = extractContent(policy_url)
	markdown_content = removePreamble(extractMarkdown(main_content))
	_hash = getHash(markdown_content)

	if not (policy_name in all_policy_data):
		all_policy_data[policy_name] = {}

	if not (_hash in all_policy_data[policy_name]):
		_processPolicy(markdown_content, policy_name, policy_url, _hash)
	return


processPolicy(policy_breakdowns, "anthropic", "https://www.anthropic.com/legal/privacy")
# extractContent("https://www.anthropic.com/legal/privacy")
import os
from dotenv import load_dotenv

load_dotenv()

_GOOGLE_API_KEY = os.environ.get("GEMINI_API_KEY")
from model_parameters import DEFAULT_MODEL_NAME
from _prompts import ANALYSIS_PROMPT, SUBSTRING_PROMPT

import numpy as np

import google.generativeai

from google import genai
import numpy as np

client = genai.Client(api_key=_GOOGLE_API_KEY)


def send_prompt(chat, prompt):
	response = chat.send_message(prompt)
	return response.text


def startChat(GOOGLE_API_KEY=None, model_name=None):
	if GOOGLE_API_KEY is None:
		GOOGLE_API_KEY = _GOOGLE_API_KEY
	if model_name is None:
		model_name = DEFAULT_MODEL_NAME

	chat = client.chats.create(model=model_name)
	return chat


# def _startChat(GOOGLE_API_KEY=None, model_name=None):
# 	if GOOGLE_API_KEY is None:
# 		GOOGLE_API_KEY = _GOOGLE_API_KEY
# 	if model_name is None:
# 		model_name = DEFAULT_MODEL_NAME
# 	client = genai.Client(api_key=GOOGLE_API_KEY)

# 	chat = client.chats.create(model=model_name)
# 	r = chat.send_message("hello")
# 	print(r.text)
# 	return chat


def getEmbedding(data, GOOGLE_API_KEY):
	try:
		genai.configure(api_key=GOOGLE_API_KEY)
	except AttributeError:
		print("Please set your GEMINI_API_KEY environment variable.")

	result1 = genai.embed_content(
		model="models/embedding-001", content=data, task_type="SEMANTIC_SIMILARITY"
	)
	return np.array(result1["embedding"])


import ast

policy_qs = {}
THRESHOLD = 0.97


def verifyResponse(response):
	if response.startswith("```json") and response.endswith("```"):
		return ast.literal_eval(response[7:-3])
	return None


def getQuestions(subsection):
	chat = startChat()
	_ = send_prompt(chat, ANALYSIS_PROMPT)
	response = send_prompt(chat, str(subsection))
	proto_questions = verifyResponse(response)
	if proto_questions == None:
		return getQuestions(subsection)
	return proto_questions


def produceQuestions(policy_hash, policy_name, policy_breakdown):
	for k, v in policy_breakdowns.items():

		# proto_questions = getQuestions(v)
		print(v)
		break
	# 	for _, w in proto_questions.items():
	# 		embedding = getEmbedding(v, GOOGLE_API_KEY)
	# 		other_embeddings = list(policy_qs.keys())
	# 		hasSimilar = False
	# 		if len(other_embeddings > 0):
	# 			for e in other_embeddings:
	# 				dot_product = np.dot(embedding, e)
	# 				norm1 = np.linalg.norm(embedding)
	# 				norm2 = np.linalg.norm(1)
	# 				if (dot_product / (norm1 * norm2)) > THRESHOLD:
	# 					policy_qs[e].update({policy_hash: k})
	# 					hasSimilar = True
	# 					break
	# 		if not hasSimilar:
	# 			policy_qs.update({e: {policy_hash: k, "question": w}})

	# qs_to_validate = []
	# for k, v in policy_qs.items():
	# 	if policy_hash in v:
	# 		qs_to_validate.append({"policy_hash": v[policy_hash], "question": v["question"]})

	# if len(qs_to_validate) > 0:
	# 	qs_object = {}

	# 	for i, q in enumerate(qs_to_validate):
	# 		qs_object[str(i)] = q["question"]

	# 	chat = startChat()
	# 	_ = send_prompt(chat, ANALYSIS_PROMPT)
	# 	response = send_prompt(chat, f"```{str(qs_object)}```")

	# 	proto_strings = ast.literal_eval(response)
	# 	for k, v in proto_strings.items():
	# 		if not (v in policy_breakdowns[policy_name][policy_hash]["policy_markdown"]):
	# 			for l, w in policy_qs.items():
	# 				if policy_hash in w:
	# 					policy_qs[l].pop(policy_hash)

	# 			return produceQuestions(policy_hash, policy_name, policy_breakdown)

	# # need to add substring logic
	# return


# policy_breakdowns["anthropic"]

produceQuestions(
	"99d2042def1972a39015ce3aabba58396d3836e653a9b424044cf35bf0a7989f",
	"anthropic",
	policy_breakdowns["anthropic"][
		"99d2042def1972a39015ce3aabba58396d3836e653a9b424044cf35bf0a7989f"
	],
)
