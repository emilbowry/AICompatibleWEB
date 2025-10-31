// src/pages/homepage/parts/about-us.tsx/AboutUs.styles.ts

import React from "react";
import { getTheme, VOLUME_CONSTANT_SIZE } from "../../../../styles";
import { bgwhite } from "../../../../utils/defaultColours";
const theme = getTheme(0);

const titleStyle: React.CSSProperties = {
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
	fontWeight: "400",
	textAlign: "center",
	color: theme.tertiaryColor,
};
const footerStyle: React.CSSProperties = {
	fontSize: `calc(1.5*${VOLUME_CONSTANT_SIZE})`,

	textAlign: "center",
	color: theme.primaryColor,
};

const imageStyling: React.CSSProperties = {};
const hStyle = { colour: bgwhite };
export { footerStyle, hStyle, imageStyling, titleStyle };
