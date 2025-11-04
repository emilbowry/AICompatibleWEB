// src/hooks/WindowSizeDependent.tsx

import { useEffect, useState } from "react";

const LAYOUT_BREAKPOINT = 1200;

const useNarrowLayout = (threshold = LAYOUT_BREAKPOINT) => {
	const [isNarrow, setIsNarrow] = useState(false);

	useEffect(() => {
		const updateLayout = () => {
			const shouldBeNarrow = window.innerWidth < threshold;
			setIsNarrow(shouldBeNarrow);
		};
		updateLayout();
		window.addEventListener("resize", updateLayout);
		return () => {
			window.removeEventListener("resize", updateLayout);
		};
	}, [threshold]);
	return isNarrow;
};

const useBrowserScale = (): number => {
	const getScaleRatio = () => window.outerWidth / window.innerWidth;
	const [scale, setScale] = useState(getScaleRatio());

	useEffect(() => {
		const updateScale = () => {
			const current_scale = getScaleRatio();
			setScale(current_scale);
		};

		window.addEventListener("resize", updateScale);

		return () => {
			window.removeEventListener("resize", updateScale);
		};
	}, []);

	return scale;
};
export { useBrowserScale, useNarrowLayout };
