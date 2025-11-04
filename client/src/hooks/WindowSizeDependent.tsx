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
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const updateScale = () => {
			if (typeof window !== "undefined") {
				setScale(window.outerWidth / window.innerWidth);
			}
		};

		window.addEventListener("resize", updateScale);

		return () => {
			window.removeEventListener("resize", updateScale);
		};
	}, []);

	return scale;
};
export { useBrowserScale, useNarrowLayout };
