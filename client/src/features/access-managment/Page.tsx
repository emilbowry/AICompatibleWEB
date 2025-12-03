// src/features/page/page.tsx

import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { CursorContext } from "../../components/cursor/Cursor";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";
import { Footer } from "../footer/Footer";
import { MainStyle, PageStyle } from "../page/Page.styles";
import { PillTitleBar, ExpandableTitleBar } from "../titlebar/TitleBar";
import { VISIBLE_TITLEBAR_HEIGHT } from "../titlebar/TitleBar.consts";
import { useAccessRoutes, useRoles } from "./router";

const Page: React.FC<{
	page: React.FC;
	bg?: boolean;
	useAltTitleBar?: boolean;
	useCursor?: boolean;
}> = ({ page: Page, bg = true, useCursor = true, useAltTitleBar = false }) => {
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
			{useAltTitleBar ? (
				<ExpandableTitleBar
					logo_src={logo}
					Links={routes}
				/>
			) : (
				<PillTitleBar
					logo_src={logo}
					Links={routes}
				/>
			)}
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

			<Footer overrideBackground={!bg} />
		</>
	);
};
export { Page };
