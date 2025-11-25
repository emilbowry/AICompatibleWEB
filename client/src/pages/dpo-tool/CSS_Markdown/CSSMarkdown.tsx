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
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";

// Data Imports
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
	IRawDocLibrary,
	IRawAnalysisData,
	IDocMeta,
	IHighlightNode,
	IFlatSegment,
	IAnalysisUIState,
	ITextNode,
	ICategoryButtonProps,
} from "./CSSMarkdown.types";

const RAW_DOCS = local_policy_data as unknown as IRawDocLibrary;
const RAW_ANALYSIS = local_question_data as unknown as IRawAnalysisData;

const DOC_LOOKUP: Record<TDocId, IDocMeta> = {};

Object.entries(RAW_DOCS).forEach(([policyName, versions]) => {
	Object.entries(versions).forEach(([hash, data]) => {
		DOC_LOOKUP[hash] = {
			content: data.policy_content,
			label: `${policyName} (${data.fetch_date})`,
		};
	});
});

const ANALYSIS_KEYS = Object.keys(RAW_ANALYSIS);
const GRADIENT_COLORS = generateGradient(ANALYSIS_KEYS.length);

const ID_COLORS: Record<string, string> = {};
ANALYSIS_KEYS.forEach((key, index) => {
	ID_COLORS[key] = GRADIENT_COLORS[index];
});

const DOC_HASHES = Object.keys(DOC_LOOKUP);
const DOC_COLORS_LIST = generateGradient(
	DOC_HASHES.length,
	"#16a34a", // Green
	"#ea580c" // Orange
);

const DOC_THEME_COLORS: Record<string, string> = {};
DOC_HASHES.forEach((hash, index) => {
	DOC_THEME_COLORS[hash] = DOC_COLORS_LIST[index];
});

const flattenRanges = (
	docId: TDocId,
	data: IRawAnalysisData
): IFlatSegment[] => {
	const points = new Set<number>();

	// [ { id: "Question A", start: 10, end: 20 }, ... ]
	const rangeMap: { id: THighlightId; start: number; end: number }[] = [];

	Object.entries(data).forEach(([questionId, docMap]) => {
		const occurrences = docMap[docId];

		if (occurrences) {
			occurrences.forEach((instance) => {
				const [start, end] = instance.substring_indices;
				points.add(start);
				points.add(end);
				rangeMap.push({ id: questionId, start, end });
			});
		}
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

					// Safe CSS Class Generation
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

const AnalysisCTX = createContext<IAnalysisUIState>(undefined as any);

const useAnalysisState = (): IAnalysisUIState => {
	const [activeIds, setActiveIds] = useState<THighlightId[]>([]);
	const [selectedDocs, setSelectedDocs] = useState<TDocId[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

	return useMemo(() => styleObjectToString(highlightRules), [highlightRules]);
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

		Object.entries(RAW_ANALYSIS).forEach(([questionId, docMap]) => {
			const uniqueDocsForQuestion = new Set(Object.keys(docMap)); // Keys are hashes
			if (uniqueDocsForQuestion.size > 1) {
				qTypes[questionId] = "shared";
			} else {
				qTypes[questionId] = "unique";
			}
		});

		const visibleUniqueMap: Record<TDocId, THighlightId[]> = {};
		const visibleSharedList: THighlightId[] = [];

		selectedDocs.forEach((docId) => (visibleUniqueMap[docId] = []));

		Object.entries(RAW_ANALYSIS).forEach(([questionId, docMap]) => {
			const type = qTypes[questionId];

			const docKeys = Object.keys(docMap);
			const isRelevant = docKeys.some((docHash) =>
				selectedDocs.includes(docHash)
			);

			if (!isRelevant) return;

			if (type === "shared") {
				if (!visibleSharedList.includes(questionId)) {
					visibleSharedList.push(questionId);
				}
			} else {
				// It's unique to one doc
				const docId = docKeys[0];
				if (visibleUniqueMap[docId]) {
					visibleUniqueMap[docId].push(questionId);
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

// --- Components ---

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
	const formattedLabel = `Unique to ${DOC_LOOKUP[docId].label}`;

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
			{Object.keys(DOC_LOOKUP).map((docId) => {
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
						{DOC_LOOKUP[docId].label}
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
const MemoizedMarkdownViewer = React.memo(
	({ content, segments }: { content: string; segments: IFlatSegment[] }) => {
		return (
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
		);
	}
);
const DocumentColumn: React.FC<{ docId: TDocId }> = ({ docId }) => {
	// USE LOOKUP for Content
	const content = DOC_LOOKUP[docId].content;

	const segments = useMemo(() => flattenRanges(docId, RAW_ANALYSIS), [docId]);
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";

	const scrollRef = useRef<HTMLDivElement>(null);
	useAutoScroll(scrollRef as any);

	return (
		<div style={DocColumnWrapperStyle}>
			<div style={getDocHeaderStyle(themeColor)}>
				{DOC_LOOKUP[docId].label}
			</div>
			<div
				style={DocScrollStyle}
				ref={scrollRef}
			>
				<MemoizedMarkdownViewer
					content={content}
					segments={segments}
				/>
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
