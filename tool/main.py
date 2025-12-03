from analysis_processor import AnalysisProcessor

data_source = {
	"openai": "https://openai.com/policies/privacy-policy/",
	"anthropic": "https://www.anthropic.com/legal/privacy",
	# "perplexity": "https://www.perplexity.ai/hub/legal/privacy-policy",	# HTTPError: 403 Client Error: Forbidden for url: https://www.perplexity.ai/hub/legal/privacy-policy
	# "deepseek": "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html", # Returns None
}
a = AnalysisProcessor(data_source, debug=False)
a.runAnalyses()

a.runSubstringAnalysis("FACT_EMBEDDINGS")
a.runSubstringAnalysis("CROSS_FACTS")
from model_management import GeminiModel
import numpy as np
import concurrent.futures
from google.genai import types

MODEL_NAME = EMBEDDING_MODELS[0]


def preprocessQuestionData(question_data):
	output_dict = {}
	for k in question_data:
		statement = propositionExtraction(k)
		negation = changePrefix(k, NEGATION_PREFIX)
		negation_statement = questionToStatement(k, NEGATION_TO_STATEMENT)
		contrary = changePrefix(k, CONTRARY_PREFIX)
		contrary_statement = questionToStatement(k, CONTRARY_STATEMENT)
		neg_contrary = changePrefix(k, NEG_CONTRARY_PREFIX)
		neg_contrary_statement = changePrefix(k, NEG_CONTRARY_STATEMENT)
		output_dict[k] = [
			k,
			statement,
			negation,
			negation_statement,
			contrary,
			contrary_statement,
			neg_contrary,
			neg_contrary_statement,
		]
	return output_dict


class ReRunException(Exception):
	pass


def reRunGuard(expected_key_length):
	if os.path.isdir(EMBEDDING_STORAGE_DIR):
		entries = os.listdir(EMBEDDING_STORAGE_DIR)
		if entries:
			try:
				loaded = np.load(f"{EMBEDDING_STORAGE_DIR}/{entries[0]}")
				if len(loaded.keys()) == expected_key_length:
					raise ReRunException("Preventing Arbitrary Re-processing")
				else:
					print(len(loaded.keys()))
			except Exception as e:
				if isinstance(e, ReRunException):
					raise e
				pass
