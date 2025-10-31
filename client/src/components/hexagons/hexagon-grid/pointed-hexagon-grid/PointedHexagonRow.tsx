// src/components/hexagons/hexagon-row/pointed-hexagon-row/PointedHexagonRow.tsx

import React from "react";

import { IHexagonRowElements } from "../HexagonGrid.types";

import { formatComponent } from "../../../../utils/reactUtils";
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

const PointedtopHexagonGrid: React.FC<IHexagonRowElements> = ({ elements }) => {
	const renderWideLayout = () => {
		return (
			<div style={WideLayoutContainerStyle}>
				{elements.map((element, index) => (
					<React.Fragment key={index}>
						<div style={wideItemStyle(index)}>
							{formatComponent(element)}
						</div>
					</React.Fragment>
				))}
			</div>
		);
	};

	const renderNarrowLayout = () => {
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
							{formatComponent(element)}
						</div>
					))}
				</div>
				<div style={NarrowBottomRowStyle}>
					{formatComponent(bottom_row_element)}
				</div>
			</div>
		);
	};

	return (
		<div style={{ zIndex: 50 }}>
			{useNarrowLayout() ? renderNarrowLayout() : renderWideLayout()}
		</div>
	);
};
const PointedtopHexagonFeatureGrid: React.FC<
	PointedtopHexagonFeatureGridProps & {
		hex_shape_height_override?: boolean | string;
	}
> = ({
	FeatureCallouts,
	hexagon_args,
	useVerticalAlignment = false,
	hex_shape_height_override = undefined,
}) => {
	const elements = FeatureCallouts.map((calloutProps, index) => {
		return (
			<PointedTopHexagon
				key={index}
				args={hexagon_args}
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
