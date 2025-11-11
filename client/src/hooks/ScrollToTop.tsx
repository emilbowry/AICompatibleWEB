import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = (scrollOffset = 0) => {
	const location = useLocation();

	useEffect(() => {
		const scroll_Y = scrollOffset * window.innerHeight;
		window.scrollTo(0, scroll_Y);
	}, [location, scrollOffset]);
};
export { useScrollToTop };
