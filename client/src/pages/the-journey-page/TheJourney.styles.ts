// src/pages/the-journey-page/TheJourney.styles.ts

import React from "react";
import { VOLUME_CONSTANT_SIZE_PRIME } from "../../styles";
import {
	dark_midnight_green,
	midnight_green,
} from "../../utils/defaultColours";

const IconHexStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	margin: "auto",
	height: "100%",
	opacity: 1,
};

const RowHeaderStyle: React.CSSProperties = {
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE_PRIME})`,
	textAlign: "center",

	color: dark_midnight_green,
};
const RowContentStyle: React.CSSProperties = {
	fontSize: `calc(1.8*${VOLUME_CONSTANT_SIZE_PRIME})`,
	wordBreak: "break-word",
	textAlign: "center",
	whiteSpace: "collapse",
	color: midnight_green,
};

const BlurBackgroundStyle: React.CSSProperties = {
	height: "100%",
	width: "100%",
	marginTop: "-5%",
	backdropFilter: "blur(8px)",
	position: "absolute",
	overflow: "visible",
	maskImage: "linear-gradient(to bottom,black 95%, transparent 100%)",
};

export { BlurBackgroundStyle, IconHexStyle, RowContentStyle, RowHeaderStyle };
