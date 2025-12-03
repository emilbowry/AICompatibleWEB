// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArcScrollWheel } from "../../demo/DemoPage";
import {
	docHeaderStyle,
	documentSplitStyle,
	DocColumnWrapperStyle,
	UniqueAttrsHeadingStyle,
	GridMessageStyle,
	ClearButtonWrapperStyle,
	EmptyStateStyle,
	categoryButtonStyle,
	SharedFooterStyle,
	ContentHeaderStyle,
	DropDownInputStyle,
	attrsAreaStyle,
	sectionHeaderStyle,
	SharedItemsWrapperStyle,
	ClearButtonStyle,
	SelectorButtonStyle,
	MainContainerStyle,
	TopControlBarStyle,
	ContentAreaStyle,
	DropdownWrapperStyle,
	DropdownMenuStyle,
	dropdownItemStyle,
	SelectLabelStyle,
	dynamicHighlightStyles,
	DropDownIconStyle,
	UniqueContainerAreaStyle,
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
import { MarkdownViewer, toCssClass } from "./mardown-viewer/MarkDownViewer";

export const useScrollFloor = () =>
	//   ref: RefObject<HTMLElement | null>,
	{};
const useAutoScroll = (containerRef: React.RefObject<HTMLDivElement>) => {
	const { scrollToId } = useAnalysisContext();

	useEffect(() => {
		if (!scrollToId || !containerRef.current) return;

		const container = containerRef.current;
		// const t=container.getElementsByClassName
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
	StyleOverrides = {},
}) => {
	const { activeIds, toggleId } = useAnalysisContext();
	const isActive = activeIds.includes(id);
	const color = ID_COLORS[id] || "#ccc";
	return (
		<button
			onClick={() => toggleId(id)}
			className={WATCHED_CLASS}
			style={categoryButtonStyle(isActive, color, StyleOverrides)}
		>
			{id}
		</button>
		// <p>Test El</p>
	);
};
const EmptyState: React.FC<{ message?: string }> = ({ message = "None" }) => (
	<div style={EmptyStateStyle}>{message}</div>
);

const WATCHED_CLASS: string = "unique-section-header";

const useClicker = () => {
	const { toggleActiveDoc } = useAnalysisContext();
	useEffect(() => {
		const handleGlobalClick = (event: MouseEvent): void => {
			const clickedElement = event.target as HTMLElement;
			const clickedWatchedDiv: boolean =
				clickedElement?.classList?.contains(WATCHED_CLASS) ?? false;
			if (!clickedWatchedDiv) {
				toggleActiveDoc(null)();
			} else {
			}
		};
		document.addEventListener("click", handleGlobalClick);
		return (): void => {
			document.removeEventListener("click", handleGlobalClick);
		};
	}, []);
};
const SectionHeaderAlt: React.FC<{
	label: string;
	color?: string;
	StyleOverrides?: React.CSSProperties;
	columns: number;
}> = ({ label, color = "#ccc", StyleOverrides = {}, columns }) => {
	return (
		<div style={sectionHeaderStyle(color, StyleOverrides, columns)}>
			{label}
		</div>
	);
};
const AttributeList: React.FC<{
	ids: THighlightId[];
	columns: number;
}> = ({ ids, columns }) => {
	return (
		<div style={attrsAreaStyle(columns)}>
			{ids.length === 0 ? (
				<EmptyState />
			) : (
				ids.map((id) => (
					<CategoryButton
						key={id}
						id={id}
					/>
				))
			)}
		</div>
	);
};

const SidebarUniqueSection: React.FC<{
	docId: TDocId;
}> = ({ docId }) => {
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";
	const { selectedDocs } = useAnalysisContext();
	const columns = selectedDocs.length;

	return (
		<SectionHeader
			docId={docId}
			color={themeColor}
			columns={columns}
		/>
	);
};
const UniqueAttrsHeading: React.FC = () => (
	<div style={UniqueAttrsHeadingStyle}>Unique Attributes</div>
);
// type T=Parameters<Element["scrollTo"]>
const useScrollCenter = (containerRef: React.RefObject<HTMLDivElement>) => {
	const { activeDoc, selectedDocs } = useAnalysisContext();
	const [_selectedDocs, _setSelectedDocs] = useState(
		() => !(selectedDocs === undefined || selectedDocs.length === 0)
	);

	useEffect(() => {
		if (!activeDoc || !containerRef.current) return;

		const container = containerRef.current;
		const target = document.getElementById(
			`#${activeDoc}_scroll`
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
	}, [activeDoc, containerRef]);
	useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		const containerRect = container.getBoundingClientRect();
		const centerOffset = containerRect.height;
		_setSelectedDocs((prev) => {
			if (prev === false) {
				if (selectedDocs && selectedDocs?.length !== 0) {
					container.scrollTo({
						top: centerOffset,
						behavior: "instant",
					});
					return true;
				}
			} else {
				if (selectedDocs === undefined || selectedDocs?.length === 0) {
					container.scrollTo({
						top: 0,
						behavior: "instant",
					});
					return true;
				}
			}
			return prev;
		});
	}, [selectedDocs, containerRef]);

	const hasExceededRef = useRef(false);

	useEffect(() => {
		const container = containerRef.current;
		const containerRect = container.getBoundingClientRect();
		const limit = containerRect.height;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			if (!hasExceededRef.current) {
				if (container.scrollTop > limit * 0.9) {
					hasExceededRef.current = true;
				}
				return;
			}

			if (container.scrollTop <= limit && e.deltaY < 0) {
				e.preventDefault();
				container.scrollTo({
					top: limit,
					behavior: "instant",
				});
			}
		};

		container.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			container.removeEventListener("wheel", handleWheel);
		};
	});
};
const SectionHeader: React.FC<{
	docId: string;
	color?: string;
	StyleOverrides?: React.CSSProperties;
	columns: number;
	label?: string; // Add this optional prop
}> = ({ docId, color = "#ccc", StyleOverrides = {}, columns, label }) => {
	const { toggleActiveDoc } = useAnalysisContext();
	// const formattedLabel = `Unique to ${DOC_LOOKUP[docId].label}`;
	const displayLabel =
		label ||
		(DOC_LOOKUP[docId] ? `Unique to ${DOC_LOOKUP[docId].label}` : docId);
	return (
		<div
			style={sectionHeaderStyle(color, StyleOverrides, columns)}
			className={`${WATCHED_CLASS}`}
			id={`#${docId}_scroll`}
			onClick={() => {
				toggleActiveDoc(docId)();
			}}
		>
			{displayLabel}
		</div>
	);
};
// const UniqueAttrsSidebar: React.FC = () => {
// 	const { uniqueMap, sharedMap, sharedList } = useDataCategorization();
// 	const { selectedDocs, setSyntheticDocs } = useAnalysisContext();

// 	const scrollRef = useRef<HTMLDivElement>(null);
// 	useEffect(() => {
// 		setSyntheticDocs(syntheticDocs);
// 	}, [syntheticDocs, setSyntheticDocs]);
// 	/**
// 		## Shared with Policy A,B,C  // Local Shared
// 			...
// 		## Shared with Policy A,B
// 			... {Not in A,B,C}
// 		## Shared with Policy A,C
// 			... {Not in A,B,C}
// 		## Shared with Policy B,C
// 			... {Not in A,B,C}
// 		// if popped from sharedMap, remaining are  ` Global Shared`
// 		## Other Shared Factors  // Global Shared
// 			... Display remaining shared, Shared between TDocId[]

// 	 */

// 	// Object.entries(sharedMap).forEach(([questionId, docList]) => {

// 	// 	});

// 	useScrollCenter(scrollRef as any);
// 	return (
// 		<div
// 			style={UniqueContainerAreaStyle}
// 			ref={scrollRef}
// 		>
// 			<div
// 				style={{
// 					height: "100%",
// 				}}
// 			>
// 				<EmptyState message="No documents selected" />
// 			</div>

// 			{selectedDocs.length > 0 && (
// 				<>
// 					<EmptyState message="Unique Attributes" />
// 					{Object.entries(uniqueMap).map(([docId]) => (
// 						<SidebarUniqueSection
// 							key={docId}
// 							docId={docId}
// 						/>
// 					))}
// 				</>
// 			)}
// 			{sharedList.length > 0 && (
// 				<>
// 					<EmptyState message="Shared Attributes" />
// 					{/*
// 						SImilar to SidebarUniqueSection above, However we will need a new onclick handler, a generated title from the combination,
// 						Then a similar scroll to center onclick mechanic, AttributeList for the corresponding list wrapped in ArcScrollWheel

// 						If global shared then (not in selectedDocs) add <EmptyState message="Shared Attributes" /> and similarly iterate with new buttons

// 				 */}
// 				</>
// 			)}
// 			<div style={{ height: "100%" }} />
// 		</div>
// 	);
// };
// CSSMarkdown.tsx

const SidebarSharedSection: React.FC<{
	groupKey: string;
	label: string;
	color: string;
}> = ({ groupKey, label }) => {
	const { selectedDocs } = useAnalysisContext();
	// For Global shared, we might want columns=1, but for Local, match selectedDocs
	const columns = selectedDocs.length;

	return (
		<SectionHeader
			docId={groupKey}
			label={label} // <--- Passing the nice label here
			// color={color}
			columns={columns}
		/>
	);
};

const UniqueAttrsSidebar: React.FC = () => {
	const {
		uniqueMap,
		localSharedGroups,
		globalSharedGroups,
		syntheticDocs,
		groupLabels,
	} = useDataCategorization();

	const { selectedDocs, setSyntheticDocs } = useAnalysisContext();
	const scrollRef = useRef<HTMLDivElement>(null);

	// Sync valid click targets to Context
	useEffect(() => {
		setSyntheticDocs(syntheticDocs);
	}, [syntheticDocs, setSyntheticDocs]);

	useScrollCenter(scrollRef as any);

	const hasSelection = selectedDocs.length > 0;
	const hasLocal = Object.keys(localSharedGroups).length > 0;
	const hasGlobal = Object.keys(globalSharedGroups).length > 0;

	return (
		<div
			style={UniqueContainerAreaStyle}
			ref={scrollRef}
		>
			<div style={{ height: "100%" }}>
				<EmptyState
					message={!hasSelection ? "No documents selected" : ""}
				/>
			</div>

			{hasSelection && (
				<>
					{/* 1. UNIQUE ATTRIBUTES */}
					<EmptyState message="Unique Attributes" />
					{Object.entries(uniqueMap).map(([docId]) => (
						<SidebarUniqueSection
							key={docId}
							docId={docId}
						/>
					))}

					{/* 2. LOCAL SHARED (Shared between A & B) */}
					{hasLocal && (
						<>
							<EmptyState message="Shared Attributes" />
							{Object.keys(localSharedGroups).map((key) => (
								<SidebarSharedSection
									key={key}
									groupKey={key}
									label={groupLabels[key]}
									color="#2563eb" // Blue
								/>
							))}
						</>
					)}

					{/* 3. GLOBAL SHARED (Shared with C, D...) */}
					{hasGlobal && (
						<>
							<EmptyState message="Other Shared Factors" />
							{Object.keys(globalSharedGroups).map((key) => (
								<SidebarSharedSection
									key={key}
									groupKey={key}
									label={groupLabels[key]}
									color="#9333ea" // Purple (to differentiate)
								/>
							))}
						</>
					)}
				</>
			)}

			<div style={{ height: "100%" }} />
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
							style={DropDownInputStyle}
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
				<span style={DropDownIconStyle}>▼</span>
			</button>

			{isDropdownOpen && <DropdownItemList />}
		</div>
	);
};

const AnalysisTopBar: React.FC = () => {
	const { setActiveIds } = useAnalysisContext();
	return (
		<div style={TopControlBarStyle}>
			<label style={SelectLabelStyle}>Select Documents:</label>
			<DocumentSelectorDropdown />
			<div style={ClearButtonWrapperStyle}>
				<button
					onClick={() => setActiveIds([])}
					style={ClearButtonStyle}
				>
					Clear Highlights
				</button>
			</div>
		</div>
	);
};

//  <div style={documentSplitStyle(columns)}></div>
const DocumentHeader: React.FC<{ docId: TDocId }> = ({ docId }) => {
	const themeColor = DOC_THEME_COLORS[docId] || "#ccc";

	return (
		<div style={docHeaderStyle(themeColor)}>{DOC_LOOKUP[docId].label}</div>
	);
};
const DocumentGridHeading: React.FC = () => {
	const { selectedDocs } = useAnalysisContext();

	const columns = selectedDocs.length;
	return (
		<div style={documentSplitStyle("SPLIT", columns)}>
			{selectedDocs.length === 0 ? (
				<div style={GridMessageStyle}>None</div>
			) : (
				selectedDocs.map((docId) => <DocumentHeader docId={docId} />)
			)}
		</div>
	);
};

const DocumentColumn: React.FC<{ docId: TDocId }> = ({ docId }) => {
	const content = DOC_LOOKUP[docId].content;

	const segments = useMemo(() => flattenRanges(docId, RAW_ANALYSIS), [docId]);

	const scrollRef = useRef<HTMLDivElement>(null);
	useAutoScroll(scrollRef as any);

	return (
		<div
			style={DocColumnWrapperStyle}
			ref={scrollRef}
		>
			{/* 2. Use the memoized component here */}
			{/* <p>Test Doc</p> */}
			<MarkdownViewer
				content={content}
				segments={segments}
			/>
		</div>
	);
};

const DocumentGrid: React.FC = () => {
	const { selectedDocs } = useAnalysisContext();

	const columns = selectedDocs.length;
	return (
		<div style={documentSplitStyle("SPLIT", columns)}>
			{selectedDocs.length === 0 ? (
				<div style={GridMessageStyle}>Please select a document.</div>
			) : (
				selectedDocs.map((docId) => (
					<DocumentColumn
						key={docId}
						docId={docId}
					/>
				))
			)}
		</div>
	);
};

const AnalysisStyler: React.FC = () => <style>{useDynamicStyles()}</style>;
const useFixedRemainingHeight = () => {
	const element_ref = useRef<HTMLDivElement>(null);

	const [height_available, setHeightAvailable] = useState<string>("");

	// Ref to store the initial top position, which will be constant for the calculation
	const initial_top_ref = useRef<number | null>(null);

	const calculateHeight = () => {
		if (element_ref.current) {
			const rect = element_ref.current.getBoundingClientRect();

			if (initial_top_ref.current === null) {
				initial_top_ref.current = rect.top;
			}

			const fixed_element_top = initial_top_ref.current;

			const viewport_height = window.innerHeight;

			const remaining_height = viewport_height - fixed_element_top;

			setHeightAvailable(`${remaining_height}px`);
		}
	};

	useEffect(() => {
		calculateHeight();

		window.addEventListener("resize", calculateHeight);

		return () => {
			window.removeEventListener("resize", calculateHeight);
		};
	}, []);

	return { element_ref, height_available };
};

const AnalysisSpinner: React.FC = () => {
	// const { uniqueMap } = useDataCategorization();
	// const { activeDoc } = useAnalysisContext();
	// if (activeDoc === null) return null;
	// const ids = uniqueMap[activeDoc];
	// const buttons = ids.map((id) => (
	// 	<CategoryButton
	// 		key={id}
	// 		id={id}
	// 	/>
	// ));
	const { uniqueMap, localSharedGroups, globalSharedGroups } =
		useDataCategorization();
	const { activeDoc } = useAnalysisContext();

	if (activeDoc === null) return null;

	// Check all 3 maps for the ID
	const ids =
		uniqueMap[activeDoc] ||
		localSharedGroups[activeDoc] ||
		globalSharedGroups[activeDoc] ||
		[];

	if (ids.length === 0) return null;

	const buttons = ids.map((id) => (
		<CategoryButton
			key={id}
			id={id}
		/>
	));
	return (
		<div
			style={{
				position: "absolute",
				height: `calc(${CONFIG.radius + CONFIG.itemHeight}vh)`,
				width: `calc(${CONFIG.radius / 2 + CONFIG.itemWidth / 2}vh)`,
				zIndex: 300,
			}}
		>
			<ArcScrollWheel
				items={buttons}
				initial_rotation={90}
			/>
		</div>
	);
};
import { CONFIG } from "../../demo/DemoPage";
const AnalysisContainer: React.FC = () => {
	useClicker();
	return (
		<>
			<AnalysisSpinner />

			<div style={ContentHeaderStyle}>
				<UniqueAttrsHeading />
				<DocumentGridHeading />
			</div>
			<div style={ContentAreaStyle}>
				<UniqueAttrsSidebar />

				<DocumentGrid />
			</div>
		</>
	);
};
const DocumentAnalysisViewer: React.FC = () => {
	const { element_ref, height_available } = useFixedRemainingHeight();

	return (
		<AnalysisCTX value={useAnalysisState()}>
			<AnalysisStyler />

			<div
				style={MainContainerStyle(height_available)}
				className="no-aos"
				ref={element_ref}
			>
				<AnalysisTopBar />
				<AnalysisContainer />
				{/* <SharedAttrsFooter /> */}
			</div>
		</AnalysisCTX>
	);
};

export { DocumentAnalysisViewer };
