import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

// --- Types ---

type TDocId = string;
type THighlightId = string;

interface IHighlightRange {
	docId: TDocId;
	start: number;
	end: number;
}

interface IAnalysisData {
	[id: THighlightId]: IHighlightRange[];
}

interface IDocumentMap {
	[docId: TDocId]: string;
}

// AST Node Types
interface ITextNode extends Node {
	type: "text";
	value: string;
}

interface IHighlightNode extends Node {
	type: "highlight";
	data: {
		hName: string;
		hProperties: {
			className: string;
		};
	};
	children: (IHighlightNode | ITextNode)[];
}

interface IFlatSegment {
	start: number;
	end: number;
	ids: THighlightId[];
}

// Future Context State Interface
interface IAnalysisUIState {
	activeIds: THighlightId[];
	setActiveIds: React.Dispatch<React.SetStateAction<THighlightId[]>>;
	selectedDocs: TDocId[];
	setSelectedDocs: React.Dispatch<React.SetStateAction<TDocId[]>>;
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// --- Mock Data ---

const DOCUMENTS: IDocumentMap = {
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

const NEW_MOCK_JSON_DATA: IAnalysisData = {
	a: [
		{ docId: "doc_alpha", start: 128, end: 160 }, // "1. Velocity..."
		{ docId: "doc_alpha", start: 164, end: 198 }, // "2. Bug..."
		{ docId: "doc_beta", start: 129, end: 161 }, // "1. Velocity..."
		{ docId: "doc_beta", start: 273, end: 299 }, // "- Mobile..."
	],
	b: [
		{ docId: "doc_alpha", start: 246, end: 278 }, // "- Legacy..."
	],
	c: [
		{ docId: "doc_beta", start: 229, end: 270 }, // "- The new UI..."
	],
};

// --- Colors ---
const ID_COLORS: Record<THighlightId, string> = {
	a: "#bfdbfe", // Blue (Shared)
	b: "#bbf7d0", // Green (Alpha)
	c: "#fed7aa", // Orange (Beta)
};

const DOC_THEME_COLORS: Record<TDocId, string> = {
	doc_alpha: "#16a34a",
	doc_beta: "#ea580c",
};

// --- Logic: Range Flattening (Remark) ---

const flattenRanges = (docId: TDocId, data: IAnalysisData): IFlatSegment[] => {
	const points = new Set<number>();
	const rangeMap: { id: THighlightId; start: number; end: number }[] = [];

	Object.entries(data).forEach(([id, ranges]) => {
		ranges.forEach((r) => {
			if (r.docId === docId) {
				points.add(r.start);
				points.add(r.end);
				rangeMap.push({ id, start: r.start, end: r.end });
			}
		});
	});

	const sortedPoints = Array.from(points).sort((a, b) => a - b);
	const segments: IFlatSegment[] = [];

	for (let i = 0; i < sortedPoints.length - 1; i++) {
		const start = sortedPoints[i];
		const end = sortedPoints[i + 1];
		const mid = start + (end - start) / 2;

		const activeIds = rangeMap
			.filter((r) => r.start <= mid && r.end >= mid)
			.map((r) => r.id);

		if (activeIds.length > 0) {
			segments.push({ start, end, ids: activeIds });
		}
	}

	return segments;
};

const remarkHighlightPlugin = (options: { segments: IFlatSegment[] }) => {
	return (tree: any) => {
		const { segments } = options;
		if (!segments.length) return;

		visit(tree, "text", (node: any, index, parent) => {
			if (!parent || index === undefined) return;
			if (!node.position) return;

			const textNode = node as ITextNode;
			const nodeStart = node.position.start.offset;
			const nodeEnd = node.position.end.offset;

			const relevantSegments = segments.filter(
				(s) => s.start < nodeEnd && s.end > nodeStart
			);

			if (relevantSegments.length === 0) return;

			const newChildren: (ITextNode | IHighlightNode)[] = [];
			let cursor = nodeStart;

			relevantSegments.sort((a, b) => a.start - b.start);

			for (const seg of relevantSegments) {
				if (cursor < seg.start) {
					newChildren.push({
						type: "text",
						value: textNode.value.slice(
							cursor - nodeStart,
							seg.start - nodeStart
						),
					});
					cursor = seg.start;
				}

				const hStart = Math.max(cursor, seg.start);
				const hEnd = Math.min(nodeEnd, seg.end);

				if (hStart < hEnd) {
					const textContent = textNode.value.slice(
						hStart - nodeStart,
						hEnd - nodeStart
					);

					const classNames = seg.ids
						.map((id) => `hl-${id}`)
						.join(" ");

					newChildren.push({
						type: "highlight",
						data: {
							hName: "span",
							hProperties: { className: classNames },
						},
						children: [{ type: "text", value: textContent }],
					});

					cursor = hEnd;
				}
			}

			if (cursor < nodeEnd) {
				newChildren.push({
					type: "text",
					value: textNode.value.slice(cursor - nodeStart),
				});
			}

			parent.children.splice(index, 1, ...newChildren);
			return index + newChildren.length;
		});
	};
};

// --- Styles (Refactored) ---

const MainContainerStyle: React.CSSProperties = {
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

const TopControlBarStyle: React.CSSProperties = {
	padding: "15px",
	backgroundColor: "#f3f4f6",
	borderBottom: "1px solid #e5e7eb",
	display: "flex",
	alignItems: "center",
	gap: "15px",
	zIndex: 10,
};

const DropdownWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
};

const DropdownButtonStyle: React.CSSProperties = {
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

const DropdownMenuStyle: React.CSSProperties = {
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

const DropdownItemStyle: React.CSSProperties = {
	padding: "8px 12px",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	cursor: "pointer",
	fontSize: "14px",
	userSelect: "none",
};

const ContentAreaStyle: React.CSSProperties = {
	display: "flex",
	flex: 1,
	overflow: "hidden",
};

const SidebarStyle: React.CSSProperties = {
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

const SectionHeaderStyle: React.CSSProperties = {
	fontSize: "11px",
	textTransform: "uppercase",
	color: "#6b7280",
	fontWeight: "800",
	marginBottom: "10px",
	letterSpacing: "0.05em",
};

const ButtonStyle: React.CSSProperties = {
	padding: "8px 12px",
	border: "1px solid transparent",
	borderRadius: "6px",
	cursor: "pointer",
	textAlign: "left",
	fontSize: "13px",
	lineHeight: "1.4",
	transition: "all 0.2s",
	width: "100%",
};

const DocViewerContainerStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "row",
	backgroundColor: "#fff",
	overflow: "hidden",
};

const DocColumnStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	borderLeft: "1px solid #eee",
	overflow: "hidden",
	transition: "all 0.3s ease",
};

const DocHeaderStyle: React.CSSProperties = {
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

const DocTextScrollStyle: React.CSSProperties = {
	flex: 1,
	padding: "30px",
	overflowY: "auto",
	fontFamily: "Georgia, serif",
	whiteSpace: "pre-wrap",
	lineHeight: "1.6",
	fontSize: "14px",
};

// --- Component ---

const DocumentAnalysisViewer: React.FC = () => {
	const [activeIds, setActiveIds] = useState<THighlightId[]>([]);
	const [selectedDocs, setSelectedDocs] = useState<TDocId[]>(["doc_alpha"]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Dropdown Click Outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Element)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [dropdownRef]);

	// 1. Data Categorization Logic (Restored from dual.tsx)
	const { uniqueMap, sharedList } = useMemo(() => {
		const qTypes: Record<THighlightId, "unique" | "shared"> = {};

		// A. Determine Global Type
		Object.entries(NEW_MOCK_JSON_DATA).forEach(([id, ranges]) => {
			const uniqueDocsForQuestion = new Set(ranges.map((r) => r.docId));
			if (uniqueDocsForQuestion.size > 1) {
				qTypes[id] = "shared";
			} else {
				qTypes[id] = "unique";
			}
		});

		// B. Filter for Current View
		const visibleUniqueMap: Record<TDocId, THighlightId[]> = {};
		const visibleSharedList: THighlightId[] = [];

		selectedDocs.forEach((docId) => (visibleUniqueMap[docId] = []));

		Object.entries(NEW_MOCK_JSON_DATA).forEach(([id, ranges]) => {
			const type = qTypes[id];

			// Is this ID relevant to ANY selected doc?
			const isRelevant = ranges.some((r) =>
				selectedDocs.includes(r.docId)
			);
			if (!isRelevant) return;

			if (type === "shared") {
				if (!visibleSharedList.includes(id)) {
					visibleSharedList.push(id);
				}
			} else {
				// It's unique to one doc
				const docId = ranges[0].docId;
				if (visibleUniqueMap[docId]) {
					visibleUniqueMap[docId].push(id);
				}
			}
		});

		return {
			uniqueMap: visibleUniqueMap,
			sharedList: visibleSharedList,
		};
	}, [selectedDocs]);

	const toggleDoc = (docId: TDocId) => {
		setSelectedDocs((prev) =>
			prev.includes(docId)
				? prev.filter((d) => d !== docId)
				: [...prev, docId]
		);
	};

	const toggleId = (id: THighlightId) => {
		setActiveIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	// 2. CSS Generation
	const dynamicStyles = useMemo(() => {
		return activeIds
			.map((id) => {
				const color = ID_COLORS[id] || "#ddd";
				return `
          .hl-${id} {
            background-color: ${color};
            border-bottom: 2px solid ${color.replace("0", "8")};
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .hl-${id}:hover {
             filter: brightness(0.95);
          }
        `;
			})
			.join("\n");
	}, [activeIds]);

	// 3. Render Button Helper
	const renderButton = (id: THighlightId, labelPrefix: string) => {
		const isActive = activeIds.includes(id);
		const color = ID_COLORS[id] || "#ccc";

		return (
			<button
				key={id}
				onClick={() => toggleId(id)}
				style={{
					...ButtonStyle,
					backgroundColor: isActive ? color : "#fff",
					border: isActive
						? "1px solid transparent"
						: "1px solid #d1d5db",
					borderLeft: isActive
						? "1px solid transparent"
						: `4px solid ${color}`,
					fontWeight: isActive ? "bold" : "normal",
				}}
			>
				{labelPrefix} {id.toUpperCase()}
			</button>
		);
	};

	// 4. Memoized Document Renderers
	const renderDoc = (docId: TDocId) => {
		const content = DOCUMENTS[docId];
		const segments = flattenRanges(docId, NEW_MOCK_JSON_DATA);

		return (
			<ReactMarkdown
				key={docId}
				remarkPlugins={[[remarkHighlightPlugin, { segments }]]}
				components={
					{
						highlight: ({ node, ...props }: any) => (
							<span {...props} />
						),
					} as Components
				}
			>
				{content}
			</ReactMarkdown>
		);
	};

	return (
		<div style={MainContainerStyle}>
			<style>{dynamicStyles}</style>

			{/* Top Bar with Dropdown */}
			<div style={TopControlBarStyle}>
				<label style={{ fontWeight: "bold", fontSize: "14px" }}>
					Select Documents:
				</label>

				<div
					style={DropdownWrapperStyle}
					ref={dropdownRef}
				>
					<button
						style={DropdownButtonStyle}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<span>
							{selectedDocs.length === 0
								? "Select..."
								: `${selectedDocs.length} Selected`}
						</span>
						<span style={{ fontSize: "10px" }}>▼</span>
					</button>

					{isDropdownOpen && (
						<div style={DropdownMenuStyle}>
							{Object.keys(DOCUMENTS).map((docId) => {
								const isSelected = selectedDocs.includes(docId);
								return (
									<div
										key={docId}
										style={{
											...DropdownItemStyle,
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
					onClick={() => setActiveIds([])}
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

			<div style={ContentAreaStyle}>
				{/* Sidebar with Categories */}
				<div style={SidebarStyle}>
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

					{/* Unique Sections */}
					{selectedDocs.map((docId) => {
						const ids = uniqueMap[docId] || [];
						const themeColor = DOC_THEME_COLORS[docId] || "#ccc";
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
										...SectionHeaderStyle,
										borderBottom: `2px solid ${themeColor}`,
										paddingBottom: "4px",
									}}
								>
									Unique to {docId.replace("doc_", "")}
								</div>
								{ids.length > 0 ? (
									ids.map((id) => renderButton(id, "Unique"))
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

					{/* Shared Section */}
					{selectedDocs.length > 0 && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "8px",
								marginTop: "20px",
							}}
						>
							<div
								style={{
									...SectionHeaderStyle,
									borderBottom: `2px solid #2563eb`,
									paddingBottom: "4px",
								}}
							>
								Shared Data
							</div>
							{sharedList.length > 0 ? (
								sharedList.map((id) =>
									renderButton(id, "Shared")
								)
							) : (
								<div
									style={{
										fontSize: "12px",
										color: "#ccc",
									}}
								>
									None visible
								</div>
							)}
						</div>
					)}
				</div>

				{/* Document Columns */}
				<div style={DocViewerContainerStyle}>
					{selectedDocs.length === 0 && (
						<div style={{ margin: "auto", color: "#ccc" }}>
							Please select a document.
						</div>
					)}
					{selectedDocs.map((docId) => (
						<div
							style={DocColumnStyle}
							key={docId}
						>
							<div
								style={{
									...DocHeaderStyle,
									borderTop: `4px solid ${
										DOC_THEME_COLORS[docId] || "#ccc"
									}`,
								}}
							>
								{docId.replace("doc_", "Document ")}
							</div>
							<div style={DocTextScrollStyle}>
								{renderDoc(docId)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export { DocumentAnalysisViewer };
