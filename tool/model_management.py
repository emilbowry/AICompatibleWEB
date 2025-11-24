import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import numpy as np

embedding_models = {
	"Legacy_1": "models/embedding-001",
	"Legacy_2": "models/text-embedding-004",
	"Current": "models/gemini-embedding-001",
}

chat_models = {
	"FLASH_LATEST": "gemini-2.5-flash-preview-09-2025",
	"PRO": "gemini-2.5-pro",
	"PRO_NEW": "gemini-3-pro-preview",
}


class GeminiModel:
	# DEFAULT_CHAT_MODEL = chat_models["FLASH_LATEST"]
	DEFAULT_CHAT_MODEL = chat_models["PRO_NEW"]

	DEFAULT_EMBEDDING_MODEL = embedding_models["Current"]

	def __init__(self, *, api_key=None):
		if api_key is None:
			load_dotenv()
			GOOGLE_API_KEY = self.getEnvAPIKey()
		else:
			GOOGLE_API_KEY = api_key
		self.client = genai.Client(api_key=GOOGLE_API_KEY)

	def getEnvAPIKey(self):
		load_dotenv()
		return os.environ.get("GEMINI_API_KEY")

	def startChat(self, *, model_name=None, config=None):

		if model_name is None:
			model_name = self.DEFAULT_CHAT_MODEL

		chat = self.client.chats.create(model=model_name, config=config)
		return chat

	def generateContent(self, prompt, *, model_name=None, config=None):
		if model_name is None:
			model_name = self.DEFAULT_CHAT_MODEL
		response = self.client.models.generate_content(
			model=model_name, contents=prompt, config=config
		)
		return response.text

	def send_prompt(self, chat, prompt):
		response = chat.send_message(prompt)
		return response.text

	def getSemanticEmbedding(
		self, _semantic_datum, *, model_name=None, task_type=None, usePreprocessing=None
	):
		if usePreprocessing is None:
			semantic_datum = _semantic_datum
		elif usePreprocessing == "MAIN":
			semantic_datum = GeminiModel.preprocessStatement(_semantic_datum)
		elif usePreprocessing == "ALT":
			semantic_datum = GeminiModel.preprocessStatement_alt(_semantic_datum)

		if task_type is None:
			# task_type = "SEMANTIC_SIMILARITY"
			task_type = "FACT_VERIFICATION"
		if model_name is None:
			model_name = self.DEFAULT_EMBEDDING_MODEL
		result = self.client.models.embed_content(
			model=model_name,
			contents=semantic_datum,
			config=types.EmbedContentConfig(task_type=task_type),
		)
		return result.embeddings[0].values

	@staticmethod
	def preprocessStatement_alt(statement):
		prefix = "Does the privacy policy affirm"
		replacement = "The privacy policy affirms"
		processed_text = ("The privacy policy affirms" + statement[len(prefix) :])[:-1] + "."

		return processed_text

	@staticmethod
	def preprocessStatement(statement):
		prefix = "Does the privacy policy affirm that "
		processed_text = (statement[len(prefix) :].capitalize())[:-1] + "."
		return processed_text
