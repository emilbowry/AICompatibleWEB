import React, { useEffect, useMemo, useRef, useState } from "react";

// --- Types ---

interface HighlightRange {
	docId: string;
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

interface Theme {
	bg: string;
	btn: string;
	border: string;
}

// --- Mock Data ---

const DOCUMENTS: DocumentMap = {
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

const MOCK_JSON_DATA: AnalysisData = {
	"What are the positive outcomes?": [
		{ docId: "doc_alpha", text: "...", start: 126, end: 162 }, // Velocity
		{ docId: "doc_alpha", text: "...", start: 202, end: 236 }, // Satisfaction
		{ docId: "doc_beta", text: "...", start: 134, end: 170 }, // Velocity
		{ docId: "doc_beta", text: "...", start: 269, end: 298 }, // Mobile
	],
	"What are the technical risks?": [
		{ docId: "doc_alpha", text: "...", start: 249, end: 285 }, // Legacy
		{ docId: "doc_alpha", text: "...", start: 285, end: 329 }, // API
		{ docId: "doc_beta", text: "...", start: 170, end: 215 }, // API
	],
	"What is specific to Alpha?": [
		{ docId: "doc_alpha", text: "...", start: 162, end: 202 }, // Bug reports
	],
	"What is specific to Beta?": [
		{ docId: "doc_beta", text: "...", start: 215, end: 269 }, // UI Framework
	],
};

// --- Color Themes ---

const DOC_THEMES: Record<string, Theme> = {
	doc_alpha: { bg: "#bbf7d0", btn: "#16a34a", border: "#86efac" }, // Green
	doc_beta: { bg: "#fed7aa", btn: "#ea580c", border: "#fdba74" }, // Orange
};

const SHARED_THEME: Theme = {
	bg: "#bfdbfe",
	btn: "#2563eb",
	border: "#93c5fd",
}; // Blue
const COLOR_INACTIVE_BTN = "#e5e7eb";

// --- Style Objects ---

const mainContainerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	fontFamily: "sans-serif",
	width: "100%",
	maxWidth: "1200px",
	margin: "20px auto",
	height: "850px",
	border: "1px solid #ccc",
	borderRadius: "8px",
	overflow: "hidden",
	backgroundColor: "#fff",
};

const topControlBarStyle: React.CSSProperties = {
	padding: "15px",
	backgroundColor: "#f3f4f6",
	borderBottom: "1px solid #e5e7eb",
	display: "flex",
	alignItems: "center",
	gap: "15px",
	zIndex: 10,
};

// Custom Dropdown Styles
const dropdownWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
};

const dropdownButtonStyle: React.CSSProperties = {
	padding: "8px 16px",
	backgroundColor: "#fff",
	border: "1px solid #ccc",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "14px",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	minWidth: "220px",
};

const dropdownMenuStyle: React.CSSProperties = {
	position: "absolute",
	top: "100%",
	left: 0,
	marginTop: "4px",
	backgroundColor: "#fff",
	border: "1px solid #ccc",
	borderRadius: "4px",
	boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
	width: "100%",
	zIndex: 100,
	padding: "5px 0",
};

const dropdownItemStyle: React.CSSProperties = {
	padding: "8px 12px",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	cursor: "pointer",
	fontSize: "14px",
	userSelect: "none",
};

// Layout Styles
const contentAreaStyle: React.CSSProperties = {
	display: "flex",
	flex: 1,
	overflow: "hidden",
};

const sidebarStyle: React.CSSProperties = {
	width: "280px",
	minWidth: "280px",
	backgroundColor: "#f9fafb",
	borderRight: "1px solid #ccc",
	padding: "20px",
	overflowY: "auto",
	display: "flex",
	flexDirection: "column",
	gap: "20px",
};

const docViewerContainerStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "row",
	backgroundColor: "#fff",
	overflow: "hidden",
};

const docColumnStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	borderLeft: "1px solid #eee",
	overflow: "hidden",
	transition: "all 0.3s ease",
};

const docHeaderStyle: React.CSSProperties = {
	padding: "12px",
	borderBottom: "1px solid #eee",
	backgroundColor: "#fff",
	fontWeight: "bold",
	textAlign: "center",
	textTransform: "uppercase",
	fontSize: "12px",
	letterSpacing: "1px",
	color: "#444",
};

const docTextScrollStyle: React.CSSProperties = {
	flex: 1,
	padding: "30px",
	overflowY: "auto",
	fontFamily: "Menlo, Monaco, Consolas, monospace",
	whiteSpace: "pre-wrap",
	lineHeight: "1.6",
	fontSize: "13px",
};

// Bottom section: Shared Data
const sharedFooterStyle: React.CSSProperties = {
	height: "180px",
	borderTop: "2px solid #e5e7eb",
	backgroundColor: "#f8fafc",
	padding: "20px",
	display: "flex",
	flexDirection: "column",
};

const sharedButtonsContainerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
	gap: "10px",
	overflowY: "auto",
};

const sectionHeaderStyle: React.CSSProperties = {
	fontSize: "11px",
	textTransform: "uppercase",
	color: "#6b7280",
	fontWeight: "800",
	marginBottom: "10px",
	letterSpacing: "0.05em",
};

const buttonStyle: React.CSSProperties = {
	padding: "8px 12px",
	border: "1px solid transparent",
	borderRadius: "6px",
	cursor: "pointer",
	textAlign: "left",
	fontSize: "13px",
	lineHeight: "1.4",
	transition: "all 0.2s",
	maxWidth: "300px",
};

const lineBaseStyle: React.CSSProperties = {
	padding: "0 4px",
	borderRadius: "2px",
	transition: "background-color 0.2s, opacity 0.2s",
	minHeight: "1.6em",
};

// --- Component ---

const DocumentAnalysisViewer: React.FC = () => {
	const [selectedDocs, setSelectedDocs] = useState<string[]>(["doc_alpha"]);
	const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Dropdown ref
	const dropdownRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [dropdownRef]);

	// 1. Data Categorization Logic
	const { uniqueMap, sharedList, globalQuestionTypes } = useMemo(() => {
		// Step A: Determine global type (Unique or Shared) for every question based on FULL dataset
		const qTypes: Record<string, "unique" | "shared"> = {};

		Object.entries(MOCK_JSON_DATA).forEach(([question, ranges]) => {
			const uniqueDocsForQuestion = new Set(ranges.map((r) => r.docId));
			if (uniqueDocsForQuestion.size > 1) {
				qTypes[question] = "shared";
			} else {
				qTypes[question] = "unique";
			}
		});

		// Step B: Filter these into lists relevant to the CURRENT selection
		const visibleUniqueMap: Record<string, string[]> = {};
		const visibleSharedList: string[] = [];

		// Initialize unique buckets
		selectedDocs.forEach((docId) => (visibleUniqueMap[docId] = []));

		Object.entries(MOCK_JSON_DATA).forEach(([question, ranges]) => {
			const type = qTypes[question];

			// Check if this question is relevant to any currently selected doc
			const isRelevant = ranges.some((r) =>
				selectedDocs.includes(r.docId)
			);
			if (!isRelevant) return;

			if (type === "shared") {
				// It is shared globally, and appears in our current view
				if (!visibleSharedList.includes(question)) {
					visibleSharedList.push(question);
				}
			} else {
				// It is unique globally
				// Find which doc it belongs to (we know there is only 1 because type is unique)
				const docId = ranges[0].docId;
				// Only add if that doc is currently selected
				if (visibleUniqueMap[docId]) {
					visibleUniqueMap[docId].push(question);
				}
			}
		});

		return {
			uniqueMap: visibleUniqueMap,
			sharedList: visibleSharedList,
			globalQuestionTypes: qTypes,
		};
	}, [selectedDocs]);

	const toggleDoc = (docId: string) => {
		setSelectedDocs((prev) => {
			if (prev.includes(docId)) {
				return prev.filter((d) => d !== docId);
			} else {
				return [...prev, docId];
			}
		});
		setActiveQuestion(null);
	};

	const getParsedLines = (docId: string) => {
		const text = DOCUMENTS[docId] || "";
		const lines = text.split("\n");
		let currentIndex = 0;
		return lines.map((line) => {
			const start = currentIndex;
			const end = start + line.length + 1;
			currentIndex = end;
			return { content: line, start, end };
		});
	};

	// Render Document Column
	const renderDocumentColumn = (docId: string) => {
		const lines = getParsedLines(docId);
		const theme = DOC_THEMES[docId] || {
			bg: "#eee",
			btn: "#999",
			border: "#ccc",
		};

		return (
			<div
				style={docColumnStyle}
				key={docId}
			>
				<div
					style={{
						...docHeaderStyle,
						borderTop: `4px solid ${theme.btn}`,
					}}
				>
					{docId.replace("doc_", "Document ")}
				</div>
				<div style={docTextScrollStyle}>
					{lines.map((line, index) => {
						let isMatch = false;
						let highlightColor = "transparent";

						if (activeQuestion) {
							const ranges = MOCK_JSON_DATA[activeQuestion] || [];
							const docRanges = ranges.filter(
								(r) => r.docId === docId
							);

							isMatch = docRanges.some(
								(range) =>
									range.start < line.end &&
									range.end > line.start
							);

							if (isMatch) {
								// Use the Global Type to decide color.
								// If it's a shared fact, use Blue. If unique, use Doc Color.
								if (
									globalQuestionTypes[activeQuestion] ===
									"shared"
								) {
									highlightColor = SHARED_THEME.bg;
								} else {
									highlightColor = theme.bg;
								}
							}
						}

						const opacity = activeQuestion && !isMatch ? 0.3 : 1;
						const isHeader = line.content.trim().startsWith("#");

						return (
							<div
								key={index}
								style={{
									...lineBaseStyle,
									backgroundColor: highlightColor,
									opacity: opacity,
									fontWeight: isHeader ? "bold" : "normal",
									fontSize: isHeader ? "1.1em" : "1em",
								}}
							>
								{line.content || "\u00A0"}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Render Button
	const renderButton = (
		q: string,
		type: "unique" | "shared",
		docId?: string
	) => {
		const isActive = activeQuestion === q;
		let theme = SHARED_THEME;

		if (type === "unique" && docId) {
			theme = DOC_THEMES[docId];
		}

		return (
			<button
				key={q}
				onClick={() => setActiveQuestion(isActive ? null : q)}
				style={{
					...buttonStyle,
					backgroundColor: isActive
						? theme.btn
						: type === "shared"
						? "#fff"
						: COLOR_INACTIVE_BTN,
					color: isActive ? "white" : "black",
					border: isActive
						? "1px solid transparent"
						: "1px solid #d1d5db",
					borderLeft: isActive
						? "1px solid transparent"
						: `4px solid ${theme.border}`,
				}}
			>
				{q}
			</button>
		);
	};

	return (
		<div style={mainContainerStyle}>
			{/* 1. Top Controls */}
			<div style={topControlBarStyle}>
				<label style={{ fontWeight: "bold", fontSize: "14px" }}>
					Select Documents:
				</label>

				{/* Custom Multi-Select Dropdown */}
				<div
					style={dropdownWrapperStyle}
					ref={dropdownRef}
				>
					<button
						style={dropdownButtonStyle}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<span>
							{selectedDocs.length === 0
								? "Select..."
								: selectedDocs.length ===
								  Object.keys(DOCUMENTS).length
								? "All Documents"
								: `${selectedDocs.length} Selected`}
						</span>
						<span style={{ fontSize: "10px" }}>▼</span>
					</button>

					{isDropdownOpen && (
						<div style={dropdownMenuStyle}>
							{Object.keys(DOCUMENTS).map((docId) => {
								const isSelected = selectedDocs.includes(docId);
								return (
									<div
										key={docId}
										style={{
											...dropdownItemStyle,
											backgroundColor: isSelected
												? "#f3f4f6"
												: "#fff",
										}}
										onClick={() => toggleDoc(docId)}
									>
										<input
											type="checkbox"
											checked={isSelected}
											readOnly
											style={{ pointerEvents: "none" }}
										/>
										{docId.replace("doc_", "Document ")}
									</div>
								);
							})}
						</div>
					)}
				</div>

				<button
					onClick={() => setActiveQuestion(null)}
					style={{
						marginLeft: "auto",
						padding: "5px 12px",
						cursor: "pointer",
						border: "1px solid #ccc",
						borderRadius: "4px",
						background: "#fff",
					}}
				>
					Clear Highlights
				</button>
			</div>

			{/* 2. Middle Content Area */}
			<div style={contentAreaStyle}>
				{/* Left Sidebar: Unique Data */}
				<div style={sidebarStyle}>
					{selectedDocs.length === 0 && (
						<div
							style={{
								color: "#999",
								fontSize: "13px",
								fontStyle: "italic",
							}}
						>
							No documents selected
						</div>
					)}

					{selectedDocs.map((docId) => {
						const questions = uniqueMap[docId] || [];
						return (
							<div
								key={docId}
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "8px",
								}}
							>
								<div
									style={{
										...sectionHeaderStyle,
										borderBottom: `2px solid ${DOC_THEMES[docId].border}`,
										paddingBottom: "4px",
									}}
								>
									Unique to {docId.replace("doc_", "")}
								</div>
								{questions.length > 0 ? (
									questions.map((q) =>
										renderButton(q, "unique", docId)
									)
								) : (
									<div
										style={{
											fontSize: "12px",
											color: "#ccc",
											marginBottom: "10px",
										}}
									>
										None
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* Right Area: Documents */}
				<div style={docViewerContainerStyle}>
					{selectedDocs.length === 0 && (
						<div style={{ margin: "auto", color: "#ccc" }}>
							Please select a document from the dropdown above.
						</div>
					)}
					{selectedDocs.map((docId) => renderDocumentColumn(docId))}
				</div>
			</div>

			{/* 3. Bottom Footer: Shared Data */}
			<div style={sharedFooterStyle}>
				<div style={sectionHeaderStyle}>
					Shared Data (Relevant to Selected Documents)
				</div>
				<div style={sharedButtonsContainerStyle}>
					{sharedList.length > 0 ? (
						sharedList.map((q) => renderButton(q, "shared"))
					) : (
						<span style={{ color: "#999", fontSize: "13px" }}>
							No shared data found for selected documents.
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export { DocumentAnalysisViewer };
