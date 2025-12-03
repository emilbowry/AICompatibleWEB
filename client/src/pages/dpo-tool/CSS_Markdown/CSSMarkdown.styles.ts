import { THighlightId, THighlightRules } from "./CSSMarkdown.types";
import { toCssClass } from "./mardown-viewer/MarkDownViewer";
import { bgwhite } from "../../../utils/defaultColours";
const DropDownIconStyle = {};
const DropDownInputStyle = {};
const ButtonStyle: React.CSSProperties = {
	// padding: "8px 12px",
	border: "1px solid transparent",
	borderRadius: "6px",
	cursor: "pointer",
	// textAlign: "left",
	background: "red",
	// transition: "all 0.2s",
	// width: "100%",
	// marginBottom: "5px",
};

const DropdownWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
	width: "100%",
};

const DropdownMenuStyle: React.CSSProperties = {
	position: "absolute",
	left: 0,
	top: "100%",

	marginTop: "4px",
	backgroundColor: "#fff",
	border: "1px solid #ccc",
	borderRadius: "4px",
	boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
	width: "max-content",
	zIndex: 100,
	padding: "5px 0",
};

const DropdownItemBaseStyle: React.CSSProperties = {
	userSelect: "none",
	gap: "8px",
	padding: "8px 12px",
	display: "flex",
	alignItems: "center",
};

const dropdownItemStyle = (isSelected: boolean): React.CSSProperties => ({
	...DropdownItemBaseStyle,
	backgroundColor: isSelected ? "#f3f4f6" : "#fff",
});
const SelectorButtonStyle: React.CSSProperties = {
	padding: "8px 16px",
	backgroundColor: "#fff",
	border: "1px solid #ccc",
	borderRadius: "4px",
	fontSize: "14px",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	minWidth: "220px",
};
const ClearButtonWrapperStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	width: "100%",

	alignItems: "center",
};
const ClearButtonStyle: React.CSSProperties = {
	marginLeft: "-40px",
	width: "fit-content",

	border: "1px solid #ccc",

	background: "#fff",
	zIndex: 100,
};

const EmptyStateStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#ccc",
	// marginBottom: "10px",
	// margin: "auto",
};

const SharedItemsWrapperStyle: React.CSSProperties = {};

const SharedCategoryButtonStyle: React.CSSProperties = {};

const GridMessageStyle: React.CSSProperties = {
	margin: "auto",
	color: "#ccc",
};

const categoryButtonStyle = (
	isActive: boolean,
	color: string,
	StyleOverrides: React.CSSProperties = {}
): React.CSSProperties => {
	return {
		...ButtonStyle,
		backgroundColor: isActive ? color : "#fff",
		border: isActive ? "1px solid transparent" : "1px solid #d1d5db",
		borderLeft: isActive ? "1px solid transparent" : `4px solid ${color}`,
		fontWeight: isActive ? "bold" : "normal",
		// margin: "auto",
		width: "30vh",
		height: "10vh",
		justifySelf: "start",
		...StyleOverrides,
	};
};

const dynamicHighlightStyles = (
	activeIds: THighlightId[],
	colorMap: Record<string, string>
): THighlightRules => {
	const rules: THighlightRules = {};

	activeIds.forEach((id) => {
		const color = colorMap[id] || "#ddd";
		const borderColor = color.replace("0", "8");

		const safeClassName = `.${toCssClass(id)}`;

		(rules as any)[safeClassName] = {
			backgroundColor: color,
			borderBottom: `2px solid ${borderColor}`,
			"&:hover": {
				filter: "brightness(0.95)",
			},
		};
	});

	return rules;
};
const MainContainerStyle = (height_available: string): React.CSSProperties => ({
	height: height_available,
	background: bgwhite,
	fontSize: "12px",
});
const TopControlBarStyle: React.CSSProperties = {
	display: "flex",
	backgroundColor: "#fff",
	borderBottom: "1px solid #ccc",
	gap: "15px",

	margin: "auto",

	alignItems: "center",
	height: "10%",
};
const SelectLabelStyle: React.CSSProperties = {
	width: "fit-content",
	textWrap: "nowrap",
};
const CONTENT_GRID_STYLE: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "20% 80%",
};

const ContentHeaderStyle = {
	...CONTENT_GRID_STYLE,
	backgroundColor: "#f9fafb",
	height: "5%",
	minHeight: "5%",
};
const ContentAreaStyle: React.CSSProperties = {
	...CONTENT_GRID_STYLE,
	height: "85%",
	maxHeight: "85%",
	backgroundColor: "#f9fafb",
	border: "1px solid #ccc",
};

const SidebarStyle: React.CSSProperties = {};

const MainContentColumnStyle: React.CSSProperties = {
	overflow: "hidden",
};

const DocGridContainerStyle: React.CSSProperties = {
	overflow: "hidden",
};

const SharedFooterStyle: React.CSSProperties = {
	height: "30%",
	backgroundColor: "#fff",
	borderTop: "1px solid #eee",
	padding: "15px",
};

// const SidebarSectionStyle: React.CSSProperties = {
// 	// maxHeight: "100%",

// 	flex: 0,

// 	minHeight: 0,
// };
const documentSplitStyle = (
	mode = "SPLIT",
	columns: number
): React.CSSProperties => ({
	display: "grid",
	gridTemplateColumns: `repeat(${columns}, ${100 / columns}%)`,
	minHeight: 0,
});

//

const DocColumnWrapperStyle: React.CSSProperties = {
	height: "100%",
	minHeight: 0,
	padding: "0 2%",
	overflow: "scroll",

	//
};

const docHeaderStyle = (color: string): React.CSSProperties => ({
	width: "100%",
	borderBottom: "1px solid #eee",
	backgroundColor: "#fff",
	fontWeight: "bold",
	textAlign: "center",
	textTransform: "uppercase",
	fontSize: "12px",
	letterSpacing: "1px",
	color: "#444",
	borderTop: `4px solid ${color}`,
});

const SECTION_HEADER_HEIGHT = 10;
const SectionHeaderStyle: React.CSSProperties = {
	// height: `${SECTION_HEADER_HEIGHT}%`,
	justifyContent: "center",
	textAlign: "center",
	minHeight: 0,
};
const sectionHeaderStyle = (
	color = "#ccc",
	StyleOverrides = {},
	columns: number
): React.CSSProperties => ({
	height: `${SECTION_HEADER_HEIGHT * columns}%`,
	fontSize: "16px",
	// position: "relative",
	textDecorationLine: `underline`,
	textDecorationColor: color,
	color: "#6b7280",
	// marginBottom: "10px",
	...StyleOverrides,
});
const attrsAreaStyle = (columns: number): React.CSSProperties => ({
	height: `${100 - columns * SECTION_HEADER_HEIGHT}%`,
	overflow: "auto",
	minHeight: 0,
});
const UniqueContainerAreaStyle: React.CSSProperties = {
	// display: "grid",
	// gridTemplateRows: `repeat(${columns}, 1fr)`,
	// display: "flex",
	// flexDirection: "column",
	position: "relative",
	// flex: 0,
	height: "100%",
	minHeight: 0,
	overflowY: "scroll",
	// maxHeight: "100%",
	borderRight: "1px solid #ccc",
};

const UniqueAttrsHeadingStyle: React.CSSProperties = {
	margin: "auto",
	textAlign: "center",
	alignContent: "center",
	flex: 0,
	width: "calc(100%)",
	// boxSizing: "border-box",
	borderRight: "1px solid #ccc", // why necessary here but not containerAreaStyle
	height: "100%",
};
export {
	ButtonStyle,
	UniqueAttrsHeadingStyle,
	categoryButtonStyle,
	ClearButtonStyle,
	ContentAreaStyle,
	ContentHeaderStyle,
	DocColumnWrapperStyle,
	DocGridContainerStyle,
	docHeaderStyle,
	documentSplitStyle,
	DropDownIconStyle,
	DropDownInputStyle,
	dropdownItemStyle,
	DropdownMenuStyle,
	DropdownWrapperStyle,
	dynamicHighlightStyles,
	GridMessageStyle,
	EmptyStateStyle,
	MainContainerStyle,
	ClearButtonWrapperStyle,
	MainContentColumnStyle,
	sectionHeaderStyle,
	SectionHeaderStyle,
	SelectLabelStyle,
	SelectorButtonStyle,
	SharedCategoryButtonStyle,
	SharedFooterStyle,
	SharedItemsWrapperStyle,
	SidebarStyle,
	TopControlBarStyle,
	attrsAreaStyle,
	UniqueContainerAreaStyle,
};
