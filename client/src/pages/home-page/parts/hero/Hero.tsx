// src/pages/home-page/parts/hero/Hero.tsx

import React, { useEffect, useRef, useState } from "react";
import hi1 from "../../../../assets/heroimage1.jpg";
import hi2 from "../../../../assets/heroimage2.jpg";
import hi3 from "../../../../assets/heroimage3.jpg";
import { Hexagon } from "../../../../components/hexagons/Hexagons";
import { ImageHexagon } from "../../../../components/hexagons/ImageHexagon";
import { LogoHexagon } from "../../../../components/hexagons/LogoHexagon";
import { HexagonGrid } from "../../../../components/hexagons/hexagon-grid/honeycomb/HexagonRow";
import {
	light_mix_green,
	lighter_logo_blue,
	white,
} from "../../../../utils/defaultColours";

type TOptions = "full" | "partial" | "fixed";

interface IUserRotation {
	mode?: TOptions;
	startingAngle?: number;
	rotationRange?: number;
	isPositiveDirection?: boolean;
	scrollFraction?: number;
}
const useRotation = (params: IUserRotation): number => {
	const {
		mode = "fixed",
		startingAngle = -180,
		rotationRange = 360,
		isPositiveDirection = true,
		scrollFraction = 0.3,
	} = params;
	const rotationDir = 2 * +isPositiveDirection - 1;

	const boundAngle = startingAngle + rotationDir * rotationRange;

	const [angle, setAngle] = useState<number>(startingAngle);

	const isSaturated = useRef<boolean>(false);
	const scrollThreshold = window.innerHeight * scrollFraction;
	const scrollY = useRef(0);

	const theta_linear = (effective_scroll: number): number => {
		return (
			(effective_scroll / scrollThreshold) * rotationRange * rotationDir
		);
	};
	useEffect(() => {
		const handleScroll = () => {
			const previousScrollY = scrollY.current;

			scrollY.current = window.scrollY;

			setAngle((prevAngle) => {
				let angle = prevAngle;
				if (mode === "full") {
					angle = startingAngle + theta_linear(scrollY.current);
				} else if (mode === "partial") {
					angle = startingAngle + theta_linear(scrollY.current);
				} else if (
					mode === "fixed" &&
					scrollY.current >= previousScrollY
				) {
					/* aborbs `let angle = prevAngle` at case 0 so no offset needed*/
					angle =
						prevAngle +
						theta_linear(scrollY.current - previousScrollY);
				}
				if (
					(isPositiveDirection && angle > boundAngle) ||
					(!isPositiveDirection && angle < boundAngle) ||
					isSaturated.current
				) {
					angle = boundAngle;
					if (mode !== "full") isSaturated.current = true;
				}

				return angle;
			});
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [
		mode,
		startingAngle,
		theta_linear,
		boundAngle,
		scrollFraction,
		isPositiveDirection,
	]);

	return angle;
};

const RotatingLogo: React.FC<any> = ({ props }) => {
	const rotation = useRotation({ scrollFraction: 0.5, rotationRange: 180 });
	const opacity = -rotation / 180;
	const opacity_prime = 1 - opacity;
	// console.log(opacity_prime);

	const rotatorStyle: React.CSSProperties = {
		transform: `rotate(${rotation}deg)`,
		transformOrigin: "center center",
	};
	return (
		<div
			style={{ position: "relative", contain: "none" }}
			className="no-aos"
		>
			<div
				style={{
					// position: "fixed",
					position: "absolute",

					width: "100%",
					contain: "none",
				}}
				className="no-aos"
			>
				<LogoHexagon
					svgStyle={{
						...rotatorStyle,

						filter: ` drop-shadow(rgba(0, 0, 0, 0.2)  2px 2px 3px)  drop-shadow(rgba(255, 255, 255, 0.4)  3px 3px 3px)`,
						transition: "filter 0.1s linear",
					}}
					args={{ withGap: false }}
					opacity={opacity_prime * 2}
				/>
			</div>
			<div
				style={{
					contain: "none",
					position: "absolute",
					width: "100%",
				}}
				className="no-aos"
			>
				<LogoHexagon
					svgStyle={{
						...rotatorStyle,
						overflow: "visible",

						filter: `blur(${4 * opacity_prime}px)`,
					}}
					args={{ withGap: true }}
					opacity={opacity * opacity}
				/>
			</div>
		</div>
	);
};
const textEl = (
	<div
		style={{
			color: " #066070",
			textAlign: "center",
			fontSize: "1.3vw",
		}}
	>
		<div
			style={{
				fontStyle: "italic",
			}}
		>
			<div>
				“Not everyone needs to be an AI expert.
				<br />
				<br />
				But everyone needs to be AI compatible.”
			</div>
		</div>

		<div
			style={{
				fontWeight: "bold",
			}}
		>
			- Joe Fennell
		</div>
	</div>
);

const useScrollOpacity = () => {
	const [scrollFraction, setScrollFraction] = useState(1);
	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY / window.innerHeight;
			setScrollFraction(1 - scrollY);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return scrollFraction;
};
const Hero: React.FC = () => {
	const scrollFrac = useScrollOpacity();

	const firstRow = [
		null,
		<Hexagon
			args={{ colour: lighter_logo_blue }}
			opacity={0.6 * (1 - scrollFrac)}
			clsname="no-aos"
		/>,

		<ImageHexagon
			img={hi3}
			opacity={0.6 * (1 - scrollFrac)}
			clsname="no-aos"
		/>,
	] as const;
	const secondRow = [
		<ImageHexagon
			img={hi1}
			opacity={0.6 * (1 - scrollFrac)}
			clsname="no-aos"
		/>,
		<RotatingLogo />,
		<ImageHexagon
			img={hi2}
			opacity={0.6 * (1 - scrollFrac)}
			clsname="no-aos"
		/>,
	] as const;

	const thirdRow = [
		null,
		<Hexagon
			args={{ colour: light_mix_green }}
			element={textEl}
			useVerticalAlignment={true}
			opacity={0.6 * (1 - scrollFrac)}
			clsname="no-aos"
		/>,
		null,
	] as const;

	const r = [
		{ elements: firstRow },

		{ elements: secondRow },
		{ elements: thirdRow },
	];
	return (
		<div
			style={{
				position: "relative",
				height: "100%",
				// background: `rgb(0,0,0,${0.7 * scrollFrac})`,
				// backdropFilter: `blur(${16 * scrollFrac}px)`,
				// maskImage:
				// 	"linear-gradient(to bottom,rgb(0,0,0) 85%,   transparent 100%)",
			}}

			// className="no-aos"
		>
			<div
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					background: `rgb(0,0,0,${0.7 * scrollFrac})`,
					backdropFilter: `blur(${16 * scrollFrac}px)`,
					maskImage:
						"linear-gradient(to bottom,rgb(0,0,0) 85%,   transparent 100%)",
				}}
			/>
			<div
				style={{
					height: "110vh",
					margin: "auto",
					paddingTop: "40vh",
					position: "relative",

					// contain: "paint",
				}}
			>
				<div
					style={{
						height: "30vh",
					}}
				>
					<div
						style={{
							position: "absolute",
							textAlign: "center",
							margin: "auto",
							width: "100%",
						}}
					>
						<h1
							style={{
								color: white,
								fontWeight: "normal",
								fontSize: "3.5rem",
								// paddingBottom: "2vh",
							}}
						>
							AI Compatible
						</h1>
					</div>
				</div>
				<div
					style={{
						bottom: "-30%",
						position: "sticky",
						minHeight: "100vh",
						marginTop: "-10vh",
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr minmax(auto, 1000px) 1fr",
							marginBottom: "5%",

							padding: "auto",
							contain: "paint",

							position: "relative",
						}}
					>
						<div />
						<HexagonGrid
							rows={r}
							relative_spacing={10}
						/>
						<div />
					</div>
				</div>
			</div>
		</div>
	);
};
export { Hero };
