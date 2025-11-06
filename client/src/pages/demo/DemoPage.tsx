// import React, { useEffect, useRef, useState } from "react";
// import { LogoHexagon } from "../../components/hexagons/LogoHexagon";
// import { Page } from "../../features/page/Page";
// const demoPage: React.FC = () => {
// 	return <div></div>;
// };

// type TOptions = "full" | "partial" | "fixed";

// // const u

// // const useRotation = (
// // 	mode: TOptions = "fixed",
// // 	_omega = 180,
// // 	scroll_fraction = 0.5,
// // 	_theta = -180
// // ): number => {
// // 	const [effectiveScroll, setEffectiveScroll] = useState(0);
// // 	// const [offset, setOffset] = useState(0);
// // 	const theta = useRef(_theta);
// // 	const delta = useRef(0);

// // 	const omega = useRef(_omega / window.innerHeight);
// // 	const currentScrollY = useRef(0);
// // 	const increasing = useRef(true);
// // 	useEffect(() => {
// // 		const handleScroll = () => {
// // 			const previousScroll = currentScrollY.current;
// // 			currentScrollY.current = window.scrollY;

// // 			setEffectiveScroll((previousEffScroll) => {

// // 				if (previousScroll> currentScrollY.current ) {
// // 					delta.current =currentScrollY.current-previousScroll
// // 					increasing.current = false;
// // 				} else {
// // 					increasing.current = true;

// // 				}
// // 			});
// // 		};

// // 		window.addEventListener("scroll", handleScroll);
// // 		return () => {
// // 			window.removeEventListener("scroll", handleScroll);
// // 		};
// // 	}, [mode, omega, scroll_fraction]);

// // 	return effectiveScroll + theta.current;
// // };
// interface IUserRotation {
// 	mode?: TOptions;
// 	startingAngle?: number;
// 	rotationRange?: number;
// 	isPositiveDirection?: boolean;
// 	scrollFraction?: number;
// }
// const useRotation = (params: IUserRotation): number => {
// 	const {
// 		mode = "fixed",
// 		startingAngle = -180,
// 		rotationRange = 360,
// 		isPositiveDirection = true,
// 		scrollFraction = 0.3,
// 	} = params;
// 	const rotationDir = 2 * +isPositiveDirection - 1;

// 	const boundAngle = startingAngle + rotationDir * rotationRange;

// 	const [angle, setAngle] = useState<number>(startingAngle);

// 	const isSaturated = useRef<boolean>(false);
// 	const scrollThreshold = window.innerHeight * scrollFraction;
// 	const scrollY = useRef(0);

// 	const theta_linear = (effective_scroll: number): number => {
// 		return (
// 			(effective_scroll / scrollThreshold) * rotationRange * rotationDir
// 		);
// 	};
// 	useEffect(() => {
// 		const handleScroll = () => {
// 			const previousScrollY = scrollY.current;

// 			scrollY.current = window.scrollY;

// 			setAngle((prevAngle) => {
// 				let angle = prevAngle;
// 				if (mode === "full") {
// 					angle = startingAngle + theta_linear(scrollY.current);
// 				} /*  else if (isSaturated.current) {
// 					angle = boundAngle;
// 				}  */ else if (mode === "partial") {
// 					angle = startingAngle + theta_linear(scrollY.current);
// 				} else if (
// 					mode === "fixed" &&
// 					scrollY.current >= previousScrollY
// 				) {
// 					/* aborbs `let angle = prevAngle` at case 0 so no offset needed*/
// 					angle =
// 						prevAngle +
// 						theta_linear(scrollY.current - previousScrollY);
// 				}
// 				if (
// 					(isPositiveDirection && angle > boundAngle) ||
// 					(!isPositiveDirection && angle < boundAngle) ||
// 					isSaturated.current
// 				) {
// 					angle = boundAngle;
// 					if (mode !== "full") isSaturated.current = true;
// 				}

// 				return angle;
// 			});
// 		};
// 		window.addEventListener("scroll", handleScroll, { passive: true });
// 		return () => {
// 			window.removeEventListener("scroll", handleScroll);
// 		};
// 	}, [mode, startingAngle, theta_linear, boundAngle, scrollFraction]);

// 	return angle;
// };

// const RotatingLogo: React.FC<any> = ({ props }) => {
// 	const rotation = useRotation({ scrollFraction: 0.5, rotationRange: 180 });
// 	const opacity = -rotation / 180;
// 	const opacity_prime = 1 - opacity;
// 	// console.log(opacity_prime);

// 	const rotatorStyle: React.CSSProperties = {
// 		transform: `rotate(${rotation}deg)`,
// 		transformOrigin: "center center",
// 	};
// 	return (
// 		<div
// 			style={{ position: "relative", overflow: "visible" }}
// 			// className="no-aos"

// 			className="aos-ignore"
// 		>
// 			<div
// 				style={{
// 					position: "fixed",
// 					width: "100%",
// 					overflow: "visible",
// 				}}
// 				className="no-aos"
// 			>
// 				<LogoHexagon
// 					svgStyle={{ ...rotatorStyle, overflow: "visible" }}
// 					args={{ withGap: true }}
// 					opacity={opacity}
// 				/>
// 			</div>
// 			<div
// 				style={{
// 					position: "fixed",
// 					width: "100%",
// 					overflow: "visible",
// 				}}
// 				className="no-aos"
// 			>
// 				<LogoHexagon
// 					svgStyle={{
// 						...rotatorStyle,

// 						filter: "drop-shadow(rgba(0, 0, 0, 0.2)  2px 2px 3px)  drop-shadow(rgba(255, 255, 255, 0.4)  3px 3px 3px)",
// 						overflow: "visible",
// 					}}
// 					args={{ withGap: false }}
// 					opacity={opacity_prime}
// 					// {...props}
// 					// filter="drop-shadow(rgba(0, 0, 0, 0.2)  2px 2px 3px)  drop-shadow(rgba(255, 255, 255, 0.4)  3px 3px 3px)"
// 				/>
// 			</div>
// 		</div>
// 	);
// };
// const RotatingSVGOnScroll = () => {
// 	const rotation = useRotation({});
// 	const opacity = -rotation / 180;
// 	const opacity_prime = 1 - opacity;
// 	// console.log(opacity_prime);

// 	const rotatorStyle: React.CSSProperties = {
// 		position: "fixed",
// 		transform: `rotate(${rotation}deg)`,
// 		transformOrigin: "center center",
// 	};
// 	return (
// 		<div
// 			style={{
// 				width: "100vw",
// 				height: "100vh",
// 				// top: "20px",
// 				overflowX: "hidden",
// 				left: 0,
// 			}}
// 		>
// 			<div style={{ height: "25vh" }}></div>
// 			<div
// 				style={{
// 					// position: "sticky",

// 					// position: "fixed",
// 					width: "500px",
// 					height: "500px",
// 					// top: "20px",
// 					// overflow: "visible",
// 					left: 0,
// 				}}
// 			>
// 				<div
// 					style={{
// 						height: "200vh",
// 						maxWidth: "500px",
// 						// position: "fixed",

// 						// position: "absolute",
// 					}}
// 					className="no-aos"
// 				>
// 					<LogoHexagon
// 						svgStyle={{ ...rotatorStyle }}
// 						args={{ withGap: true }}
// 						opacity={opacity}
// 					/>

// 					<LogoHexagon
// 						svgStyle={{ ...rotatorStyle }}
// 						args={{ withGap: false }}
// 						opacity={opacity_prime}
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// // export { RotatingLogo };
// const DemoPage = () => (
// 	<Page
// 		page={RotatingSVGOnScroll}
// 		bg={true}
// 	/>
// );

// export default DemoPage;
