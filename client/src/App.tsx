// src/App.tsx
import React, { lazy, Suspense, useEffect, useState } from "react";

import { Route, Routes, useLocation } from "react-router-dom";
import logo from "./assets/logoshape.svg";
import { useAnimationTagging } from "./hooks/AnimationTagging";
import "./styles.css";

const ContactPage = lazy(() => import("./pages/contact-page/ContactPage"));
const ToolPage = lazy(() => import("./pages/dpo-tool/tool"));
const HomePage = lazy(() => import("./pages/home-page/HomePage"));
const OurServices = lazy(() => import("./pages/our-services-page/OurServices"));
const TheJourneyPage = lazy(
	() => import("./pages/the-journey-page/TheJourney")
);
const DemoPage = lazy(() => import("./pages/demo/DemoPage"));

import { CursorContext, CustomCursor } from "./components/cursor/Cursor";
import { useScrollToTop } from "./hooks/ScrollToTop";
import { dark_midnight_green, lighter_logo_blue } from "./utils/defaultColours";

const ApiStatusChecker: React.FC = () => {
	const [status, setStatus] = useState("Checking backend connection...");
	const [color, setColor] = useState(dark_midnight_green);

	useEffect(() => {
		fetch("/api/status")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setStatus(
					`Backend Status: ${data.message} (${data.timestamp})`
				);
				setColor(lighter_logo_blue); // Success color
			})
			.catch((error) => {
				console.error("Connection Error:", error);
				setStatus(
					`Backend Error: Could not connect or invalid response.`
				);
				setColor("red"); // Error color
			});
	}, []);

	const style: React.CSSProperties = {
		position: "fixed",
		top: "10vh",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "10px 20px",
		background: color,
		color: "white",
		borderRadius: "5px",
		zIndex: 1000,
		textAlign: "center",
		fontWeight: "bold",
		fontSize: "1.2rem",
	};

	return (
		<div
			style={style}
			className="no-aos"
		>
			{status}
		</div>
	);
};

const LoadingFC = () => (
	<>
		<div
			style={{
				height: "100vh",
				width: "100vw",
				padding: "5%",
				color: lighter_logo_blue,
				background: dark_midnight_green,
			}}
		>
			<img src={logo} />
		</div>
	</>
);

const App: React.FC = () => {
	const [hasCustomCursor, setHasCustomCursor] = useState(true);
	const [global_position, setGlobalMousePosition] = useState({ x: 0, y: 0 }); // to track between navlinks
	const location = useLocation();
	const [loc, setLoc] = useState(location);
	useAnimationTagging();
	useScrollToTop();
	return (
		<>
			{/* <ApiStatusChecker /> */}
			<Suspense fallback={<LoadingFC />}>
				{/* <AuthProvider> */}
				<CursorContext
					value={{
						hasCustomCursor,
						setHasCustomCursor,
						global_position,
						setGlobalMousePosition,
						loc,
						setLoc,
					}}
				>
					<CustomCursor />
					<Routes>
						<Route
							path="/"
							element={<HomePage />}
						/>
						<Route
							path="/thejourney"
							element={<TheJourneyPage />}
						/>
						<Route
							path="/ourservices"
							element={<OurServices />}
						/>
						<Route
							path="/contact"
							element={<ContactPage />}
						/>
						<Route
							path="/dpotool"
							element={<ToolPage />}
						/>
						<Route
							path="/demo_and_testing"
							element={<DemoPage />}
						/>
					</Routes>
				</CursorContext>
				{/* </AuthProvider> */}
			</Suspense>
		</>
	);
};

export default App;
