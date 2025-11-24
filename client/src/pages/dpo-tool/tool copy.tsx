import React, { useMemo, useState } from "react";

// --- Types ---

interface HighlightRange {
	docId: string; // Identifier for the document
	text: string;
	start: number;
	end: number;
}

interface AnalysisData {
	[question: string]: HighlightRange[];
}

interface DocumentMap {
	[docId: string]: string;
}

// --- Mock Data ---

const DOCUMENTS: DocumentMap = {
	doc_alpha: `# Project Alpha Analysis

This document contains the preliminary results of the analysis.
We observed several key factors contributing to the success.

## Key Findings

1. Velocity increased by 20% in Q3.
2. Bug reports dropped significantly.
3. Customer satisfaction scores are at an all-time high.

## Risks

- Dependency on legacy systems remains a bottleneck.
- API rate limits are being hit frequently.
`,
	doc_beta: `# Project Beta Review

This is the secondary analysis for the beta initiative.
While promising, there are overlaps with Alpha.

## Shared Observations

1. Velocity increased by 20% in Q3.
2. API rate limits are being hit frequently.

## Beta Specifics

- The new UI framework is causing render blocking.
- Mobile adoption is up 40%.
`,
};

// Note: 'Velocity' and 'API limits' appear in both. 'Customer satisfaction' only in Alpha. 'Mobile adoption' only in Beta.
const MOCK_JSON_DATA: AnalysisData = {
	"What are the positive outcomes?": [
		{
			docId: "doc_alpha",
			text: "1. Velocity increased by 20% in Q3.\n",
			start: 146,
			end: 182,
		},
		{
			docId: "doc_alpha",
			text: "3. Customer satisfaction scores are at an all-time high.\n",
			start: 222,
			end: 279,
		},
		{
			docId: "doc_beta",
			text: "1. Velocity increased by 20% in Q3.\n",
			start: 139,
			end: 175,
		},
		{
			docId: "doc_beta",
			text: "- Mobile adoption is up 40%.\n",
			start: 279,
			end: 308,
		},
	],
	"What are the technical risks?": [
		{
			docId: "doc_alpha",
			text: "- Dependency on legacy systems remains a bottleneck.\n",
			start: 294,
			end: 347,
		},
		{
			docId: "doc_alpha",
			text: "- API rate limits are being hit frequently.\n",
			start: 347,
			end: 391,
		},
		{
			docId: "doc_beta",
			text: "2. API rate limits are being hit frequently.\n",
			start: 175,
			end: 220,
		},
	],
	"What is specific to Alpha?": [
		{
			docId: "doc_alpha",
			text: "2. Bug reports dropped significantly.\n",
			start: 182,
			end: 222,
		},
	],
};

// --- Individual Styles ---

const containerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	fontFamily: "sans-serif",
	maxWidth: "1100px",
	margin: "20px auto",
	height: "700px",
};

const controlsStyle: React.CSSProperties = {
	marginBottom: "10px",
	padding: "10px",
	backgroundColor: "#f3f4f6",
	borderRadius: "8px",
	border: "1px solid #ccc",
	display: "flex",
	alignItems: "center",
	gap: "10px",
};

const viewerContainerStyle: React.CSSProperties = {
	display: "flex",
	flex: 1,
	border: "1px solid #ccc",
	borderRadius: "8px",
	overflow: "hidden",
};

const sidebarStyle: React.CSSProperties = {
	width: "350px",
	backgroundColor: "#f9fafb",
	borderRight: "1px solid #ccc",
	padding: "20px",
	overflowY: "auto",
};

const contentStyle: React.CSSProperties = {
	flex: 1,
	padding: "40px",
	overflowY: "auto",
	display: "flex",
	flexDirection: "column",
};

const sectionHeaderStyle: React.CSSProperties = {
	fontSize: "14px",
	textTransform: "uppercase",
	color: "#6b7280",
	fontWeight: "bold",
	marginTop: "20px",
	marginBottom: "10px",
	letterSpacing: "0.05em",
};

const buttonGroupStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: "8px",
};

const baseButtonStyle: React.CSSProperties = {
	padding: "10px",
	border: "1px solid transparent",
	borderRadius: "6px",
	cursor: "pointer",
	textAlign: "left",
	fontSize: "13px",
	transition: "all 0.2s",
	lineHeight: "1.4",
};

const clearButtonStyle: React.CSSProperties = {
	...baseButtonStyle,
	marginTop: "20px",
	backgroundColor: "#fff",
	border: "1px solid #d1d5db",
	width: "100%",
	textAlign: "center",
};

const selectStyle: React.CSSProperties = {
	padding: "5px 10px",
	fontSize: "14px",
	borderRadius: "4px",
	border: "1px solid #ccc",
};

const markdownContainerStyle: React.CSSProperties = {
	fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
	whiteSpace: "pre-wrap",
	lineHeight: "1.6",
	fontSize: "14px",
};

const lineBaseStyle: React.CSSProperties = {
	padding: "0 4px",
	borderRadius: "2px",
	transition: "background-color 0.2s, opacity 0.2s",
};

// Colors for highlights
const COLOR_UNIQUE_BG = "#bbf7d0"; // Light Green
const COLOR_UNIQUE_BTN = "#16a34a"; // Dark Green (for active button)
const COLOR_SHARED_BG = "#bfdbfe"; // Light Blue
const COLOR_SHARED_BTN = "#2563eb"; // Dark Blue (for active button)
const COLOR_INACTIVE_BTN = "#e5e7eb";

// --- Component ---

const MarkdownHighlighter: React.FC = () => {
	const [selectedDocId, setSelectedDocId] = useState<string>("doc_alpha");
	const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

	// 1. Parse the current document into lines with indices
	const linesWithIndices = useMemo(() => {
		const text = DOCUMENTS[selectedDocId] || "";
		const lines = text.split("\n");
		let currentIndex = 0;

		return lines.map((line) => {
			const start = currentIndex;
			const end = start + line.length + 1;
			currentIndex = end;
			return { content: line, start, end };
		});
	}, [selectedDocId]);

	// 2. Categorize questions into Unique (this doc only) vs Shared (this doc + others)
	const { uniqueQuestions, sharedQuestions } = useMemo(() => {
		const unique: string[] = [];
		const shared: string[] = [];

		Object.entries(MOCK_JSON_DATA).forEach(([question, ranges]) => {
			// Get all distinct docIds associated with this question
			const involvedDocs = Array.from(
				new Set(ranges.map((r) => r.docId))
			);

			// Only care if this question has an answer in the CURRENT document
			if (involvedDocs.includes(selectedDocId)) {
				if (involvedDocs.length === 1) {
					unique.push(question);
				} else {
					shared.push(question);
				}
			}
		});

		return { uniqueQuestions: unique, sharedQuestions: shared };
	}, [selectedDocId]);

	// 3. Check if line is highlighted
	// Returns: 'unique' | 'shared' | null
	const getHighlightType = (
		lineStart: number,
		lineEnd: number
	): "unique" | "shared" | null => {
		if (!activeQuestion) return null;

		const ranges = MOCK_JSON_DATA[activeQuestion];

		// Filter ranges to only the current doc
		const validRanges = ranges.filter((r) => r.docId === selectedDocId);

		const isMatch = validRanges.some(
			(range) => range.start < lineEnd && range.end > lineStart
		);

		if (!isMatch) return null;

		// Check if the active question is unique or shared to return correct color type
		return uniqueQuestions.includes(activeQuestion) ? "unique" : "shared";
	};

	// Helper to render a list of buttons
	const renderButtons = (questions: string[], type: "unique" | "shared") => (
		<div style={buttonGroupStyle}>
			{questions.map((question) => {
				const isActive = activeQuestion === question;
				const activeColor =
					type === "unique" ? COLOR_UNIQUE_BTN : COLOR_SHARED_BTN;

				return (
					<button
						key={question}
						onClick={() =>
							setActiveQuestion(isActive ? null : question)
						}
						style={{
							...baseButtonStyle,
							backgroundColor: isActive
								? activeColor
								: COLOR_INACTIVE_BTN,
							color: isActive ? "white" : "black",
							borderLeft: isActive
								? "none"
								: `4px solid ${
										type === "unique"
											? "#86efac"
											: "#93c5fd"
								  }`,
						}}
					>
						{question}
					</button>
				);
			})}
			{questions.length === 0 && (
				<div
					style={{
						color: "#9ca3af",
						fontStyle: "italic",
						fontSize: "12px",
					}}
				>
					None found
				</div>
			)}
		</div>
	);

	return (
		<div style={containerStyle}>
			{/* Controls to switch Mock Documents */}
			<div style={controlsStyle}>
				<label style={{ fontWeight: "bold", fontSize: "14px" }}>
					Selected Document:
				</label>
				<select
					style={selectStyle}
					value={selectedDocId}
					onChange={(e) => {
						setSelectedDocId(e.target.value);
						setActiveQuestion(null); // Reset highlight on doc switch
					}}
				>
					{Object.keys(DOCUMENTS).map((id) => (
						<option
							key={id}
							value={id}
						>
							{id}
						</option>
					))}
				</select>
			</div>

			<div style={viewerContainerStyle}>
				{/* Left Panel: Categorized Questions */}
				<div style={sidebarStyle}>
					<div style={sectionHeaderStyle}>Unique Data</div>
					{renderButtons(uniqueQuestions, "unique")}

					<div style={sectionHeaderStyle}>Shared Data</div>
					{renderButtons(sharedQuestions, "shared")}

					<button
						onClick={() => setActiveQuestion(null)}
						style={clearButtonStyle}
					>
						Clear Highlights
					</button>
				</div>

				{/* Right Panel: Markdown Display */}
				<div style={contentStyle}>
					<div style={markdownContainerStyle}>
						{linesWithIndices.map((line, index) => {
							const highlightType = getHighlightType(
								line.start,
								line.end
							);
							const isHeader = line.content
								.trim()
								.startsWith("#");

							let bgColor = "transparent";
							if (highlightType === "unique")
								bgColor = COLOR_UNIQUE_BG;
							if (highlightType === "shared")
								bgColor = COLOR_SHARED_BG;

							return (
								<div
									key={index}
									style={{
										...lineBaseStyle,
										backgroundColor: bgColor,
										fontWeight: isHeader
											? "bold"
											: "normal",
										fontSize: isHeader ? "1.2em" : "1em",
										opacity:
											activeQuestion && !highlightType
												? 0.3
												: 1,
									}}
								>
									{line.content || "\u00A0"}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export { MarkdownHighlighter };
