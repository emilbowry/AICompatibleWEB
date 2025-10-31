import React from "react";

import { IHexagonStyleParams } from "./Hexagons.types";

const containerStyle = ({
	opacity = 0.8,
	filter = "",
}: IHexagonStyleParams): React.CSSProperties => {
	return {
		position: "relative",
		fontSize: 0,
		overflow: "visible",

		opacity,
		filter,
	};
};

const svgStyle = ({}: IHexagonStyleParams): React.CSSProperties => {
	return {};
};

const s = 1;

const POINTED_LEFT_CUTOUT =
	"polygon(0% 0%, 100% 0%, 0% 25%, 0% 100%, 100% 100%, 0% 75%)";
const POINTED_RIGHT_CUTOUT =
	"polygon(100% 0%, 0% 0%, 100% 25%, 100% 100%, 0% 100%, 100% 75%)";
const FLATTOP_LEFT_CUTOUT =
	"polygon(0 0,0 100%,100% 100%,50% 100%,0% 50%,50% 0%)";
const FLATTOP_RIGHT_CUTOUT =
	"polygon(100% 50%,100% 100%,50% 100%,100% 50%,50% 0%, 100% 0%)";
const leftCutout = (usePointedTop: boolean) =>
	usePointedTop ? POINTED_LEFT_CUTOUT : FLATTOP_LEFT_CUTOUT;
const rightCutout = (usePointedTop: boolean) =>
	usePointedTop ? POINTED_RIGHT_CUTOUT : FLATTOP_RIGHT_CUTOUT;

const polyCutoutStyle = (
	usePointedTop: boolean,
	isLeft: boolean,
	hex_shape_height_override: boolean | string | undefined,
	hex_shape_width_override: boolean | string | undefined
): React.CSSProperties => {
	const height = hex_shape_height_override
		? typeof hex_shape_height_override === "string"
			? hex_shape_height_override
			: ""
		: `calc(${100 * s}%)`;
	const width = hex_shape_width_override
		? typeof hex_shape_width_override === "string"
			? hex_shape_width_override
			: ""
		: `calc(${50 * s}%)`;

	return {
		position: "relative",

		shapeOutside: isLeft
			? leftCutout(usePointedTop)
			: rightCutout(usePointedTop),
		shapeMargin: "5%",
		float: isLeft ? "left" : "right",
		height,
		width,
	};
};

const ElementSectionStyle: React.CSSProperties = {
	position: "relative",
	top: 0,

	width: "100%",
	height: `calc(100%)`,
};

const ElementWrapperStyle: React.CSSProperties = {
	position: "relative",

	width: "100%",
	display: "block",
	height: `calc(100%)`,
};

const HexagonalContentStyle: React.CSSProperties = {
	position: "absolute",
	height: `calc(100%)`,
	width: "100%",
	top: 0,
};

const ELWrapperStyle: React.CSSProperties = {
	position: "relative",
	height: "100%",
	margin: 0,
};

const ElContainerStyle: React.CSSProperties = {
	position: "relative",
	margin: 0,
	padding: 0,
	height: "100%",
	top: 0,
};

export {
	containerStyle,
	ElContainerStyle,
	ElementSectionStyle,
	ElementWrapperStyle,
	ELWrapperStyle,
	HexagonalContentStyle,
	polyCutoutStyle,
	svgStyle,
};
