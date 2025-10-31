// src/components/titlebar/TitleBar.styles.ts
import React from "react";
import { VOLUME_CONSTANT_SIZE } from "../../styles";
import { VISIBLE_TITLEBAR_HEIGHT } from "./TitleBar.consts";
const HamburgerStyle: React.CSSProperties = {
	background: "none",
	border: "none",
	marginLeft: "1rem",
	color: "#333",
};

const InteractionWrapperStyles: React.CSSProperties = {
	width: "100%",
	position: "fixed",
	top: 0,
	zIndex: "100",
	fontSize: `min(calc(2*${VOLUME_CONSTANT_SIZE}),${VISIBLE_TITLEBAR_HEIGHT}vh*(0.4))`,
};
const titleBarStyles = (): React.CSSProperties => {
	return {
		display: "flex",
		alignContent: "center",
		alignItems: "center",
		height: `${VISIBLE_TITLEBAR_HEIGHT}vh`,
		minHeight: "1rem",
		backgroundColor: "rgb(255 255 255 / 90%)",
		justifyContent: "space-between",
	};
};
const LogoContainerStyles: React.CSSProperties = {
	flex: 1,
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
};
const LogoStyles: React.CSSProperties = {
	height: `${VISIBLE_TITLEBAR_HEIGHT / 2}vh`,
};
const NavLinksContainerStyles: React.CSSProperties = {
	flex: 2,
	display: "flex",
	gap: "2%",
	justifyContent: "space-evenly",
	textWrap: "nowrap",
	textAlign: "center",
};
const RightHandContainerStyles: React.CSSProperties = {
	flex: 1,
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
};
const DropdownStyles: React.CSSProperties = {
	left: "0",
	right: "0",
	margin: "0 auto",
	backgroundColor: "#fff",
	borderRadius: "8px",
	boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
	padding: "20px",
	marginTop: "20px",
	display: "flex",
	gap: "30px",
	width: "fit-content",
};
const DropdownContainerStyles: React.CSSProperties = {
	position: "relative",
	left: "0",
	right: "0",
	margin: "0 auto",
	top: `-${VISIBLE_TITLEBAR_HEIGHT}vh`,
	marginTop: `calc(${VISIBLE_TITLEBAR_HEIGHT}vh - 10px)`,
	backgroundColor: "transparent",
	paddingTop: "10px",
	width: "fit-content",
};
const DropdownLinksColumnStyles: React.CSSProperties = {
	display: "flex",
	flexDirection: "column",
	gap: "10px",
};
const DropdownLinkStyles: React.CSSProperties = {
	color: "#333",
	fontSize: "15px",
	padding: "5px 0",
	whiteSpace: "nowrap",
};
const DropdownImageContainerStyles: React.CSSProperties = {
	width: "200px",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-between",
};
const DropdownImageStyles: React.CSSProperties = {
	width: "99%",
	height: "120px",
	objectFit: "cover",
	borderRadius: "4px",
};
const DropdownImageViewOverviewStyles: React.CSSProperties = {
	marginTop: "10px",
	fontSize: "14px",
	display: "flex",
	alignItems: "center",
	gap: "5px",
};

const PillBarOverrides: React.CSSProperties = {
	borderRadius: "5vh",
	backgroundColor: "rgb(255 255 255 / 40%)",
	background: `linear-gradient(to right, rgb(255 222 89 / 10%), rgb(12 192 223 / 10%)),

		rgb(255 255 255 / 40%)`,
	backdropFilter: "blur(8px)",
	margin: "0 5%",
	marginTop: "3rem",
};
export {
	DropdownContainerStyles,
	DropdownImageContainerStyles,
	DropdownImageStyles,
	DropdownImageViewOverviewStyles,
	DropdownLinksColumnStyles,
	DropdownLinkStyles,
	DropdownStyles,
	HamburgerStyle,
	InteractionWrapperStyles,
	LogoContainerStyles,
	LogoStyles,
	NavLinksContainerStyles,
	PillBarOverrides,
	RightHandContainerStyles,
	titleBarStyles,
};
