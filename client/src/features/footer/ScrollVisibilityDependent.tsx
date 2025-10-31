// src/features/footer/ScrollVisibilityDependent.tsx

import React, { useCallback, useEffect, useState } from "react";
import { ValidComponent, formatComponent } from "../../utils/reactUtils";
import { scrollVisabilityStyle } from "./Footer.styles";
const calcVisibilityRegion = (
	docHeight: number,
	borders: [number, number],
	footerVH: number,

	viewportHeight: number
): [number, number, number] => {
	const positions = [borders[0], (borders[0] + borders[1]) / 2, borders[1]];
	return positions.map(
		(n) =>
			n * viewportHeight * footerVH +
			(docHeight - (1 + footerVH) * viewportHeight)
	) as [number, number, number];
};

const useScrollVisibility = (
	borders?: [number, number],
	footerVH = 0.7,
	styling: React.CSSProperties = {}
) => {
	const noBorders = borders === undefined;
	const [isVisible, setIsVisible] = useState(noBorders);
	const [opacity, setOpacity] = useState(+noBorders);

	const handleScroll = useCallback(() => {
		if (noBorders) return;

		const current_scroll_y = window.scrollY + 2;

		const [maxVis, , minVis] = calcVisibilityRegion(
			document.documentElement.scrollHeight,
			borders,
			footerVH,
			window.innerHeight
		);
		setOpacity(
			Math.min(
				1,
				Math.max(0, (current_scroll_y - minVis) / (maxVis - minVis))
			)
		);

		setIsVisible(current_scroll_y >= minVis);
	}, [borders, footerVH]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return scrollVisabilityStyle(isVisible, opacity, styling);
};
const ScrollVisibilityDependent: React.FC<{
	element: ValidComponent;
	percentage?: number;
	borders?: [number, number];
	StyleOverrides?: React.CSSProperties;
}> = ({ element, StyleOverrides = {}, borders = undefined }) => (
	<div style={useScrollVisibility(borders, 0.7, StyleOverrides)}>
		{formatComponent(element as any)}
	</div>
);
export { ScrollVisibilityDependent };
