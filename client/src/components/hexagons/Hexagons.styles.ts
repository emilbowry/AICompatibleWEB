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

const inner_point_left_cutout = "polygon(100% 0%, 100% 100%, 0% 75%, 0% 25%)";
const inner_flat_left_cutout =
	"polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 50%)";
const inner_flat_right_cutout =
	// "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 50%)";
	"polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%)";

const inner_point_right_cutout = "polygon(0% 0%, 100% 25%, 100% 75%, 0% 100%)";

const leftCutout = (usePointedTop: boolean) =>
	usePointedTop ? POINTED_LEFT_CUTOUT : FLATTOP_LEFT_CUTOUT;
const rightCutout = (usePointedTop: boolean) =>
	usePointedTop ? POINTED_RIGHT_CUTOUT : FLATTOP_RIGHT_CUTOUT;

const leftBoundingBG = (usePointedTop: boolean) =>
	usePointedTop ? inner_point_left_cutout : inner_flat_left_cutout;
const rightBoundingBG = (usePointedTop: boolean) =>
	usePointedTop ? inner_point_right_cutout : inner_flat_right_cutout;

const polyCutoutStyle = (
	usePointedTop: boolean,
	isLeft: boolean,
	hex_shape_height_override: boolean | string | undefined,
	hex_shape_width_override: boolean | string | undefined,
	background?: string
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
		clipPath: isLeft
			? background && leftBoundingBG(usePointedTop)
			: background && rightBoundingBG(usePointedTop),
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
