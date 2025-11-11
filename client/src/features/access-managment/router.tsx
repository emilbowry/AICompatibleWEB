// client/src/features/access-managment/router.tsx
import React, { useContext, useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useRoles } from "../../services/api/auth/auth";
import { BackgroundStyle } from "../../styles";
import { IRoutes } from "./accessmanagent.types";
import { AdminRoutes, default_routes, TestSideBar } from "./default_routes";

import { createContext, useRef, useState } from "react";
import hi1 from "../../assets/heroimage1.jpg";
import hi2 from "../../assets/heroimage2.jpg";
import hi3 from "../../assets/heroimage3.jpg";
import { Hexagon } from "../../components/hexagons/Hexagons";
import { ImageHexagon } from "../../components/hexagons/ImageHexagon";
import { LogoHexagon } from "../../components/hexagons/LogoHexagon";
import { HexagonGrid } from "../../components/hexagons/hexagon-grid/honeycomb/HexagonRow";
import {
	light_mix_green,
	lighter_logo_blue,
	white,
} from "../../utils/defaultColours";

import { Footer } from "../footer/Footer";

import logo from "../../assets/logo.png";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";

import { CursorContext } from "../../components/cursor/Cursor";

import { useScrollToTop } from "../../hooks/ScrollToTop";
import { MainStyle, PageStyle } from "../page/Page.styles";
import { PillTitleBar } from "../titlebar/TitleBar";
import { VISIBLE_TITLEBAR_HEIGHT } from "../titlebar/TitleBar.consts";
const AllRoutes: Record<string, [IRoutes[][], IRoutes[]]> = {
	DEFAULT: default_routes,
	USER: TestSideBar,
	ADMIN: AdminRoutes,
};

const Page: React.FC<{
	page: React.FC;
	bg?: boolean;
	useCursor?: boolean;
}> = ({ page: Page, bg = true, useCursor = true }) => {
	const { setHasCustomCursor } = useContext(CursorContext);
	useEffect(() => {
		setHasCustomCursor(useCursor);
	}, [setHasCustomCursor, useCursor]);
	const isNarrow = useNarrowLayout();
	const location = useLocation().pathname;
	const roles = useRoles();
	const routes = useAccessRoutes(roles);
	return (
		<>
			{/* {bg ? <div style={BackgroundStyle}></div> : null} */}

			<PillTitleBar
				logo_src={logo}
				Links={routes}
			/>
			<main
				key={location}
				style={{
					...MainStyle,
				}}
			>
				<section
					className="aos-ignore"
					style={{
						position: "absolute",
						...PageStyle,
						marginTop: `${VISIBLE_TITLEBAR_HEIGHT}vh`,
						fontSize: isNarrow
							? "calc(1.6rem*calc(1vw/1vh))"
							: "2rem",
						maxWidth: "100vw",
					}}
				>
					<Page />
				</section>
			</main>

			{/* {bg ? <Footer /> : null} */}
			<Footer overrideBackground={!bg} />
		</>
	);
};

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
	const { hasLoaded, setHasLoaded } = useContext(RouteContext);
	useEffect(() => {
		const handleScroll = () => {
			console.log(hasLoaded === true);

			hasLoaded === false && window.scrollY >= window.innerHeight
				? setHasLoaded(true)
				: null;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	});
	// console.log(opacity_prime);

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
const Hero: React.FC = () => {
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

/**
 * @improvements

	*  Need to make bg conditional like page, perhaps use diff router for non, layout bg
	*  Some pages only want hero on reload, and not permenant. Currently only / has it permant in "/"
	*  Make Hero's title disappear, and opacity stick at max after scroll event
	

 */

const always_shown = ["/"];
const Layout: React.FC<{
	hasBackground?: boolean;
	retainHero?: boolean;
	useCursor?: boolean;
}> = ({ hasBackground = true, useCursor = true }) => {
	const { hasLoaded } = useContext(RouteContext);
	const current_page = useLocation();

	const withHero = always_shown.includes(current_page.pathname);

	useScrollToTop(hasLoaded && withHero ? 1 : 0);

	const pageReady = true;

	const showHero = withHero || !hasLoaded;

	return (
		<>
			{!hasLoaded || hasBackground ? (
				<div style={BackgroundStyle}></div>
			) : null}
			{showHero && <Hero />}

			{(hasLoaded || pageReady) && (
				<Page
					page={Outlet}
					useCursor={useCursor}
					bg={hasBackground}
				/>
			)}
		</>
	);
};

const useAccessRoutes = (role: string[]) =>
	role.includes("ADMIN")
		? AdminRoutes
		: role.includes("USER")
		? TestSideBar
		: AllRoutes["DEFAULT"];

interface IRcontext {
	hasLoaded: boolean;
	setHasLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}
const RouteContext = createContext({
	hasLoaded: false,
	setHasLoaded: () => {},
} as IRcontext);

const DRouter: React.FC = () => {
	const role = useRoles();
	const _routes = useAccessRoutes(role);
	const FlatRoutes = _routes.flat(2);
	const LayoutRoutes = _routes[0].map((routes) => routes[0]);
	const [hasLoaded, setHasLoaded] = useState(() => false);

	return (
		<RouteContext value={{ hasLoaded, setHasLoaded }}>
			<Routes>
				<Route
					path="/"
					element={<Layout hasBackground={true} />}
				>
					{LayoutRoutes.map((link, i) => {
						const item = link;
						const Comp = item.component;
						return (
							<Route
								path={item.path}
								element={<Comp />}
								key={i}
							/>
						);
					})}
				</Route>
				{/* Links where backgroud isnt implied */}
				{FlatRoutes.map((link, i) => {
					const item = link;
					const Comp = item.component;
					return LayoutRoutes.includes(link) ? null : (
						<Route
							path={item.path}
							element={
								<Page
									page={Comp}
									useCursor={false}
									bg={false}
								/>
							}
							key={i}
						/>
					);
				})}
			</Routes>
		</RouteContext>
	);
};
export { DRouter, useAccessRoutes, useRoles };
