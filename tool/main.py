from analysis_processor import AnalysisProcessor

data_source = {
	"openai": "https://openai.com/policies/privacy-policy/",
	"anthropic": "https://www.anthropic.com/legal/privacy",
	# "perplexity": "https://www.perplexity.ai/hub/legal/privacy-policy",	# HTTPError: 403 Client Error: Forbidden for url: https://www.perplexity.ai/hub/legal/privacy-policy
	# "deepseek": "https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html", # Returns None
}
a = AnalysisProcessor(data_source)
a.runAnalyses()
a.runSubstringAnalysis("FACT_EMBEDDINGS")
