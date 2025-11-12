import { useContext, useEffect, useState } from "react";
import { HexagonGrid } from "../../../components/hexagons/hexagon-grid/honeycomb/HexagonRow";
import { Hexagon } from "../../../components/hexagons/Hexagons";
import { ImageHexagon } from "../../../components/hexagons/ImageHexagon";
import {
	light_mix_green,
	lighter_logo_blue,
	white,
} from "../../../utils/defaultColours";
import { RouteContext } from "../router";
import { RotatingLogo } from "./rotating_logo";

import hi1 from "../../../assets/heroimage1.jpg";
import hi2 from "../../../assets/heroimage2.jpg";
import hi3 from "../../../assets/heroimage3.jpg";
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
	const { hasLoaded } = useContext(RouteContext);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = hasLoaded ? 1 : window.scrollY / window.innerHeight;
			setScrollFraction(1 - scrollY);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [hasLoaded]);
	return scrollFraction;
};
const Hero: React.FC<{ observerRef?: React.RefObject<HTMLDivElement> }> = ({
	observerRef,
}) => {
	const { hasLoaded } = useContext(RouteContext);

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
			ref={observerRef}
			style={{
				position: "relative",
				height: "100%",
			}}
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
					height: "100vh",
					margin: "auto",
					paddingTop: `40vh`,
					position: "relative",
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
							}}
						>
							{!hasLoaded && "AI Compatible"}
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
