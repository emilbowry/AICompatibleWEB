// src/components/callingcard/graphics.tsx
// @ts-ignore
import React from "react";
import { logo_blue, logo_yellow } from "../../utils/defaultColours";
const LogoLinearGradient = (
	<linearGradient
		id="logoGradient"
		x1="10%"
		y1="50%"
		x2="100%"
		y2="50%"
	>
		<stop
			offset="0%"
			stopColor={`${logo_yellow}`}
		/>
		<stop
			offset="100%"
			stopColor={`${logo_blue}`}
		/>
	</linearGradient>
);

const svg_logo_grad = <defs>{LogoLinearGradient}</defs>;
const bullseye = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="url(#logoGradient)"
		strokeWidth="1.4px"
		strokeLinecap="round"
		viewBox="0 0 34 34"
	>
		{svg_logo_grad}
		<path
			d="
	M 22.13 2.905 
	A 15 15 0 0 0 17 2 
	A 15 15 0 0 0 2 17 
	A 15 15 0 0 0 17 32 
	A 15 15 0 0 0 32 17 
	A 15 15 0 0 0 31.095 11.867 
	M 22 8.34 
	A 10 10 0 0 0 17 7 
	A 10 10 0 0 0 7 17 
	A 10 10 0 0 0 17 27 
	A 10 10 0 0 0 27 17 
	A 10 10 0 0 0 25.66 12 
	M 17 17 L 31 3 
	M 24.0715 9.929 h 5 
	M 24.0715 9.929 v -5 
	M 27.606 6.393 h 5 
	M 27.606 6.393 v -5

  "
		/>
	</svg>
);

const pencil = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="url(#logoGradient)"
		strokeWidth="1px"
		strokeLinecap="round"
	>
		{svg_logo_grad}

		<path
			d="M 21.174 6.812 a 1 1 0 0 0 -3.986 -3.987 L 3.842 16.174 a 2 2 0 0 0 -0.5 0.83 l -1.321 4.352 a 0.5 0.5 0 
		0 0 0.623 0.622 l 4.353 -1.32 a 2 2 0 0 0 0.83 -0.497 z  
M 15 5 L 19 9 
M 4 16 L 8 20
M 6 18 L 17 7
M 17 3 L 21 7
M 3 21 L 2.25 21.75"
		/>
	</svg>
);

const bulb = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="url(#logoGradient)"
		strokeWidth="1px"
		strokeLinecap="round"
	>
		{svg_logo_grad}

		<path
			d="
M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5
A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4"
		/>
	</svg>
);

const linkedin_svg = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		height="100%"
		stroke="currentColor"
		strokeWidth="1"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect
			width="4"
			height="12"
			x="2"
			y="9"
		/>
		<circle
			cx="4"
			cy="4"
			r="2"
		/>
	</svg>
);

export { bulb, bullseye, linkedin_svg, LogoLinearGradient, pencil };
