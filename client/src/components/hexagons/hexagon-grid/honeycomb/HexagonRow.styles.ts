// src/components/hexagons/hexagonRow/HexagonRow.styles.ts
import React from "react";

import {
	TDualScalingFunction,
	TScaleParams,
	TScalingFunction,
	TWithCalc,
} from "../HexagonGrid.types";
import { DebugBackground } from "./_debugstylesbackground";
import { ASPECT_RATIO, SIDE_SHIFT } from "./HexagonRow.consts";
/* 	 Makes sense since devolves into an equilateral triangle problem
	== 1/cos(30) */
const colGap: TScalingFunction = ({ relative_spacing = 0 }) =>
	relative_spacing * ASPECT_RATIO;

/*
 **IMPORTANT**:row-gap is CANNONICALLY DEFINED in terms of item **width**
 */
const rowGap: TDualScalingFunction = ({
	relative_spacing = 0,
	absolute_spacing = 0,
}) => [relative_spacing, absolute_spacing];

/** 
	* SCALING CORRECTION FACTOR: k
	* @derivation 
		k(relative_space) scales, transformed % into % of orignal element (container/n)
		g:= col-gap
		Derivation:W.n = W'.n +(n-1).g
		g = Wx/100
			W. (n-(n-1).(x/100))/n = W'
		let W=kW'
		k = n/(n-(n-1).(x/100))
 */
const K: TScalingFunction = (scale_params) =>
	scale_params.n /
	(scale_params.n - (scale_params.n - 1) * (colGap(scale_params) / 100));
/*
SCALING CORRECTION FACTOR RESULTS
*/
const delta_W: TScalingFunction = (scale_params) => K(scale_params) - 1;
/* Mathematical Definitons */
const centerVertTranslation: TScalingFunction = () => 50 / ASPECT_RATIO;

/* Since it is relative to width **already** by definition no need for kappa scaling */

const gapMidpointTranslation: TScalingFunction = ({ relative_spacing = 0 }) =>
	relative_spacing / ASPECT_RATIO / 2;

/*
 **IMPORTANT**:	- CANNONICALLY DEFINED in terms of item **width**
 */
const YOffset: TDualScalingFunction = (scale_params): [number, number] => {
	const factor = -(+scale_params.index % 2 === +!scale_params.upper_first);
	return [
		factor *
			(centerVertTranslation(scale_params) +
				gapMidpointTranslation(scale_params)),
		(factor * scale_params.absolute_spacing) / 2,
	];
};
/* Since column-gap is our cannonical inner translation we need to maintain the absolute shift */

const overlapTranslation: TScalingFunction = (scale_params) => {
	return SIDE_SHIFT * K(scale_params) * 1;
};
/* overlapTranslation would shift the sclaed hexagon correctly if the centered at the same point */

const PositionCorrectionFactor: TScalingFunction = (scale_params) =>
	+delta_W(scale_params) / 2;

const XScaleCorrectionFactor: TScalingFunction = (scale_params) =>
	(K(scale_params) * scale_params.relative_spacing) / 4;

const XOffset: TDualScalingFunction = (scale_params) => {
	const shift_factor = (scale_params.n - 1) / 2 - scale_params.index;

	return [
		shift_factor *
			(overlapTranslation(scale_params) +
				PositionCorrectionFactor(scale_params) +
				XScaleCorrectionFactor(scale_params)),
		shift_factor * (-scale_params.absolute_spacing * ASPECT_RATIO),
	];
};

/* Util Functions */
const getCalc = (
	vals: ReturnType<TScalingFunction | TDualScalingFunction>,
	dual: boolean = false
) => {
	const [rel, abs] = ([] as number[]).concat(vals, 0);
	const innerStr = `(${rel}% + ${abs}px)`;
	return dual
		? [`calc(${innerStr})`, `calc(-1*${innerStr})`]
		: `calc(${innerStr})`;
};

const withCalc: TWithCalc = (fn, dual) => {
	return (...args) => {
		return getCalc(fn(...(args as [any])), dual) as any;
	};
};

const calculateColGap = withCalc(colGap, false);

const calcYShift = withCalc(YOffset, true);
const calcXShift = withCalc(XOffset, true);

const ElementStyle = (scale_params: TScaleParams): React.CSSProperties => {
	const Xshifts = calcXShift(scale_params);
	const Yshifts = calcYShift(scale_params);
	return {
		marginLeft: Xshifts[0],
		marginRight: Xshifts[1],
		marginTop: Yshifts[0],
		marginBottom: Yshifts[1],
	};
};

/**
 * Grid container: grid-template-columns: repeat(3, 1fr).
 *
 * Each item spans 1/3 container width → explains /3 in gap formulas.

 * @equivalent The GridAutoRows is essentially equivalent to:
	
		const row_rel_spacing = _relative_spacing / length;
			...
		rowGap: calculateRowGap(
			row_rel_spacing,
			absolute_spacing,
			length
		) as string

 * But it is now defined for "negative"/overlapping rows

	Later work out why this doesnt work for templateCols
	gridTemplateColumns: `repeat(${n}, ${1/3})`,

 */

const background_override = (
	scale_params: TScaleParams,
	useDebugBackground = false
) => (useDebugBackground ? DebugBackground(scale_params) : {});
const vertGap = (
	scale_params: TScaleParams,
	length: number = 1,
	useRowGap = false
): React.CSSProperties => {
	return useRowGap
		? { rowGap: calculateRowGap(scale_params) }
		: { gridAutoRows: calculateRowHeight(scale_params, length) };
};
const rowHeight: TDualScalingFunction = (scale_params, length: number) => [
	100 / length + scale_params.relative_spacing,
	scale_params.absolute_spacing,
];
const calculateRowHeight = withCalc(rowHeight, false);
const calculateRowGap = withCalc(rowGap, false);
const ContainerStyle = (
	_relative_spacing: number = 0,
	absolute_spacing: number = 0,
	length: number = 1,
	n: number,

	useRowGap = false,
	useDebugBackground = false,
	index = 0
): React.CSSProperties => {
	const scale_params_prime = { absolute_spacing, n, index };
	const row_scale_params = {
		relative_spacing: _relative_spacing / length,
		...scale_params_prime,
	};
	const col_scale_params = {
		relative_spacing: _relative_spacing * (1 / n),
		...scale_params_prime,
	};
	return {
		...background_override(row_scale_params, useDebugBackground),
		...vertGap(row_scale_params, length, useRowGap),
		position: "relative",

		columnGap: calculateColGap(col_scale_params),
		display: "grid",
		gridTemplateColumns: `repeat(${n}, 1fr)`,
		overflow: "visible",
	};
};
/* since inverted offset logic, padding pottom is slightly off */
const WrapperStyle = (
	topExtension: boolean,
	bottomExtension: boolean,
	length: number,
	n: number,
	relative_spacing: number,
	absolute_spacing: number,
	index = 0
) => {
	const k = K({ relative_spacing, absolute_spacing, n, index });
	const base_row_height = ((3 / 2) * (1 / ASPECT_RATIO) * 100) / 3;

	const relative_correction_bot =
		(base_row_height * (1 / 3) * 2 * (relative_spacing / 100)) / k;
	const relative_correction_top =
		(base_row_height * (1 / 3) * (1 + relative_spacing / 100)) / k;

	const rel_padding_top_factor = !topExtension ? 0 : 1;
	const abs_padding_top_factor = !topExtension ? 0 : 0.5;

	const rel_padding_bottom_offset = !bottomExtension ? 2 : 1;
	const abs_padding_bottom_offset = !bottomExtension ? 1.5 : 1;

	const correction = n === 2 ? 1.5 : 1;
	return {
		paddingTop: `calc(${
			correction * rel_padding_top_factor * relative_correction_top
		}% + ${absolute_spacing * correction * abs_padding_top_factor}px)`,
		paddingBottom: `calc(${
			(length - rel_padding_bottom_offset) *
			correction *
			relative_correction_bot
		}% + ${
			correction * absolute_spacing * (length - abs_padding_bottom_offset)
		}px)`,
	};
};

export { ContainerStyle, ElementStyle, K, WrapperStyle };
