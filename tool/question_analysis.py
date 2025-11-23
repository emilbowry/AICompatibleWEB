# tool/question_analysis.py

from pydantic import BaseModel, Field
from typing import List, Optional
from prompts import ANALYSIS_PROMPT, SUBSTRING_PROMPT
import ast

from model_management import GeminiModel


class Affirmation_Question(BaseModel):
	id: int = Field(description="Question id")
	question: str = Field(
		description="The full question that starts with the prefix 'Does the privacy policy affirm that...' and is verifiably true based on the provided text."
	)


class Affirmation_Question_Set(BaseModel):

	Affirmation_Question_Set: List[Affirmation_Question]


class Substring(BaseModel):
	id: int = Field(
		description="The corresponding Question ID from the input question set"
	)
	substring: str = Field(
		description="The exact substring for the corresponding Question to the Question ID"
	)


class Substring_Set(BaseModel):

	Substring_Set: List[Substring]


class LLMInterface:
	Debug_Section = """### Personal data you provide to us directly

* **Identity and Contact Data:** Anthropic collects identifiers, including your name, email address, and phone number when you sign up for an Anthropic account, or to receive information on our Services. We may also collect or generate indirect identifiers (e.g., “USER12345”).
* **Payment Information:** We shall collect your payment information if you choose to purchase access to Anthropic’s products and services.
* **Inputs and Outputs:** You are able to interact with our Services in a variety of formats, including but not limited to chat, coding, and agentic sessions (**“Prompts”** or **"Inputs"**), which generate responses and actions (**“Outputs”**) based on your Inputs. This includes third-party applications you choose to integrate with our Services. If you include personal data or reference external content in your Inputs, we will collect that information and this information may be reproduced in your Outputs.
* **Feedback on your use of our Services:** We appreciate feedback, including ideas and suggestions for improvement or rating an Output in response to an Input ("**Feedback**"). If you rate an Output in response to an Input—for example, by using the thumbs up/thumbs down icon—we will store the entire related conversation as part of your Feedback. You can learn more about how we use Feedback [here](https://privacy.anthropic.com/en/articles/10023565-how-does-anthropic-use-submitted-feedback).
* **Communication Information:** If you communicate with us, including via our chatbot on our Help site, we collect your name, contact information, and the contents of any messages you send."""

	def __init__(self, model, *, debug=False):
		self.model = model
		if debug == True:
			self.debug = True
		else:
			self.debug = False

	def generateQuestions(self, input_section=None):
		if (self.debug == True) or (input_section is None):
			input_section = LLMInterface.Debug_Section
			print("using debug for qs")

		prompt = f"""{ANALYSIS_PROMPT}

# Input Privacy Policy Excerpt
```excerpt
{input_section}
```
"""
		resp = self.model.generateContent(
			prompt,
			config={
				"response_mime_type": "application/json",
				"response_json_schema": Affirmation_Question_Set.model_json_schema(),
			},
		)

		return resp

	def processEmbeddings(self, _question_set, add_facts=False):
		question_set = ast.literal_eval(_question_set)
		q_set_w_embeddings = question_set.copy()
		q_set_key = list(question_set.keys())[0]
		question_set = question_set[q_set_key]
		for i, q_pair in enumerate(question_set):
			q = q_pair["question"]

			embedding = self.model.getSemanticEmbedding(q, usePreprocessing="MAIN")
			q_set_w_embeddings[q_set_key][i]["embedding_vector"] = embedding
			if add_facts:
				f_embedding = self.model.getSemanticEmbedding(
					q,
					usePreprocessing="ALT",
				)
				q_set_w_embeddings[q_set_key][i]["retrieval_embedding_vector"] = f_embedding

		return q_set_w_embeddings

	def getRetrevalChunkEmbeddings(self, chunk, no_op=False):

		if no_op:
			embedding = None
		else:

			embedding = self.model.getSemanticEmbedding(
				chunk, usePreprocessing=None, task_type="RETRIEVAL_DOCUMENT"
			)

		return embedding

	def generateSubstring(self, input_section=None, question_set=None):
		if question_set is None:
			raise
		if (self.debug == True) or (input_section is None):
			input_section = LLMInterface.Debug_Section
			print("using debug for subs")

		prompt = f"""{SUBSTRING_PROMPT}

**-- Start of input --**
```PrivacyPolicyExcerpt
	{input_section}
```
```Affirmations
	{question_set}
```
**-- End of input --**
"""

		resp = self.model.generateContent(
			prompt,
			config={
				"response_mime_type": "application/json",
				"response_json_schema": Substring_Set.model_json_schema(),
			},
		)

		return resp


# test_model = GeminiModel()


# i = LLMInterface(test_model)

# q_set = i.generateQuestions()
# # print(i.processEmbeddings(q_set))
# # # print(i.generateSubstring(question_set=q_set))
