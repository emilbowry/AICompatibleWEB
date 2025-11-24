import React, { useMemo, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

// --- Types ---

interface HighlightRange {
	docId: string;
	start: number;
	end: number;
}

interface AnalysisData {
	[id: string]: HighlightRange[];
}

interface DocumentMap {
	[docId: string]: string;
}

// Custom AST Node Type
interface HighlightNode extends Node {
	type: "highlight";
	data: {
		hName: string;
		hProperties: {
			className: string;
		};
	};
	// FIX: Explicitly allow TextNode here
	children: (HighlightNode | TextNode)[];
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

const NEW_MOCK_JSON_DATA: AnalysisData = {
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

// --- Logic: Range Flattening ---

// We flatten overlapping ranges into disjoint segments
// e.g. Range A [0-10], Range B [5-15]
// Becomes: [0-5] (A), [5-10] (A, B), [10-15] (B)
interface FlatSegment {
	start: number;
	end: number;
	ids: string[];
}

const flattenRanges = (docId: string, data: AnalysisData): FlatSegment[] => {
	// 1. Collect all boundary points
	const points = new Set<number>();
	const rangeMap: { id: string; start: number; end: number }[] = [];

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
	const segments: FlatSegment[] = [];

	// 2. Iterate intervals
	for (let i = 0; i < sortedPoints.length - 1; i++) {
		const start = sortedPoints[i];
		const end = sortedPoints[i + 1];
		const mid = start + (end - start) / 2; // sample point

		// Find which original ranges cover this interval
		const activeIds = rangeMap
			.filter((r) => r.start <= mid && r.end >= mid)
			.map((r) => r.id);

		if (activeIds.length > 0) {
			segments.push({ start, end, ids: activeIds });
		}
	}

	return segments;
};
// Add this interface
interface TextNode extends Node {
	type: "text";
	value: string;
}
// --- Logic: Remark Plugin ---

const remarkHighlightPlugin = (options: { segments: FlatSegment[] }) => {
	return (tree: any) => {
		const { segments } = options;
		if (!segments.length) return;

		// We cast 'node' to any in the signature to avoid generic headaches,
		// then cast to TextNode inside.
		visit(tree, "text", (node: any, index, parent) => {
			if (!parent || index === undefined) return;
			if (!node.position) return;

			const textNode = node as TextNode; // Safe cast
			const nodeStart = node.position.start.offset;
			const nodeEnd = node.position.end.offset;

			const relevantSegments = segments.filter(
				(s) => s.start < nodeEnd && s.end > nodeStart
			);

			if (relevantSegments.length === 0) return;

			// UPDATE HERE: Allow TextNode and HighlightNode in this array
			const newChildren: (TextNode | HighlightNode)[] = [];

			let cursor = nodeStart;

			relevantSegments.sort((a, b) => a.start - b.start);

			for (const seg of relevantSegments) {
				// 1. Text before
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

				// 2. Highlight
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

			// 3. Remaining text
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
// --- Components ---

// Define colors for specific IDs
const ID_COLORS: Record<string, string> = {
	a: "#bbf7d0", // Green
	b: "#fed7aa", // Orange
	c: "#bfdbfe", // Blue
};

const DocumentAnalysisViewer: React.FC = () => {
	const [activeIds, setActiveIds] = useState<string[]>([]);

	// 1. Toggle Logic
	const toggleId = (id: string) => {
		setActiveIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	// 2. Generate CSS dynamically based on Active IDs
	// This is the core of the "CSS-Driven State"
	const dynamicStyles = useMemo(() => {
		return activeIds
			.map((id) => {
				const color = ID_COLORS[id] || "#ddd";
				return `
          .hl-${id} {
            background-color: ${color};
   
          }
          .hl-${id}:hover {
             filter: brightness(0.95);
          }
        `;
			})
			.join("\n");
	}, [activeIds]);

	const renderDoc = (docId: string) => {
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
		<div
			style={styles.mainContainer}
			className="no-aos"
		>
			<style>{dynamicStyles}</style>

			<div style={styles.topControlBar}>
				<h3>Analysis Viewer</h3>
				<span style={{ fontSize: "12px", color: "#666" }}>
					CSS-Driven State Demo
				</span>
			</div>

			{/* BODY */}
			<div style={styles.contentArea}>
				<div style={styles.sidebar}>
					<div style={styles.sectionHeader}>Categories</div>
					{Object.keys(NEW_MOCK_JSON_DATA).map((id) => (
						<button
							key={id}
							onClick={() => toggleId(id)}
							style={{
								...styles.button,
								backgroundColor: activeIds.includes(id)
									? ID_COLORS[id]
									: "#f3f4f6",
								fontWeight: activeIds.includes(id)
									? "bold"
									: "normal",
								borderLeft: `4px solid ${ID_COLORS[id]}`,
							}}
						>
							Pattern {id.toUpperCase()}
						</button>
					))}
				</div>

				{/* Documents Area */}
				<div style={styles.docViewerContainer}>
					{Object.keys(DOCUMENTS).map((docId) => (
						<div
							key={docId}
							style={styles.docColumn}
						>
							<div style={styles.docHeader}>
								{docId.replace("_", " ")}
							</div>
							<div style={styles.docTextScroll}>
								{renderDoc(docId)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

// --- Styles (Copied & Adapted from dual.tsx) ---

const styles: Record<string, React.CSSProperties> = {
	mainContainer: {
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
	},
	topControlBar: {
		padding: "15px",
		backgroundColor: "#f8fafc",
		borderBottom: "1px solid #e5e7eb",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	contentArea: {
		display: "flex",
		flex: 1,
		overflow: "hidden",
	},
	sidebar: {
		width: "250px",
		minWidth: "250px",
		backgroundColor: "#fff",
		borderRight: "1px solid #eee",
		padding: "20px",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	},
	sectionHeader: {
		fontSize: "11px",
		textTransform: "uppercase",
		color: "#6b7280",
		fontWeight: "800",
		marginBottom: "10px",
		letterSpacing: "0.05em",
	},
	button: {
		padding: "10px 12px",
		border: "1px solid #e5e7eb",
		borderRadius: "6px",
		cursor: "pointer",
		textAlign: "left",
		fontSize: "13px",
		transition: "all 0.1s",
	},
	docViewerContainer: {
		flex: 1,
		display: "flex",
		flexDirection: "row",
		backgroundColor: "#fafafa",
		overflow: "hidden",
	},
	docColumn: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		borderLeft: "1px solid #eee",
		overflow: "hidden",
		maxWidth: "50%",
	},
	docHeader: {
		padding: "12px",
		borderBottom: "1px solid #eee",
		backgroundColor: "#fff",
		fontWeight: "bold",
		textAlign: "center",
		textTransform: "uppercase",
		fontSize: "12px",
		letterSpacing: "1px",
		color: "#444",
	},
	docTextScroll: {
		flex: 1,
		padding: "30px",
		overflowY: "auto",
		// Important: Make sure spans don't break block layout
		whiteSpace: "pre-wrap",
		lineHeight: "1.6",
		fontSize: "14px",
		fontFamily: "Georgia, serif", // nicer for reading
	},
};

export { DocumentAnalysisViewer };

/* 
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
	}
const TopControlBarStyle: React.CSSProperties = {
		padding: "15px",
		backgroundColor: "#f8fafc",
		borderBottom: "1px solid #e5e7eb",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	}
const ContentAreaStyle: React.CSSProperties = {
		display: "flex",
		flex: 1,
		overflow: "hidden",
	}

const SideBarStyle:React.CSSProperties = {
		width: "250px",
		minWidth: "250px",
		backgroundColor: "#fff",
		borderRight: "1px solid #eee",
		padding: "20px",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	}
 */
