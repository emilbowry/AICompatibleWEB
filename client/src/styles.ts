// src/styles.tsx

import React from "react";

import background from "./assets/background.png";
import {
	bgwhite,
	dark_midnight_green,
	dark_mix_green,
	light_logo_blue,
	lighter_logo_blue,
	logo_blue,
	logo_yellow,
	midnight_green,
	o_mix_green,
} from "./utils/defaultColours";
import { TValidStyle } from "./utils/styles.types";

const BackgroundStyle: React.CSSProperties = {
	backgroundImage: `url(${background})`,
	backgroundRepeat: "repeat",

	backgroundSize: "cover",

	width: "100vw",
	position: "fixed",
	zIndex: -20,
	top: 0,
	inset: 0,
};

const logo_gradient = `linear-gradient(to right, ${logo_yellow} 0%, ${logo_blue} 100%)`;
const logo_gradient_prime = `linear-gradient(to right, ${logo_yellow} 40%, ${logo_blue} 100%)`;

// const logo_gradient_prime = `linear-gradient(to right, ${logo_blue} 0%, ${logo_yellow} 100%)`;

const border_gradient = `${logo_gradient} 1`;
// const GenericSectionStyle: React.CSSProperties = {
// 	border: "1px solid black",
// 	backgroundColor: "rgba(255, 0, 0, 0.2)",
// };
const getTheme = (index: number) => {
	const theme = {
		backgroundColor: bgwhite,
		primaryColor: midnight_green,
		secondaryColor: dark_mix_green,
		tertiaryColor: logo_blue,
	};
	if (index === -1) {
		theme.backgroundColor = "transparent";
		theme.primaryColor = light_logo_blue;
		theme.secondaryColor = lighter_logo_blue;
		theme.tertiaryColor = logo_yellow;
	} else if (index % 2 === 1) {
		theme.backgroundColor = dark_midnight_green;
		theme.primaryColor = light_logo_blue;
		theme.secondaryColor = o_mix_green;
		theme.tertiaryColor = logo_yellow;
	}
	return theme;
};

const linkStyle = (
	isUnderlined = true,
	useDefaultDecoration = false,
	bg_height = "3px"
): React.CSSProperties => ({
	textDecorationLine:
		isUnderlined || useDefaultDecoration ? `underline` : "none",
	textDecorationColor: `${logo_blue}`,
	backgroundOrigin: "content-box",
	backgroundImage: `${logo_gradient}`,
	backgroundPosition: "bottom left",
	backgroundRepeat: "no-repeat",
	boxSizing: "border-box",
	backgroundSize: isUnderlined ? `100% ${bg_height}` : `0% ${bg_height}`,
	width: "fit-content",
	color: "#333",
});

const interactiveLinkStyle = (
	isUnderlined = false,
	useDefaultDecoration = false,
	bg_height?: string
): React.CSSProperties => ({
	...linkStyle(isUnderlined, useDefaultDecoration, bg_height),
	transition: "background-size 0.3s ease-in",
	padding: 0,
});

const generateGradient = (
	n: number,

	s: string = logo_yellow,
	e: string = logo_blue
): string[] => {
	if (n <= 2) return [s, e];
	return Array.from(
		{ length: n },
		(_, i) =>
			"#" +
			(
				(1 << 24) |
				[1, 3, 5]
					.map((k) =>
						Math.round(
							parseInt(e.slice(k, k + 2), 16) * (i / (n - 1)) +
								parseInt(s.slice(k, k + 2), 16) *
									(1 - i / (n - 1))
						)
					)
					.reduce((acc, v) => (acc << 8) | v, 0)
			)
				.toString(16)
				.slice(1)
	);
};

const styleObjectToString = <T extends string, U extends string, V>(
	styleObject: TValidStyle<T, U, V>
): string => {
	let cssString = "";

	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === "object" && value !== null) {
			cssString += `${key}{${styleObjectToString(value)}}`;
		} else {
			const propertyName = key.replace(
				/[A-Z]/g,
				(letter) => `-${letter.toLowerCase()}`
			);
			cssString += `${propertyName}:${value};`;
		}
	}

	return cssString;
};

const VOLUME_CONSTANT_SIZE = "1vw*calc(sqrt(calc(1vw/1vw)*calc(1vh/1vw)))";
const VOLUME_CONSTANT_SIZE_PRIME =
	"1vh*calc(sqrt(calc(1vw/1vh)*calc(1vh/1vh)))";

export {
	BackgroundStyle,
	border_gradient,
	generateGradient,
	getTheme,
	interactiveLinkStyle,
	linkStyle,
	logo_gradient_prime,
	styleObjectToString,
	VOLUME_CONSTANT_SIZE,
	VOLUME_CONSTANT_SIZE_PRIME,
};
