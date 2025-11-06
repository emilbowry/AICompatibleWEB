import React, { useEffect, useRef, useState } from "react";
import { LogoHexagon } from "../../components/hexagons/LogoHexagon";
import { Page } from "../../features/page/Page";
const demoPage: React.FC = () => {
	return <div></div>;
};

type TOptions = "fixed" | "partial" | "full";

// const useRotation = (
// 	mode: TOptions = "fixed",
// 	_omega = 180,
// 	scroll_fraction = 0.5,
// 	_theta = -180
// ): number => {
// 	const [rotation, setRotation] = useState(-180);
// 	// const [offset, setOffset] = useState(0);
// 	const offset = useRef(0);
// 	const theta = useRef(_theta);
// 	const omega = useRef(_omega / window.innerHeight);
// 	useEffect(() => {
// 		const handleScroll = () => {
// 			const calcAngle = (current_scroll: number) => {
// 				return current_scroll * omega.current;
// 			};
// 			const currentScrollY = window.scrollY;

// 			const newRotation = calcAngle(currentScrollY);
// 			setRotation((oldRotation) => {
// 				let _rot = oldRotation;
// 				if (mode === "full") {
// 					_rot = newRotation;
// 				} else if (mode === "partial") {
// 					_rot = oldRotation === 0 ? 0 : newRotation;
// 				} else if (mode === "fixed") {
// 					if (oldRotation < newRotation) {
// 						_rot = newRotation;
// 					} else if (offset.current < newRotation) {
// 						_rot = newRotation;
// 					} else {
// 						_rot = oldRotation;
// 					}
// 				}

// 				if (newRotation < oldRotation) {
// 					if (offset.current === 0) {
// 						theta.current === theta.current + newRotation;
// 					}
// 					offset.current = newRotation;
// 				}
// 				console.log(_rot);
// 				console.log(offset.current === 0);

// 				return _rot;
// 			});
// 		};

// 		window.addEventListener("scroll", handleScroll);
// 		return () => {
// 			window.removeEventListener("scroll", handleScroll);
// 		};
// 	}, [mode, omega, scroll_fraction]);

// 	return rotation + theta.current;
// };

const useRotation = (
	mode: TOptions = "fixed",
	_omega = 180,
	scroll_fraction = 0.5,
	_theta = -180
): number => {
	const [effectiveScroll, setEffectiveScroll] = useState(0);
	// const [offset, setOffset] = useState(0);
	const offset = useRef(0);
	const theta = useRef(_theta);
	const omega = useRef(_omega / window.innerHeight);
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			setEffectiveScroll((previousScroll) => {});
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [mode, omega, scroll_fraction]);

	return effectiveScroll + theta.current;
};

/* 
- Fixed:
	- upward never
	- downward before bound

	partial:
		- upward disabled never after exceeding bound
		- downward before bound

	full:
		- upward when in bounds
		- downward before bound
 */

// const useRotation = (mode: TOptions = "fixed"): number => {
// 	const [rotation, setRotation] = useState(-180);
// 	const [offSet, setOffset] = useState(0);
// 	const bound = useRef(window.innerHeight * 0.5);
// 	const bound_off = useRef(0);

// 	useEffect(() => {
// 		const handleScroll = () => {
// 			// const scrollEnd = window.innerHeight * 0.5;
// 			const currentScrollY = window.scrollY - offSet;

// 			const scrollFraction =
// 				(currentScrollY - bound_off.current) / bound.current;
// 			const clampedFraction = Math.max(
// 				0,
// 				Math.min(scrollFraction, 1) * 180
// 			);

// 			const newRotation = -180 + clampedFraction;
// 			setRotation((oldRotation) => {
// 				if (mode === "fixed" && oldRotation > newRotation) {
// 					bound_off.current = currentScrollY;
// 				}

// 				return mode === "full"
// 					? newRotation
// 					: mode === "partial"
// 					? oldRotation === 0
// 						? 0
// 						: newRotation
// 					: oldRotation < newRotation
// 					? newRotation
// 					: oldRotation;
// 			});
// 			// setOffset(() => (mode !== "full" ? 0 : currentScrollY));
// 		};

// 		window.addEventListener("scroll", handleScroll);
// 		return () => {
// 			window.removeEventListener("scroll", handleScroll);
// 		};
// 	}, [mode, bound_off]);

// 	return rotation;
// };
// const useRotation = (
// 	mode: TOptions = "full",
// 	scroll_fraction = 0.5,
// 	offset = -180,
// 	arc = 180
// ): number => {
// 	const [rotation, setRotation] = useState(0);
// 	const scrollEnd = window.innerHeight * scroll_fraction;
// 	const bounding_frac = useRef(scrollEnd);
// 	/* - Fixed:
// 	- upward never
// 	- downward before bound

// 	partial:
// 		- upward disabled never after exceeding bound
// 		- downward before bound

// 	full:
// 		- upward when in bounds
// 		- downward before bound
//   */

// 	useEffect(() => {
// 		const handleScroll = () => {
// 			setRotation((oldRotation) => {
// 				const old_scrollY = oldRotation;
// 				const current_scrollY = window.scrollY; //  / scrollEnd;

// 				let rotate = false;
// 				let output_scrollY = 0;
// 				let end = false;
// 				const bound =
// 					mode === "full"
// 						? window.innerHeight * scroll_fraction
// 						: current_scrollY;
// 				let isUpward = true;
// 				if (old_scrollY > current_scrollY) {
// 					console.log("up");
// 					isUpward = true;
// 					rotate = current_scrollY <= bound && mode !== "fixed";
// 					bounding_frac.current = bound;
// 				} else {
// 					isUpward = false;

// 					if (current_scrollY > bounding_frac.current) {
// 						rotate =
// 							bounding_frac.current <
// 							window.innerHeight * scroll_fraction;
// 						console.log("clipped down");
// 					}
// 					if (
// 						current_scrollY >
// 						window.innerHeight * scroll_fraction
// 					) {
// 						end = true;
// 						bounding_frac.current =
// 							mode !== "full"
// 								? window.innerHeight * scroll_fraction + 1
// 								: bound;
// 						console.log("end");

// 						// rotate = false;
// 						console.log("bound down");
// 					} else {
// 						rotate = true;
// 						console.log("rotate down");
// 					}
// 				}

// 				if (current_scrollY >= window.innerHeight * scroll_fraction) {
// 					end = true;
// 					console.log(end);
// 				}
// 				// if (mode==="fixed"||mode==="partial")
// 				if (end === true) {
// 					output_scrollY = window.innerHeight * scroll_fraction;
// 				} else {
// 					output_scrollY = rotate ? current_scrollY : old_scrollY;
// 				}
// 				console.log(rotate);

// 				return output_scrollY;
// 			});
// 			// setOffset(() => (mode === "fixed" ? currentScrollY : 0));
// 		};

// 		window.addEventListener("scroll", handleScroll);
// 		return () => {
// 			window.removeEventListener("scroll", handleScroll);
// 		};
// 	}, [mode, bounding_frac, offset, arc]);

// 	return rotation;
// };
// import React, { useEffect, useState, useRef } from "react";

// type TOptions = "fixed" | "partial" | "full";

// const useRotation = (mode: TOptions = "fixed"): number => {
// 	const [rotation, setRotation] = useState(-180);
// 	const [offSet, setOffset] = useState(0);
// 	// Use ref to track direction without causing re-renders
// 	const lastScrollY = useRef(0);

// 	useEffect(() => {
// 		const handleScroll = () => {
// 			const scrollEnd = window.innerHeight * 0.5;
// 			const currentScrollY = window.scrollY;
// 			const isScrollingDown = currentScrollY > lastScrollY.current;

// 			// --- Rotation Calculation ---
// 			// Calculate effective scroll based on current offset
// 			const effectiveScrollY = currentScrollY - offSet;

// 			// Clamped fraction of the scroll range (0 to 1)
// 			const scrollFraction = effectiveScrollY / scrollEnd;
// 			const clampedFraction = Math.min(scrollFraction, 1);

// 			// The position-based rotation (from -180 to 0)
// 			const positionRotation = -180 + clampedFraction * 180;

// 			lastScrollY.current = currentScrollY; // Update for next comparison

// 			setRotation((oldRotation) => {
// 				// 1. Full Mode: Freely follows scroll position
// 				if (mode === "full") {
// 					setOffset(0); // Ensure offset is zeroed out
// 					return positionRotation;
// 				}

// 				// 2. Lock Check: Once rotation is complete (0), freeze it there for ALL non-full modes
// 				if (oldRotation === 0) {
// 					setOffset(currentScrollY); // Lock offset at current scrollY
// 					return 0;
// 				}

// 				// 3. Main Logic (Fixed/Partial < 0)
// 				if (positionRotation > oldRotation) {
// 					// Scrolling DOWN or passed the current rotation point

// 					// Rotation should proceed
// 					setOffset(0); // Clear offset, the animation is now active
// 					return positionRotation;
// 				} else {
// 					// Scrolling UP or positionRotation is less than current (e.g. going up)

// 					if (mode === "fixed") {
// 						// Fixed: Freeze rotation, set offset
// 						setOffset(currentScrollY - effectiveScrollY);
// 						return oldRotation;
// 					}

// 					if (mode === "partial") {
// 						// Partial: Allows backward rotation until we are fully rotated.
// 						// (Only applied when positionRotation < oldRotation)
// 						setOffset(0); // Ensure offset is zeroed out
// 						return positionRotation;
// 					}
// 				}

// 				// Default fall-through (should be unreachable if logic is complete)
// 				return oldRotation;
// 			});
// 		};

// 		window.addEventListener("scroll", handleScroll);
// 		return () => {
// 			window.removeEventListener("scroll", handleScroll);
// 		};
// 	}, [mode, offSet]); // Add offSet dependency, though using the functional setter is better.

// 	return rotation;
// };
const RotatingSVGOnScroll = () => {
	const rotation = useRotation();
	const opacity = -rotation / 180;
	const opacity_prime = 1 - opacity;
	// console.log(opacity_prime);

	const rotatorStyle: React.CSSProperties = {
		position: "fixed",
		transform: `rotate(${rotation}deg)`,
		transformOrigin: "center center",
	};
	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				// top: "20px",
				// overflow: "visible",
				left: 0,
			}}
		>
			<div
				style={{
					// position: "sticky",

					// position: "fixed",
					width: "500px",
					height: "500px",
					// top: "20px",
					// overflow: "visible",
					left: 0,
				}}
			>
				<div
					style={{
						height: "200vh",
						maxWidth: "500px",
						// position: "fixed",

						// position: "absolute",
					}}
					className="no-aos"
				>
					<LogoHexagon
						svgStyle={{ ...rotatorStyle }}
						args={{ withGap: true }}
						opacity={opacity}
					/>

					<LogoHexagon
						svgStyle={{ ...rotatorStyle }}
						args={{ withGap: false }}
						opacity={opacity_prime}
					/>
				</div>
			</div>
		</div>
	);
};
const DemoPage = () => (
	<Page
		page={RotatingSVGOnScroll}
		bg={true}
	/>
);

export default DemoPage;
