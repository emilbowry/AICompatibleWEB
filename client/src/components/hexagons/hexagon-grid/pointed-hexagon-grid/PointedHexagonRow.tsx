// src/components/hexagons/hexagon-row/pointed-hexagon-row/PointedHexagonRow.tsx

import React from "react";

import { IHexagonRowElements } from "../HexagonGrid.types";

import { FormatComponent } from "../../../../utils/reactUtils";
import { PointedTopHexagon } from "../../Hexagons";

import { useNarrowLayout } from "../../../../hooks/WindowSizeDependent";
import {
	NarrowBottomRowStyle,
	narrowItemStyle,
	NarrowLayoutContainerStyle,
	NarrowTopRowStyle,
	wideItemStyle,
	WideLayoutContainerStyle,
} from "./PointedHexagonRow.styles";
import { PointedtopHexagonFeatureGridProps } from "./PointedHexagonRow.types";

const WideHexGrid: React.FC<IHexagonRowElements> = ({ elements }) => {
	return (
		<div style={WideLayoutContainerStyle}>
			{elements.map((element, index) => (
				<React.Fragment key={index}>
					<div style={wideItemStyle(index)}>
						<FormatComponent Component={element} />
					</div>
				</React.Fragment>
			))}
		</div>
	);
};

const NarrowHexGrid: React.FC<IHexagonRowElements> = ({ elements }) => {
	const top_row_elements = elements.slice(0, 2);
	const bottom_row_element = elements[2];

	return (
		<div style={NarrowLayoutContainerStyle}>
			<div style={NarrowTopRowStyle}>
				{top_row_elements.map((element, index) => (
					<div
						style={narrowItemStyle(index)}
						key={index}
					>
						<FormatComponent Component={element} />
					</div>
				))}
			</div>
			<div style={NarrowBottomRowStyle}>
				<FormatComponent Component={bottom_row_element} />
			</div>
		</div>
	);
};
const PointedtopHexagonGrid: React.FC<IHexagonRowElements> = ({ elements }) => {
	const Comp = useNarrowLayout() ? NarrowHexGrid : WideHexGrid;

	return (
		<div style={{ zIndex: 50 }}>
			<Comp elements={elements} />
		</div>
	);
};
const PointedtopHexagonFeatureGrid: React.FC<
	PointedtopHexagonFeatureGridProps & {
		hex_shape_height_override?: boolean | string;
		_background?: string;
		_background_attached?: boolean;
		_background_size?: string;
	}
> = ({
	FeatureCallouts,
	hexagon_args,
	useVerticalAlignment = false,
	_background,
	_background_attached = false,
	_background_size = "100vw 150vh",

	hex_shape_height_override = undefined,
}) => {
	const elements = FeatureCallouts.map((calloutProps, index) => {
		return (
			<PointedTopHexagon
				key={index}
				args={hexagon_args}
				_background={_background}
				_background_attached={_background_attached}
				_background_size={_background_size}
				element={calloutProps}
				opacity={1}
				useVerticalAlignment={useVerticalAlignment}
				hex_shape_height_override={hex_shape_height_override}
			/>
		);
	});

	return <PointedtopHexagonGrid elements={elements as any} />;
};
export { PointedtopHexagonFeatureGrid };
