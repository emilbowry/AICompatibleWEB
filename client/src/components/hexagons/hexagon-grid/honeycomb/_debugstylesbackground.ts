/*
Defining a debugging background
*/

import {
	ASPECT_RATIO,
	DEFAULT_ABSOLUTE_SPACING,
	DEFAULT_RELATIVE_SPACING,
} from "./HexagonRow.consts";
import { K } from "./HexagonRow.styles";
const DebugBackground = ({
	relative_spacing = DEFAULT_RELATIVE_SPACING,
	absolute_spacing = DEFAULT_ABSOLUTE_SPACING,
}) => {
	const offset =
		(relative_spacing *
			K({
				relative_spacing: relative_spacing / ASPECT_RATIO,
				absolute_spacing,
				n: 3,
				index: 0,
			})) /
		(2 * ASPECT_RATIO);

	const Pos_Y = 50 + offset;
	const Neg_y = 50 - offset;
	const border_background = `
			linear-gradient(to bottom, red 0%, transparent 4px),
			linear-gradient(to top,  red 0%, transparent 4px),
			linear-gradient(to right, red 0%, transparent 4px),
			linear-gradient(to left, red 0%, transparent 4px)
`;
	const bg_axis = `
			${border_background},
			linear-gradient(90deg, transparent calc(50% - 2px), red 50%, transparent calc(50% + 2px)),
			linear-gradient(90deg, transparent calc(25% - 2px), red 25%, transparent calc(25% + 2px)),
			linear-gradient(90deg, transparent calc(75% - 2px), red 75%, transparent calc(75% + 2px)),
			linear-gradient(150deg, transparent calc(50% - 2px), red 50%, transparent calc(50% + 2px)),
			linear-gradient(30deg, transparent calc(50% - 2px), red 50%, transparent calc(50% + 2px)),
			linear-gradient(0deg, transparent calc(${Neg_y}% - 2px), red ${Neg_y}%, transparent calc(${Neg_y}% + 2px)),
			linear-gradient(0deg, transparent calc(${Pos_Y}% - 2px), red ${Pos_Y}%, transparent calc(${Pos_Y}% + 2px)),
			linear-gradient(0deg, transparent calc(50% - 2px), red 50%, transparent calc(50% + 2px))
		`;
	return { background: bg_axis };
};
export { DebugBackground };
