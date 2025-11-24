const DOCUMENTS: New_DocumentMap = {
	doc_alpha: `# Project Alpha Analysis

This document contains the preliminary results.
We observed several key factors.

## Key Findings

1. Velocity increased by 20% in Q3.
2. Bug reports dropped significantly.
3. Customer satisfaction is high.

## Risks

- Legacy systems are a bottleneck.
- API rate limits are being hit frequently.
`,
	doc_beta: `# Project Beta Review

This is the secondary analysis for Beta.
While promising, there are overlaps.

## Shared Observations

1. Velocity increased by 20% in Q3.
2. API rate limits are being hit frequently.

## Beta Specifics

- The new UI framework is causing blocking.
- Mobile adoption is up 40%.
`,
};

const NEW_MOCK_JSON_DATA: AnalysisData = {
	a: [
		{ docId: "doc_alpha", start: 128, end: 160 }, // "1. Velocity..."
		{ docId: "doc_alpha", start: 164, end: 198 }, // "1. Bug..."
		{ docId: "doc_beta", start: 129, end: 161 }, // "1. Velocity..."
		{ docId: "doc_beta", start: 273, end: 299 }, // "- Mobile..."
	],

	b: [
		{ docId: "doc_alpha", start: 246, end: 278 }, // "1. Legacy
	],
	c: [
		{ docId: "doc_beta", start: 229, end: 270 }, // "- The new UI..."
	],
};