// src/hooks/MobileDependant.tsx

import { useEffect, useState } from "react";

const isSSR = typeof window === "undefined";

const useIsMobile = (): boolean => {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		if (isSSR) {
			return;
		}

		const pointer_query = window.matchMedia("(pointer: coarse)");
		const hover_query = window.matchMedia("(hover: none)");

		const updateStatus = () => {
			const isCoarsePointer = pointer_query.matches;
			const hasNoHover = hover_query.matches;
			const finalResult = isCoarsePointer && hasNoHover;

			setIsMobile(finalResult);
		};

		updateStatus();

		pointer_query.addEventListener("change", updateStatus);
		hover_query.addEventListener("change", updateStatus);

		return () => {
			pointer_query.removeEventListener("change", updateStatus);
			hover_query.removeEventListener("change", updateStatus);
		};
	}, []);

	return isMobile;
};

const user_agent = typeof navigator !== "undefined" ? navigator.userAgent : "";

const IS_CHROME = /Chrome/i.test(user_agent);
export { IS_CHROME, useIsMobile, user_agent };
