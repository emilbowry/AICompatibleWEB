// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.styles.ts

import { THighlightId, THighlightRules } from "./CSSMarkdown.types";

import { toCssClass } from "./mardown-viewer/MarkDownViewer";
const MainContainerStyle: React.CSSProperties = {
	display: "flex",
	paddingTop: "5vh",
	flexDirection: "column",
	fontFamily: "sans-serif",
	width: "100%",
	maxWidth: "1200px",
	margin: "20px auto",
	height: "100%",
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

const ContentAreaStyle: React.CSSProperties = {
	display: "flex",
	// flexDirection: "row",
	// flex: 1,
	overflow: "hidden",
	height: "70vh",
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

const MainContentColumnStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	overflow: "hidden",
};

const DocGridContainerStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "row",
	backgroundColor: "#fff",
	overflow: "hidden",
};

const SharedFooterStyle: React.CSSProperties = {
	padding: "15px",
	backgroundColor: "#fff",
	borderTop: "1px solid #eee",
	// display: "flex",
	// flexDirection: "column",
	overflow: "hidden",

	height: "20vh",
	width: "100%",
	gap: "8px",
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
	marginBottom: "5px",
};

const DropdownWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
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

const DropdownItemBaseStyle: React.CSSProperties = {
	padding: "8px 12px",
	display: "flex",
	alignItems: "center",
	gap: "8px",
	cursor: "pointer",
	fontSize: "14px",
	userSelect: "none",
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
	cursor: "pointer",
	fontSize: "14px",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	minWidth: "220px",
};

const ClearButtonStyle: React.CSSProperties = {
	marginLeft: "auto",
	padding: "5px 12px",
	cursor: "pointer",
	border: "1px solid #ccc",
	borderRadius: "4px",
	background: "#fff",
};

const EmptyStateStyle: React.CSSProperties = {
	fontSize: "12px",
	color: "#ccc",
	marginBottom: "10px",
};

const SidebarSectionStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: "8px",
};

const SharedItemsWrapperStyle: React.CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: "10px",
};

const SharedCategoryButtonStyle: React.CSSProperties = {
	width: "auto",
	marginBottom: 0,
};

const EmptyGridMessageStyle: React.CSSProperties = {
	margin: "auto",
	color: "#ccc",
};

const DocColumnWrapperStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	borderLeft: "1px solid #eee",
	overflow: "hidden",
	transition: "all 0.3s ease",
};

const getDocHeaderStyle = (color: string): React.CSSProperties => ({
	padding: "12px",
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

const DocScrollStyle: React.CSSProperties = {
	flex: 1,
	padding: "30px",
	overflowY: "auto",
	fontFamily: "Georgia, serif",
	whiteSpace: "pre-wrap",
	lineHeight: "1.6",
	fontSize: "14px",
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
			cursor: "pointer",
			transition: "background-color 0.2s",
			"&:hover": {
				filter: "brightness(0.95)",
			},
		};
	});

	return rules;
};
export {
	DocScrollStyle,
	getDocHeaderStyle,
	DocColumnWrapperStyle,
	DocGridContainerStyle,
	EmptyGridMessageStyle,
	EmptyStateStyle,
	SharedCategoryButtonStyle,
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
	ButtonStyle,
	DropdownWrapperStyle,
	DropdownMenuStyle,
	SidebarSectionStyle,
	dropdownItemStyle,
	dynamicHighlightStyles,
	categoryButtonStyle,
};
