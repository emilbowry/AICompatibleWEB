// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.tsx

import React, { useEffect, useMemo, useRef } from "react";

// --- Types ---
import { toCssClass } from "./mardown-viewer/MarkDownViewer";

import {
	DocScrollStyle,
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
import { styleObjectToString } from "../../../styles";

import {
	TDocId,
	THighlightId,
	ICategoryButtonProps,
} from "./CSSMarkdown.types";
import {
	useAnalysisContext,
	ID_COLORS,
	DOC_THEME_COLORS,
	useDataCategorization,
	flattenRanges,
	RAW_ANALYSIS,
	AnalysisCTX,
	useAnalysisState,
	DOC_LOOKUP,
} from "./mardown-viewer/DataUtils";
import { MarkdownViewer } from "./mardown-viewer/MarkDownViewer";

// --- Logic Update: Remark Plugin (Unchanged Logic, just types) ---

// --- Context & Hooks ---

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

// --- Sub-Components ---

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
	// USE LOOKUP for Label
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
	// Iterate LOOKUP keys for flat list
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
						{/* USE LOOKUP for Label */}
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

const DocumentColumn: React.FC<{ docId: TDocId }> = ({ docId }) => {
	// USE LOOKUP for Content
	const content = DOC_LOOKUP[docId].content;

	const segments = useMemo(() => flattenRanges(docId, RAW_ANALYSIS), [docId]);
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";

	const scrollRef = useRef<HTMLDivElement>(null);
	// This hook triggers re-renders when context changes
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
				{/* 2. Use the memoized component here */}
				<MarkdownViewer
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
