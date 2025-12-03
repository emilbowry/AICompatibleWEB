// client/src/features/access-managment/router.tsx
import React, { useContext, useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useRoles } from "../../services/api/auth/auth";
import { BackgroundStyle } from "../../styles";
import { IRoutes } from "./accessmanagent.types";
import { AdminRoutes, default_routes, TestSideBar } from "./default_routes";

import { createContext, useState } from "react";

import { useScrollToTop } from "../../hooks/ScrollToTop";
import { Page } from "./Page";
import { Hero } from "./hero/hero";

/** 
 * @improvements

	*  Need to make bg conditional like page, perhaps use diff router for non, layout bg
	*  Some pages only want hero on reload, and not permenant. Currently only / has it permant in "/"
	*  Make Hero's title disappear, and opacity stick at max after scroll event
	

 */
const AllRoutes: Record<string, [IRoutes[][], IRoutes[]]> = {
	DEFAULT: default_routes,
	USER: TestSideBar,
	ADMIN: AdminRoutes,
};

const always_shown = ["/"];
const Layout: React.FC<{
	hasBackground?: boolean;
	retainHero?: boolean;
	useCursor?: boolean;
}> = ({ hasBackground = true, useCursor = true }) => {
	const { hasLoaded, setHasLoaded } = useContext(RouteContext);
	const current_page = useLocation();

	const withHero = always_shown.includes(current_page.pathname);
	useEffect(() => {
		const handleScroll = () => {
			setHasLoaded((prevloaded) =>
				prevloaded === false && window.scrollY >= window.innerHeight
					? true
					: prevloaded
			);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [setHasLoaded]);
	useScrollToTop(0);

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
									useAltTitleBar={item.altTitleBar}
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
export { DRouter, RouteContext, useAccessRoutes, useRoles };
