// src/components/hexagons/hexagonRow/HexagonRow.tsx

import React from "react";
import { formatComponent } from "../../../../utils/reactUtils";
import { IHexagonGridElements, THexRowLayoutProps } from "../HexagonGrid.types";
import {
	ContainerStyle,
	ElementStyle,
	WrapperStyle,
} from "./HexagonRow.styles";

import {
	DEFAULT_ABSOLUTE_SPACING,
	DEFAULT_RELATIVE_SPACING,
} from "./HexagonRow.consts";

const HexagonRow: React.FC<THexRowLayoutProps> = ({
	elements,
	relative_spacing,
	absolute_spacing,
	upper_first = false,
	n,
}) => {
	return (
		<>
			{elements.map((el, index) => (
				<div
					style={ElementStyle({
						relative_spacing,
						absolute_spacing,
						upper_first,
						index,
						n,
					})}
					key={index}
				>
					{formatComponent(el, true)}
				</div>
			))}
		</>
	);
};

const HexagonGrid: React.FC<IHexagonGridElements> = ({
	rows,
	relative_spacing = DEFAULT_RELATIVE_SPACING,
	absolute_spacing = DEFAULT_ABSOLUTE_SPACING,
	upper_first = false,
	containerStyle = {},
	class_name,
}) => {
	const length = rows.length;
	const n = rows[0].elements.length;
	const topExtension = rows[0].elements.some(
		(el, index) => index % 2 === (upper_first ? 0 : 1) && el !== null
	);

	const bottomExtension = rows[length - 1].elements.some(
		(el, index) => index % 2 === (upper_first ? 0 : 1) && el !== null
	);

	return (
		<div
			className={class_name ?? ""}
			style={{
				height: "100%",
				...WrapperStyle(
					topExtension,
					bottomExtension,
					length,
					n,
					relative_spacing,
					absolute_spacing
				),
				...containerStyle,
			}}
		>
			<div
				style={ContainerStyle(
					relative_spacing,
					absolute_spacing,
					length,
					n
				)}
			>
				{rows.map((row, _index) => (
					<HexagonRow
						key={_index}
						n={n}
						upper_first={upper_first}
						elements={row.elements}
						relative_spacing={relative_spacing}
						absolute_spacing={absolute_spacing}
						len={length}
					/>
				))}
			</div>
		</div>
	);
};
export { HexagonGrid };
