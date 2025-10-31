// src/hooks/WindowSizeDependent.tsx

import { useEffect, useState } from "react";

const LAYOUT_BREAKPOINT = 1200;

const useNarrowLayout = (threshold = LAYOUT_BREAKPOINT) => {
	const [isNarrow, setIsNarrow] = useState(false);

	const updateLayout = () => {
		const shouldBeNarrow = window.innerWidth < threshold;
		if (shouldBeNarrow !== isNarrow) {
			setIsNarrow(shouldBeNarrow);
		}
	};

	useEffect(() => {
		updateLayout();
		window.addEventListener("resize", updateLayout);
		return () => {
			window.removeEventListener("resize", updateLayout);
		};
	}, [isNarrow]);
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
