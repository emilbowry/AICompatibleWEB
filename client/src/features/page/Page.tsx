// src/features/page/page.tsx

import React, { useContext, useEffect } from "react";
import { Footer } from "../footer/Footer";

import logo from "../../assets/logo.png";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";
import { BackgroundStyle } from "../../styles";

import { useLocation } from "react-router-dom";
import { CursorContext } from "../../components/cursor/Cursor";
import { useRoles } from "../../services/api/auth/auth";
import { useAccessRoutes } from "../access-managment/router";

import { PillTitleBar } from "../titlebar/TitleBar";
import { VISIBLE_TITLEBAR_HEIGHT } from "../titlebar/TitleBar.consts";
import { MainStyle, PageStyle } from "./Page.styles";

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
			{bg ? <div style={BackgroundStyle}></div> : null}

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
						// overflowX: "clip !important",
					}}
				>
					<Page />
				</section>
			</main>

			{bg ? <Footer /> : null}
		</>
	);
};

export { Page };
