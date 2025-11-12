import { useContext, useEffect, useRef, useState } from "react";
import { LogoHexagon } from "../../../components/hexagons/LogoHexagon";
import { RouteContext } from "../router";
import { IUserRotation } from "./hero.types";

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
	const { hasLoaded } = useContext(RouteContext);

	const rotatorStyle: React.CSSProperties = {
		transform: `rotate(${rotation}deg)`,
		transformOrigin: "center center",
	};

	const opacity = hasLoaded ? 0 : -rotation / 180;
	const opacity_prime = hasLoaded ? 1 : 1 - opacity;
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
export { RotatingLogo };
