// src/components/callingcard/CallingCard.styles.ts

import React from "react";
import { border_gradient } from "../../styles";
const GridBodyStyle: React.CSSProperties = {
	borderImage: border_gradient,
	display: "grid",
};

const GridItemStyle: React.CSSProperties = {
	height: "100%",
	width: "100%",
	margin: 0,
	padding: 0,
};
const containerStyle: React.CSSProperties = {
	position: "relative",
	display: "flex",
	zIndex: 10,
	flexDirection: "column",
	height: "100%",
};

const SideBarBottomOverlapStyle: React.CSSProperties = {
	paddingBottom: "20%",
	marginBottom: "-20%",
	zIndex: 10,
};
const SideBarTopOverlapStyle: React.CSSProperties = {
	paddingTop: "66%",
	marginTop: "-66%",
	zIndex: 5,
};
const SideBarFullOverlapStyle: React.CSSProperties = {
	...SideBarBottomOverlapStyle,
	...SideBarTopOverlapStyle,
};

export {
	containerStyle,
	GridBodyStyle,
	GridItemStyle,
	SideBarBottomOverlapStyle,
	SideBarFullOverlapStyle,
	SideBarTopOverlapStyle,
};
