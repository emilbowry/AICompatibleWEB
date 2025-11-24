import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";

// --- Types ---

interface HighlightRange {
	docId: string;
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

// Indices logic: Overlap detection makes strict exactness less critical,
// but these roughly correspond to the lines in the string above.
const MOCK_JSON_DATA: AnalysisData = {
	"What are the positive outcomes?": [
		{ docId: "doc_alpha", start: 123, end: 159 }, // "1. Velocity..."
		{ docId: "doc_alpha", start: 195, end: 228 }, // "3. Customer..."
		{ docId: "doc_beta", start: 139, end: 175 }, // "1. Velocity..."
		{ docId: "doc_beta", start: 269, end: 298 }, // "- Mobile..."
	],
	"What are the technical risks?": [
		{ docId: "doc_alpha", start: 242, end: 279 }, // "- Legacy..."
		{ docId: "doc_alpha", start: 279, end: 323 }, // "- API..."
		{ docId: "doc_beta", start: 175, end: 220 }, // "2. API..."
	],
	"What is specific to Alpha?": [
		{ docId: "doc_alpha", start: 159, end: 195 }, // "2. Bug reports..."
	],
	"What is specific to Beta?": [
		{ docId: "doc_beta", start: 220, end: 269 }, // "- The new UI..."
	],
};

// --- Themes ---

const DOC_THEMES: Record<string, Theme> = {
	doc_alpha: { bg: "#bbf7d0", btn: "#16a34a", border: "#86efac" },
	doc_beta: { bg: "#fed7aa", btn: "#ea580c", border: "#fdba74" },
};
const SHARED_THEME: Theme = {
	bg: "#bfdbfe",
	btn: "#2563eb",
	border: "#93c5fd",
};
const COLOR_INACTIVE_BTN = "#e5e7eb";

// --- Styles ---

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
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
	fontSize: "14px",
	lineHeight: "1.6",
};

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

// --- CORE LOGIC ---

// 1. Line-Aware Injection
// This preserves markdown syntax by injecting markers AFTER the syntax tokens.
const injectMarkersSafe = (
	markdown: string,
	ranges: { id: string; start: number; end: number }[]
) => {
	const lines = markdown.split("\n");
	let currentIndex = 0;

	const processedLines = lines.map((line) => {
		const lineStart = currentIndex;
		// +1 for the newline that was split
		const lineEnd = lineStart + line.length + 1;
		currentIndex = lineEnd;

		// FIXED LOGIC: Intersection instead of Containment
		// We check if the Range overlaps with the Line.
		// This handles cases where indices are slightly off or skip bullets.
		const activeRange = ranges.find(
			(r) => r.start < lineEnd && r.end > lineStart
		);

		if (!activeRange) return line;

		const id = activeRange.id;
		const startMarker = `|||ID:${id}|||`;
		const endMarker = `|||END|||`;

		// 2. Syntax-Aware Injection
		// We regex to find the content *after* the markdown token

		// Headers (e.g. "## Title")
		if (/^(#{1,6}\s+)(.*)/.test(line)) {
			return line.replace(
				/^(#{1,6}\s+)(.*)/,
				`$1${startMarker}$2${endMarker}`
			);
		}
		// Unordered Lists (e.g. "- Item" or "* Item")
		if (/^(\s*[-*+]\s+)(.*)/.test(line)) {
			return line.replace(
				/^(\s*[-*+]\s+)(.*)/,
				`$1${startMarker}$2${endMarker}`
			);
		}
		// Ordered Lists (e.g. "1. Item")
		if (/^(\s*\d+\.\s+)(.*)/.test(line)) {
			return line.replace(
				/^(\s*\d+\.\s+)(.*)/,
				`$1${startMarker}$2${endMarker}`
			);
		}
		// Blockquotes (e.g. "> Text")
		if (/^(\s*>\s+)(.*)/.test(line)) {
			return line.replace(
				/^(\s*>\s+)(.*)/,
				`$1${startMarker}$2${endMarker}`
			);
		}

		// Plain text / Paragraphs
		if (line.trim().length > 0) {
			return `${startMarker}${line}${endMarker}`;
		}

		return line;
	});

	return processedLines.join("\n");
};

// 2. Parser: Finds the injected tokens and returns React Nodes
const processTextNode = (
	text: string,
	activeQuestion: string | null,
	getColor: (id: string) => string
) => {
	const regex = /\|\|\|ID:(.*?)\|\|\|([^]*?)\|\|\|END\|\|\|/g;

	const parts: ReactNode[] = [];
	let lastIndex = 0;
	let match;

	while ((match = regex.exec(text)) !== null) {
		const [fullMatch, id, content] = match;
		const startIndex = match.index;

		if (startIndex > lastIndex) {
			parts.push(text.substring(lastIndex, startIndex));
		}

		const isActive = activeQuestion === id;
		const color = getColor(id);
		const domId = isActive ? `highlight-target` : undefined;

		parts.push(
			<span
				key={`${id}-${startIndex}`}
				id={domId}
				style={{
					backgroundColor: isActive ? color : "transparent",
					borderBottom: isActive ? "none" : "2px dotted #e5e7eb",
					cursor: "pointer",
					borderRadius: "2px",
					padding: "0 2px",
					transition: "background-color 0.2s",
				}}
			>
				{content}
			</span>
		);

		lastIndex = startIndex + fullMatch.length;
	}

	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}
	return parts;
};

// --- Components ---

const DocumentColumn: React.FC<{
	docId: string;
	markdown: string;
	activeQuestion: string | null;
	ranges: { id: string; start: number; end: number }[];
	globalTypes: Record<string, "unique" | "shared">;
}> = ({ docId, markdown, activeQuestion, ranges, globalTypes }) => {
	// A. Line-Aware Injection
	const processedMarkdown = useMemo(() => {
		return injectMarkersSafe(markdown, ranges);
	}, [markdown, ranges]);

	// B. Custom Components
	const components: Components = useMemo(() => {
		const getColor = (id: string) => {
			const type = globalTypes[id];
			if (type === "shared") return SHARED_THEME.bg;
			return DOC_THEMES[docId]?.bg || "#eee";
		};

		const processChildren = (children: ReactNode): ReactNode => {
			return React.Children.map(children, (child) => {
				if (typeof child === "string") {
					return processTextNode(child, activeQuestion, getColor);
				}
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						...child.props,
						children: processChildren(child.props.children),
					} as any);
				}
				return child;
			});
		};

		return {
			// We allow standard block rendering, just capturing content inside
			p: ({ children }) => (
				<p style={{ marginBottom: "1em" }}>
					{processChildren(children)}
				</p>
			),
			li: ({ children }) => (
				<li style={{ marginBottom: "0.5em" }}>
					{processChildren(children)}
				</li>
			),
			h1: ({ children }) => (
				<h1
					style={{
						fontSize: "1.4em",
						fontWeight: "bold",
						marginTop: "1em",
						marginBottom: "0.5em",
					}}
				>
					{processChildren(children)}
				</h1>
			),
			h2: ({ children }) => (
				<h2
					style={{
						fontSize: "1.2em",
						fontWeight: "bold",
						marginTop: "1em",
						marginBottom: "0.5em",
					}}
				>
					{processChildren(children)}
				</h2>
			),
			blockquote: ({ children }) => (
				<blockquote
					style={{
						borderLeft: "4px solid #ddd",
						paddingLeft: "10px",
						color: "#666",
					}}
				>
					{processChildren(children)}
				</blockquote>
			),
		};
	}, [activeQuestion, globalTypes, docId]);

	return (
		<div style={docColumnStyle}>
			<div
				style={{
					...docHeaderStyle,
					borderTop: `4px solid ${DOC_THEMES[docId].btn}`,
				}}
			>
				{docId.replace("doc_", "Document ")}
			</div>
			<div style={docTextScrollStyle}>
				<ReactMarkdown components={components}>
					{processedMarkdown}
				</ReactMarkdown>
			</div>
		</div>
	);
};

export const DocumentAnalysisViewer: React.FC = () => {
	const [selectedDocs, setSelectedDocs] = useState<string[]>([
		"doc_alpha",
		"doc_beta",
	]);
	const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Click Outside
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
	}, []);

	// Scroll Manager
	useEffect(() => {
		if (activeQuestion) {
			setTimeout(() => {
				const el = document.getElementById("highlight-target");
				if (el)
					el.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 100);
		}
	}, [activeQuestion]);

	// Data Processor
	const { uniqueMap, sharedList, globalQuestionTypes, flatRanges } =
		useMemo(() => {
			const qTypes: Record<string, "unique" | "shared"> = {};
			const rangesList: {
				docId: string;
				id: string;
				start: number;
				end: number;
			}[] = [];

			Object.entries(MOCK_JSON_DATA).forEach(([question, ranges]) => {
				const uniqueDocs = new Set(ranges.map((r) => r.docId));
				qTypes[question] = uniqueDocs.size > 1 ? "shared" : "unique";
				ranges.forEach((r) => rangesList.push({ ...r, id: question }));
			});

			const visUnique: Record<string, string[]> = {};
			const visShared: string[] = [];
			selectedDocs.forEach((d) => (visUnique[d] = []));

			Object.entries(MOCK_JSON_DATA).forEach(([question, ranges]) => {
				if (!ranges.some((r) => selectedDocs.includes(r.docId))) return;

				if (qTypes[question] === "shared") {
					if (!visShared.includes(question)) visShared.push(question);
				} else {
					const docId = ranges[0].docId;
					if (visUnique[docId]) visUnique[docId].push(question);
				}
			});

			return {
				uniqueMap: visUnique,
				sharedList: visShared,
				globalQuestionTypes: qTypes,
				flatRanges: rangesList,
			};
		}, [selectedDocs]);

	const toggleDoc = (docId: string) => {
		setSelectedDocs((prev) =>
			prev.includes(docId)
				? prev.filter((d) => d !== docId)
				: [...prev, docId]
		);
		setActiveQuestion(null);
	};

	const renderButton = (
		q: string,
		type: "unique" | "shared",
		docId?: string
	) => {
		const isActive = activeQuestion === q;
		let theme = SHARED_THEME;
		if (type === "unique" && docId) theme = DOC_THEMES[docId];

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
					borderLeft: isActive
						? "1px solid transparent"
						: `4px solid ${theme.border}`,
					border: isActive
						? "1px solid transparent"
						: "1px solid #ddd",
				}}
			>
				{q}
			</button>
		);
	};

	return (
		<div style={mainContainerStyle}>
			{/* Top Bar */}
			<div style={topControlBarStyle}>
				<label style={{ fontWeight: "bold", fontSize: "14px" }}>
					Select Documents:
				</label>
				<div
					style={{ position: "relative" }}
					ref={dropdownRef}
				>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						style={{
							padding: "8px",
							minWidth: "200px",
							cursor: "pointer",
							border: "1px solid #ccc",
							background: "#fff",
							borderRadius: "4px",
							textAlign: "left",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<span>{selectedDocs.length} Selected</span>{" "}
						<span>▼</span>
					</button>
					{isDropdownOpen && (
						<div
							style={{
								position: "absolute",
								top: "100%",
								left: 0,
								width: "100%",
								background: "#fff",
								border: "1px solid #ccc",
								zIndex: 100,
								boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
							}}
						>
							{Object.keys(DOCUMENTS).map((docId) => (
								<div
									key={docId}
									onClick={() => toggleDoc(docId)}
									style={{
										padding: "8px",
										cursor: "pointer",
										background: selectedDocs.includes(docId)
											? "#f3f4f6"
											: "#fff",
										borderBottom: "1px solid #eee",
									}}
								>
									<input
										type="checkbox"
										checked={selectedDocs.includes(docId)}
										readOnly
										style={{ marginRight: "8px" }}
									/>
									{docId}
								</div>
							))}
						</div>
					)}
				</div>
				<button
					onClick={() => setActiveQuestion(null)}
					style={{
						marginLeft: "auto",
						padding: "5px 10px",
						background: "#fff",
						border: "1px solid #ccc",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					Clear Highlights
				</button>
			</div>

			{/* Main Content */}
			<div style={contentAreaStyle}>
				{/* Sidebar */}
				<div style={sidebarStyle}>
					{selectedDocs.map((docId) => (
						<div key={docId}>
							<div
								style={{
									...sectionHeaderStyle,
									borderBottom: `2px solid ${DOC_THEMES[docId].border}`,
								}}
							>
								Unique to {docId.replace("doc_", "")}
							</div>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "5px",
									marginBottom: "20px",
								}}
							>
								{uniqueMap[docId]?.map((q) =>
									renderButton(q, "unique", docId)
								)}
								{(!uniqueMap[docId] ||
									uniqueMap[docId].length === 0) && (
									<span
										style={{
											fontSize: "12px",
											color: "#ccc",
										}}
									>
										None
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Docs */}
				<div style={docViewerContainerStyle}>
					{selectedDocs.map((docId) => (
						<DocumentColumn
							key={docId}
							docId={docId}
							markdown={DOCUMENTS[docId]}
							activeQuestion={activeQuestion}
							ranges={flatRanges.filter((r) => r.docId === docId)}
							globalTypes={globalQuestionTypes}
						/>
					))}
					{selectedDocs.length === 0 && (
						<div style={{ margin: "auto", color: "#999" }}>
							Select a document to view
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div style={sharedFooterStyle}>
				<div style={sectionHeaderStyle}>Shared Data</div>
				<div style={sharedButtonsContainerStyle}>
					{sharedList.map((q) => renderButton(q, "shared"))}
					{sharedList.length === 0 && (
						<span style={{ fontSize: "12px", color: "#ccc" }}>
							No shared data visible
						</span>
					)}
				</div>
			</div>
		</div>
	);
};
