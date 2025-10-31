import React from "react";
import { VOLUME_CONSTANT_SIZE } from "../../styles";
import { FOOTER_HEIGHT, FOOTER_OFFSET } from "./Footer.consts";

const CenterableStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",

	margin: "auto 0",
};
const scrollVisabilityStyle = (
	isVisible: boolean,
	opacity: number,
	styling: React.CSSProperties
): React.CSSProperties => ({
	...styling,

	visibility: isVisible ? "visible" : "hidden",
	opacity: opacity,
	filter: `blur(${(1 - opacity) ** 2 * 16}px)`,
});

const FooterLayoutWrapperStyle: React.CSSProperties = {
	paddingTop: FOOTER_OFFSET,
	marginTop: `calc(-${FOOTER_HEIGHT} - ${FOOTER_OFFSET})`,
	fontSize: `calc(1.5*${VOLUME_CONSTANT_SIZE})`,
	zIndex: "-15",
};
const FooterTopStyle: React.CSSProperties = {
	height: FOOTER_HEIGHT,
	width: "100%",
};
const FooterWrapperStyle: React.CSSProperties = {
	position: "sticky",
	width: "100%",

	bottom: "0",
	height: FOOTER_HEIGHT,
};

const footerContainerStyle = (
	StyleOverrides: React.CSSProperties
): React.CSSProperties => ({
	position: "relative",
	isolation: "isolate",
	width: "100%",
	height: FOOTER_HEIGHT,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",

	alignContent: "center",
	...StyleOverrides,
});

const gridFooterStyle = (n_rows: number): React.CSSProperties => ({
	width: "100vw",
	height: FOOTER_HEIGHT,
	margin: "0 auto",
	minWidth: 0,
	color: "white",
	display: "grid",
	gridTemplateRows: `repeat(${n_rows}, calc(${FOOTER_HEIGHT}/${n_rows}))`,
});
export {
	CenterableStyle,
	footerContainerStyle,
	FooterLayoutWrapperStyle,
	FooterTopStyle,
	FooterWrapperStyle,
	gridFooterStyle,
	scrollVisabilityStyle,
};
