// src/pages/home-page/parts/impact/impact.styles.ts

import {
	border_gradient,
	getTheme,
	VOLUME_CONSTANT_SIZE,
} from "../../../../styles";

const idx = 1;
let theme = getTheme(idx);

const stat_value_style: React.CSSProperties = {
	color: theme.tertiaryColor,
	paddingTop: "20%",
	fontSize: `calc(3*${VOLUME_CONSTANT_SIZE})`,

	width: "100%",
	fontWeight: "500",
	justifySelf: "center",
	textAlign: "center",
	overflow: "visible",
	textWrap: "nowrap",
};

const stat_body_style: React.CSSProperties = {
	color: theme.primaryColor,
	borderTop: `1px solid`,
	borderImage: border_gradient,
	margin: "auto",
	padding: "1%",
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,

	textAlign: "center",
	overflow: "visible",
};
const LetterFooterContainerStyle: React.CSSProperties = {
	display: "grid",
	gridTemplateColumns: "30% 70%",
	textAlign: "left",
	width: "100%",
};
const LetterFooterWrapperStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "row",

	maxWidth: "100vw",
};
const FounderLetterWrapperStyle: React.CSSProperties = {
	width: "90%",

	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
};
export {
	FounderLetterWrapperStyle,
	LetterFooterContainerStyle,
	LetterFooterWrapperStyle,
	stat_body_style,
	stat_value_style,
};
