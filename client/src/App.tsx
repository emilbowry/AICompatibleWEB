// src/App.tsx
import React, { Suspense, useState } from "react";

import { useLocation } from "react-router-dom";
import logo from "./assets/logoshape.svg";
import { useAnimationTagging } from "./hooks/AnimationTagging";
import "./styles.css";

import { CursorContext, CustomCursor } from "./components/cursor/Cursor";
import { useScrollToTop } from "./hooks/ScrollToTop";
import { useAuthInit } from "./services/api/auth/auth";
import { dark_midnight_green, lighter_logo_blue } from "./utils/defaultColours";

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
			<img
				src={logo}
				style={{ width: "200px" }}
			/>
		</div>
	</>
);

import { DRouter } from "./features/access-managment/router";
import { useAdmin } from "./services/api/util/admin";
const App: React.FC = () => {
	const [hasCustomCursor, setHasCustomCursor] = useState(true);
	const [global_position, setGlobalMousePosition] = useState({
		x: 0,
		y: 0,
	}); /* to track between navlinks */
	const location = useLocation();
	const [loc, setLoc] = useState(location);
	useAnimationTagging();
	useScrollToTop();
	useAuthInit();
	useAdmin();
	// console.log();
	return (
		<>
			{/* <ApiStatusChecker /> */}

			<Suspense fallback={<LoadingFC />}>
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
					<DRouter />
				</CursorContext>
			</Suspense>
		</>
	);
};

export default App;
