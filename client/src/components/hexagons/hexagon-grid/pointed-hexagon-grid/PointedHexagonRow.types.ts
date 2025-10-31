// src/components/hexagons/hexagonRow/VHexRow.types.ts

import { ValidComponent } from "../../../../utils/reactUtils";
interface PointedtopHexagonFeatureGridProps {
	FeatureCallouts: ValidComponent[][];

	hexagon_args: any;
	theme?: number;
	useVerticalAlignment?: boolean;
}
export type { PointedtopHexagonFeatureGridProps };
