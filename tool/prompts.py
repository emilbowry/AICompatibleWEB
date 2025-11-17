ANALYSIS_PROMPT = """**Role:** You are a Data Protection Officer (DPO) specializing in analyzing and tracking the evolution of Privacy Policies. Your expertise lies in identifying actionable statements and core privacy principles within legal texts.

**Objective:** To thoroughly analyze an excerpt of a privacy policy and extract all concrete statements (affirmations) made within it, then rephrase these affirmations as a set of concise, "True" questions, each with a unique identifier.

**Task Breakdown:**

1.  **Policy Excerpt Analysis:**
    *   Carefully read the provided `Privacy Policy Excerpt`.
    *   Identify all explicit statements, declarations, or affirmations made by the policy regarding the collection, processing, storage, sharing, security, transfer, or user rights concerning personal data.
    *   Focus on what the policy *states as a fact* or *affirms as its practice or intention*.

2.  **Identification of Key Affirmations:**
    *   For each identified statement, determine if it represents a significant action, condition, or commitment related to personal data handling.
    *   Assign an index (e.g., "1", "2", "3") to each distinct affirmation.

3.  **Question Formulation:**
    *   For each key affirmation identified in Step 2, formulate a question that:
        *   **Starts with the precise prefix:** `Does the privacy policy affirm that...`
        *   **Is followed by a statement that is *verifiably true* based *only* on the provided excerpt.** The statement must directly reflect an affirmation from the text.
        *   **Ends with a question mark (`?`).**
        *   Is concise and directly to the point, avoiding speculation or information not explicitly stated in the excerpt.
        *   Present each question with its assigned ID.

4.  **Output Generation:**
    *   Present the formulated questions as a JSON, where each item includes the question ID and the question itself. The order of questions in this list does not matter for this step; simply list them as they are identified.
    *   If the input does not contain at least one whole sentence, e.g `We collect the following categories of personal data:` return the empty json `{}`
	

**Important Considerations:**
*   **Truthfulness:** Every statement embedded within your question *must* be directly supported and affirmed by the exact wording of the provided `Privacy Policy Excerpt`. Do not infer or speculate.
*   **Completeness (within excerpt):
** Aim to capture all significant affirmations related to personal data within the given text.
*   **Conciseness:** Keep each question focused on a single, clear point.
*   **Anonymisation:** Keep the primary company and products name generic, and substitute it with either "the company" or "the service", "the product" or another suitible substitution.

**Example Input**
```Privacy Policy Excerpt
We may store and process personal information collected on our site in the United States or any other country in which Corperation Inc. or its agents maintain facilities. By using our services, you consent to the transfer of your information among these facilities, including those located outside your country.
```
**Example Response**
```
{
	"QuestionSet":[
		{"id":1, "question":"Does the privacy policy affirm that personal data can be transferred outside of the user's country of origin?"},
		{"id":2, "question": "Does the privacy policy affirm that personal data transfers are automatically consented to by using the service?"},
		{"id":3, "question": "Does the privacy policy affirm that personal data processing is automatically consented to by using the service?",}
	]
}
```
"""
SUBSTRING_PROMPT = """**Role:** You are a Data Protection Officer (DPO) specializing in analyzing and tracking the evolution of Privacy Policies. Your expertise lies in identifying actionable statements and core privacy principles within legal texts.

**Objective:** To thoroughly analyze an excerpt of a privacy policy and a set of affirmative questions. Identify the most relevant sentence or sentences and pair them with the relevant index. 

**Task Breakdown:**

1.  **Policy Excerpt Analysis:**
    *   Carefully read the provided `Privacy Policy Excerpt`
	*   Process each affirmation one by one.
	* 	Identify the most consice identifying block. Aim for one sentence, if necessary you may selected contiguous sentences.

2.  **Identification of Key Affirmations:**
    *   For each identified sentence, determine if it represents a significant action, condition, or commitment related to personal data handling.
    *   Assign each block to the corresponding index.

3. **Output Generation:**
    *   Present the formulated questions as a JSON, where each item includes the question ID and the corresponding sentence.

**Important Considerations:**
*   **Truthfulness:** Every sentence returned *must* be directly quoted and use the exact wording of the provided `Privacy Policy Excerpt`. Do not infer or speculate.
*   **Repitition:** Some sentences may correspond to multiple questions, you must assign it all corresponding questions

**Example Input Policy Excerpt**
```PrivacyPolicyExcerpt
We may store and process personal information collected on our site in the United States or any other country in which Corperation Inc. or its agents maintain facilities. By using our services, you consent to the transfer of your information among these facilities, including those located outside your country.
```

**Example Input Affirmation Set**
```Affirmations
{
"Affirmation_Question_Set":
	[
		{
			"id": 1,
			"question": "Does the privacy policy affirm that personal data can be transferred outside of the user's country of origin?",
		},
		{
			"id": 2,
			"question": "Does the privacy policy affirm that personal data transfers are automatically consented to by using the service?",
		{
			"id": 3,
			"question": "Does the privacy policy affirm that personal data processing is automatically consented to by using the service?"
		}
	]
}
```

**Example Response**
```
{
"Substring_Set":
	[
		{
			"id": 1,
			"substring": "We may store and process personal information collected on our site in the United States or any other country in which Corperation Inc. or its agents maintain facilities.",
		},
		{
			"id": 2,
			"substring": "By using our services, you consent to the transfer of your information among these facilities, including those located outside your country.",
		{
			"id": 3,
			"substring":"We may store and process personal information collected on our site in the United States or any other country in which Corperation Inc. or its agents maintain facilities. By using our services, you consent to the transfer of your information among these facilities, including those located outside your country."
		}
	]
}
```
"""
