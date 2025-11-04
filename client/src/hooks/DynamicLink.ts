import { useEffect, useRef, useState } from "react";
import { interactiveLinkStyle } from "../styles";

interface IDynamicLinkParams {
	useDefaultDecoration?: boolean;
	style_args?: any[];
	StyleOverrides?: React.CSSProperties;
	condition_function?: (isOver: boolean, ...condition_args: any[]) => boolean;
	condition_args?: any[];
}
const useDynamicLink = ({
	useDefaultDecoration = false,
	style_args = [],
	condition_args = [],
	StyleOverrides,
	condition_function,
}: IDynamicLinkParams) => {
	const [isOver, setIsOver] = useState(false);
	const elementRef = useRef<any>(null);
	// const handleMouseOver = () => {
	// 		setIsOver(true);
	// 	};
	// 	const handleMouseOut = () => {
	// 		setIsOver(false);
	// 	};
	useEffect(() => {
		const element = elementRef.current;
		const handleMouseOver = () => {
			setIsOver(true);
		};
		const handleMouseOut = () => {
			setIsOver(false);
		};
		if (element) {
			element.addEventListener(
				"mouseover",
				handleMouseOver as EventListener
			);
			element.addEventListener(
				"mouseout",
				handleMouseOut as EventListener
			);
		}

		return () => {
			const currentElement = elementRef.current;
			if (currentElement) {
				currentElement.removeEventListener(
					"mouseover",
					handleMouseOver as EventListener
				);
				currentElement.removeEventListener(
					"mouseout",
					handleMouseOut as EventListener
				);
			}
		};
	}, []);
	const linkStyle = {
		...interactiveLinkStyle(
			condition_function
				? condition_function(isOver, ...condition_args)
				: isOver,
			useDefaultDecoration,
			...style_args
		),
		...StyleOverrides,
	};

	return {
		ref: elementRef,
		style: linkStyle,
	};
};
export { useDynamicLink };
