// src/components/partnershipbar/PartnershipBar.styles.ts

import React from "react";
import { getTheme } from "../../styles";
import { title_font_colour } from "../../utils/defaultColours";
import { TAtRule, TValidStyle } from "../../utils/styles.types";

const PartnerStyles: {
	Small: React.CSSProperties;
	Large: React.CSSProperties;
} = {
	Small: {
		display: "grid",
		gridTemplateRows: "1fr",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "2rem",
		padding: "1rem",
		borderTop: "3px solid",
		borderBottom: "3px solid",
		borderColor: title_font_colour,
	},
	Large: {
		position: "relative",

		justifyContent: "center",
		alignItems: "center",

		width: "100%",
	},
};

const MarqueeFrameStyle: React.CSSProperties = {
	margin: "0 10%",
	position: "relative",
	border: "1px solid",
	borderColor: "rgb(255 255 255 / 20%)",
	height: "10vh",
	borderRadius: "10vh",
	zIndex: 99,

	backgroundColor: "rgb(255 255 255 / 40%)",
	background: `linear-gradient(to right, rgb(255 222 89 / 20%) 0%, rgb(12 192 223 / 20%)) 100%,

		rgb(255 255 255 / 20%)`,
	backdropFilter: "blur(8px)",
};

const MarqueeWindowStyle: React.CSSProperties = {
	position: "relative",

	height: "10vh",
	maskOrigin: "content-box",
	maskImage:
		"linear-gradient(to right, transparent 1%, black 10%, black 90%, transparent 99%)",

	display: "grid",

	alignContent: "center",
};

const MarqueeContentStyle: React.CSSProperties = {
	display: "flex",

	position: "relative",

	alignItems: "center",

	animation: `90s linear infinite slide-in`,
};

const PartnerWrapperStyle: React.CSSProperties = {
	flexShrink: 0,
	zIndex: -1,
	position: "relative",
	margin: "0 30px",
	justifyContent: "space-between",
};
const Keyframes: TValidStyle<TAtRule, undefined, "to" | "from"> = {
	"@keyframes slide-in": {
		to: {
			transform: "translateX(-100%)",
		},
		from: {
			transform: "translateX(0%)",
		},
	},
};

const rowLayoutStyle = (
	n_bricks: number,
	max_bricks: number
): React.CSSProperties => {
	return {
		overflow: "visible",
		justifyContent: "center",
		justifyItems: "center",
		alignItems: "center",
		alignContent: "center",
		display: "grid",
		gridTemplateColumns: `repeat(${n_bricks}, ${100 / max_bricks}%)`,
	};
};
const PartnerImageWrapperStyle: React.CSSProperties = {
	aspectRatio: "2.5",
	justifyContent: "center",
	alignContent: "center",
};
const CompactViewStyle: React.CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: "20px",
};
const PBWallStyle = (index: number): React.CSSProperties => ({
	...PartnerStyles["Large"],
	borderColor: getTheme(index).tertiaryColor,
});
export {
	CompactViewStyle,
	Keyframes,
	MarqueeContentStyle,
	MarqueeFrameStyle,
	MarqueeWindowStyle,
	PartnerImageWrapperStyle,
	PartnerWrapperStyle,
	PBWallStyle,
	rowLayoutStyle,
};
