// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.tsx

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import local_question_data from "./output_q.json";
import local_policy_data from "./output_p.json";

// --- Types ---
import {
	DocScrollStyle,
	toCssClass,
	getDocHeaderStyle,
	DocColumnWrapperStyle,
	DocGridContainerStyle,
	EmptyGridMessageStyle,
	EmptyStateStyle,
	SharedCategoryButtonStyle,
	categoryButtonStyle,
	SharedFooterStyle,
	SectionHeaderStyle,
	SharedItemsWrapperStyle,
	ClearButtonStyle,
	SelectorButtonStyle,
	MainContainerStyle,
	TopControlBarStyle,
	ContentAreaStyle,
	SidebarStyle,
	MainContentColumnStyle,
	DropdownWrapperStyle,
	DropdownMenuStyle,
	SidebarSectionStyle,
	dropdownItemStyle,
	dynamicHighlightStyles,
} from "./CSSMarkdown.styles";
import { styleObjectToString, generateGradient } from "../../../styles";

import {
	TDocId,
	THighlightId,
	IAnalysisData,
	IDocumentMap,
	IHighlightNode,
	IFlatSegment,
	IAnalysisUIState,
	ITextNode,
	ICategoryButtonProps,
} from "./CSSMarkdown.types";

// --- Mock Data ---

// const DOCUMENTS: IDocumentMap = {
// 	doc_alpha: `# Project Alpha Analysis

// This document contains the preliminary results.
// We observed several key factors.

// ## Key Findings

// 1. Velocity increased by 20% in Q3.
// 2. Bug reports dropped significantly.
// 3. Customer satisfaction is high.

// ## Risks

// - Legacy systems are a bottleneck.
// - API rate limits are being hit frequently.
// `,
// 	doc_beta: `# Project Beta Review

// This is the secondary analysis for Beta.
// While promising, there are overlaps.

// ## Shared Observations

// 1. Velocity increased by 20% in Q3.
// 2. API rate limits are being hit frequently.

// ## Beta Specifics

// - The new UI framework is causing blocking.
// - Mobile adoption is up 40%.
// `,
// };

// const NEW_MOCK_JSON_DATA: IAnalysisData = {
// 	a: [
// 		{ docId: "doc_alpha", start: 128, end: 160 }, // "1. Velocity..."
// 		{ docId: "doc_alpha", start: 164, end: 198 }, // "2. Bug..."
// 		{ docId: "doc_beta", start: 129, end: 161 }, // "1. Velocity..."
// 		{ docId: "doc_beta", start: 273, end: 299 }, // "- Mobile..."
// 	],
// 	b: [
// 		{ docId: "doc_alpha", start: 246, end: 278 }, // "- Legacy..."
// 	],
// 	c: [
// 		{ docId: "doc_beta", start: 229, end: 270 }, // "- The new UI..."
// 	],
// };
const DOCUMENTS: IDocumentMap = local_policy_data;
const NEW_MOCK_JSON_DATA: IAnalysisData = local_question_data;
const ANALYSIS_KEYS = Object.keys(NEW_MOCK_JSON_DATA);
const GRADIENT_COLORS = generateGradient(ANALYSIS_KEYS.length);

const ID_COLORS: Record<string, string> = {};
ANALYSIS_KEYS.forEach((key, index) => {
	ID_COLORS[key] = GRADIENT_COLORS[index];
});

const DOC_KEYS = Object.keys(DOCUMENTS);
const DOC_COLORS_LIST = generateGradient(
	DOC_KEYS.length,
	"#16a34a", // Start (Green)
	"#ea580c" // End (Orange)
);

const DOC_THEME_COLORS: Record<string, string> = {};
DOC_KEYS.forEach((key, index) => {
	DOC_THEME_COLORS[key] = DOC_COLORS_LIST[index];
});
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
						.map((id) => toCssClass(id))
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

// --- Context & Hooks ---

const AnalysisCTX = createContext<IAnalysisUIState>(undefined as any);

// const useAnalysisState = (): IAnalysisUIState => {
// 	const [activeIds, setActiveIds] = useState<THighlightId[]>([]);
// 	const [selectedDocs, setSelectedDocs] = useState<TDocId[]>(["doc_alpha"]);
// 	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// 	const toggleDoc = (docId: TDocId) => {
// 		setSelectedDocs((prev) =>
// 			prev.includes(docId)
// 				? prev.filter((d) => d !== docId)
// 				: [...prev, docId]
// 		);
// 	};

// 	const toggleId = (id: THighlightId) => {
// 		setActiveIds((prev) =>
// 			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
// 		);
// 	};

// 	return {
// 		activeIds,
// 		setActiveIds,
// 		selectedDocs,
// 		setSelectedDocs,
// 		isDropdownOpen,
// 		setIsDropdownOpen,
// 		toggleDoc,
// 		toggleId,
// 	};
// };
const useAnalysisState = (): IAnalysisUIState => {
	const [activeIds, setActiveIds] = useState<THighlightId[]>([]);
	const [selectedDocs, setSelectedDocs] = useState<TDocId[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// NEW: State to signal a scroll event
	const [scrollToId, setScrollToId] = useState<THighlightId | null>(null);

	const toggleDoc = (docId: TDocId) => {
		setSelectedDocs((prev) =>
			prev.includes(docId)
				? prev.filter((d) => d !== docId)
				: [...prev, docId]
		);
	};

	const toggleId = (id: THighlightId) => {
		const isTurningOn = !activeIds.includes(id);

		setActiveIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);

		if (isTurningOn) {
			setScrollToId(id);

			setTimeout(() => setScrollToId(null), 100);
		}
	};

	return {
		activeIds,
		setActiveIds,
		selectedDocs,
		setSelectedDocs,
		isDropdownOpen,
		setIsDropdownOpen,
		toggleDoc,
		toggleId,
		scrollToId,
	};
};
const useAutoScroll = (containerRef: React.RefObject<HTMLDivElement>) => {
	const { scrollToId } = useAnalysisContext();

	useEffect(() => {
		if (!scrollToId || !containerRef.current) return;

		const container = containerRef.current;
		const target = container.querySelector(
			// toCssClass(scrollToId)
			`.${toCssClass(scrollToId)}`
		) as HTMLElement;

		if (target) {
			const containerRect = container.getBoundingClientRect();
			const targetRect = target.getBoundingClientRect();

			const relativeTop = targetRect.top - containerRect.top;

			const currentScroll = container.scrollTop;

			const centerOffset =
				containerRect.height / 2 - targetRect.height / 2;

			const scrollPos = currentScroll + relativeTop - centerOffset;

			container.scrollTo({
				top: scrollPos,
				behavior: "smooth",
			});
		}
	}, [scrollToId, containerRef]);
};
const useDynamicStyles = () => {
	const { activeIds } = useAnalysisContext();

	const highlightRules = useMemo(
		() => dynamicHighlightStyles(activeIds, ID_COLORS),
		[activeIds]
	);

	const cssString = useMemo(
		() => styleObjectToString(highlightRules),
		[highlightRules]
	);
	return cssString;
};
const useAnalysisContext = () => {
	const context = useContext(AnalysisCTX);
	if (!context) {
		throw new Error(
			"useAnalysisContext must be used within an AnalysisCTX Provider"
		);
	}
	return context;
};

const useDataCategorization = () => {
	const { selectedDocs } = useAnalysisContext();

	return useMemo(() => {
		const qTypes: Record<THighlightId, "unique" | "shared"> = {};

		Object.entries(NEW_MOCK_JSON_DATA).forEach(([id, ranges]) => {
			const uniqueDocsForQuestion = new Set(ranges.map((r) => r.docId));
			if (uniqueDocsForQuestion.size > 1) {
				qTypes[id] = "shared";
			} else {
				qTypes[id] = "unique";
			}
		});

		const visibleUniqueMap: Record<TDocId, THighlightId[]> = {};
		const visibleSharedList: THighlightId[] = [];

		selectedDocs.forEach((docId) => (visibleUniqueMap[docId] = []));

		Object.entries(NEW_MOCK_JSON_DATA).forEach(([id, ranges]) => {
			const type = qTypes[id];
			const isRelevant = ranges.some((r) =>
				selectedDocs.includes(r.docId)
			);
			if (!isRelevant) return;

			if (type === "shared") {
				if (!visibleSharedList.includes(id)) {
					visibleSharedList.push(id);
				}
			} else {
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
};

const useDropdownBehavior = (
	isOpen: boolean,
	setIsOpen: (v: boolean) => void
) => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				isOpen &&
				ref.current &&
				!ref.current.contains(event.target as Element)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen, setIsOpen]);

	return ref;
};

const CategoryButton: React.FC<ICategoryButtonProps> = ({
	id,
	labelPrefix,
	StyleOverrides = {},
}) => {
	const { activeIds, toggleId } = useAnalysisContext();
	const isActive = activeIds.includes(id);
	const color = ID_COLORS[id] || "#ccc";
	return (
		<button
			onClick={() => toggleId(id)}
			style={categoryButtonStyle(isActive, color, StyleOverrides)}
		>
			{id}
		</button>
	);
};

const SectionHeader: React.FC<{
	label: string;
	color?: string;
	StyleOverrides?: React.CSSProperties;
}> = ({ label, color = "#ccc", StyleOverrides = {} }) => (
	<div
		style={{
			...SectionHeaderStyle,
			borderBottom: `2px solid ${color}`,
			paddingBottom: "4px",
			...StyleOverrides,
		}}
	>
		{label}
	</div>
);

const EmptyState: React.FC<{ message?: string }> = ({ message = "None" }) => (
	<div style={EmptyStateStyle}>{message}</div>
);

// --- Sub-Components (List Renderers) ---

const AttributeList: React.FC<{
	ids: THighlightId[];
	prefix: string;
}> = ({ ids, prefix }) =>
	ids.length === 0 ? (
		<EmptyState />
	) : (
		<>
			{ids.map((id) => (
				<CategoryButton
					key={id}
					id={id}
					labelPrefix={prefix}
				/>
			))}
		</>
	);

const SidebarUniqueSection: React.FC<{
	docId: TDocId;
	ids: THighlightId[];
}> = ({ docId, ids }) => {
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";
	const formattedLabel = `Unique to ${docId}}`;

	return (
		<div style={SidebarSectionStyle}>
			<SectionHeader
				label={formattedLabel}
				color={themeColor}
			/>
			<AttributeList
				ids={ids}
				prefix="Unique"
			/>
		</div>
	);
};

// --- Container Components ---

const UniqueAttrsSidebar: React.FC = () => {
	const { uniqueMap } = useDataCategorization();
	const { selectedDocs } = useAnalysisContext();

	if (selectedDocs.length === 0) {
		return (
			<div style={SidebarStyle}>
				<EmptyState message="No documents selected" />
			</div>
		);
	}

	return (
		<div style={SidebarStyle}>
			{Object.entries(uniqueMap).map(([docId, ids]) => (
				<SidebarUniqueSection
					key={docId}
					docId={docId}
					ids={ids}
				/>
			))}
		</div>
	);
};

const SharedAttrsFooter: React.FC = () => {
	const { sharedList } = useDataCategorization();
	const { selectedDocs } = useAnalysisContext();

	if (selectedDocs.length === 0) return null;

	return (
		<div style={SharedFooterStyle}>
			<SectionHeader
				label="Shared Observations"
				color="#2563eb"
			/>
			<div style={SharedItemsWrapperStyle}>
				{sharedList.length > 0 ? (
					sharedList.map((id) => (
						<CategoryButton
							key={id}
							id={id}
							labelPrefix="Shared"
							StyleOverrides={SharedCategoryButtonStyle}
						/>
					))
				) : (
					<EmptyState message="No shared attributes found." />
				)}
			</div>
		</div>
	);
};

const DropdownItemList: React.FC = () => {
	const { selectedDocs, toggleDoc } = useAnalysisContext();
	return (
		<div style={DropdownMenuStyle}>
			{Object.keys(DOCUMENTS).map((docId) => {
				const isSelected = selectedDocs.includes(docId);
				return (
					<div
						key={docId}
						style={dropdownItemStyle(isSelected)}
						onClick={() => toggleDoc(docId)}
					>
						<input
							type="checkbox"
							checked={isSelected}
							readOnly
							style={{ pointerEvents: "none" }}
						/>
						{docId}
					</div>
				);
			})}
		</div>
	);
};

const DocumentSelectorDropdown: React.FC = () => {
	const { selectedDocs, isDropdownOpen, setIsDropdownOpen } =
		useAnalysisContext();
	const dropdownRef = useDropdownBehavior(isDropdownOpen, setIsDropdownOpen);

	return (
		<div
			style={DropdownWrapperStyle}
			ref={dropdownRef}
		>
			<button
				style={SelectorButtonStyle}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				<span>
					{selectedDocs.length === 0
						? "Select..."
						: `${selectedDocs.length} Selected`}
				</span>
				<span style={{ fontSize: "10px" }}>▼</span>
			</button>

			{isDropdownOpen && <DropdownItemList />}
		</div>
	);
};

const AnalysisTopBar: React.FC = () => {
	const { setActiveIds } = useAnalysisContext();
	return (
		<div style={TopControlBarStyle}>
			<label style={{ fontWeight: "bold", fontSize: "14px" }}>
				Select Documents:
			</label>
			<DocumentSelectorDropdown />
			<button
				onClick={() => setActiveIds([])}
				style={ClearButtonStyle}
			>
				Clear Highlights
			</button>
		</div>
	);
};

const DocumentColumn: React.FC<{ docId: TDocId }> = ({ docId }) => {
	const content = DOCUMENTS[docId];
	const segments = useMemo(
		() => flattenRanges(docId, NEW_MOCK_JSON_DATA),
		[docId]
	);
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";

	const scrollRef = useRef<HTMLDivElement>(null);

	useAutoScroll(scrollRef as any);

	return (
		<div style={DocColumnWrapperStyle}>
			<div style={getDocHeaderStyle(themeColor)}>{docId}</div>
			<div
				style={DocScrollStyle}
				ref={scrollRef}
			>
				<ReactMarkdown
					remarkPlugins={[
						[remarkHighlightPlugin, { segments }],
						remarkGfm,
					]}
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
			</div>
		</div>
	);
};
const DocumentGrid: React.FC = () => {
	const { selectedDocs } = useAnalysisContext();

	if (selectedDocs.length === 0) {
		return (
			<div style={DocGridContainerStyle}>
				<div style={EmptyGridMessageStyle}>
					Please select a document.
				</div>
			</div>
		);
	}

	return (
		<div style={DocGridContainerStyle}>
			{selectedDocs.map((docId) => (
				<DocumentColumn
					key={docId}
					docId={docId}
				/>
			))}
		</div>
	);
};

const AnalysisStyler: React.FC = () => <style>{useDynamicStyles()}</style>;

const DocumentAnalysisViewer: React.FC = () => (
	<AnalysisCTX value={useAnalysisState()}>
		<AnalysisStyler />
		<div
			style={MainContainerStyle}
			className="no-aos"
		>
			<AnalysisTopBar />

			<div style={ContentAreaStyle}>
				<UniqueAttrsSidebar />

				<div style={MainContentColumnStyle}>
					<DocumentGrid />
				</div>
			</div>
			<SharedAttrsFooter />
		</div>
	</AnalysisCTX>
);
export { DocumentAnalysisViewer };
