// src/features/page/Page.Styles.ts

import React from "react";

const PageStyle: React.CSSProperties = {
	flexGrow: "1",
	position: "relative",
	flexDirection: "column",
};
const MainStyle: React.CSSProperties = {
	position: "relative",
	height: "100%",
	maxWidth: "100vw",
	overflow: "clip",
	display: "flex",
	flexDirection: "column",
	zIndex: "5",
};

export { MainStyle, PageStyle };
