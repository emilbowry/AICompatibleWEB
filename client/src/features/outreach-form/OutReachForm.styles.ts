// client/src/features/outreach-form/OutReachForm.styles.ts

import React from "react";
import { getTheme, VOLUME_CONSTANT_SIZE } from "../../styles";

/**
 * @improvement * need better styling

 */
const theme = getTheme(0);
const InputBaseStyle: React.CSSProperties = {
	// width: "calc(100% - 3px)",
	padding: "2%",
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
	border: "1px solid #ccd0d5",
	// borderRadius: "1%",
	// boxSizing: "border-box",
	// transition: "border-color 0.2s, box-shadow 0.2s",
	// flexGrow: 1, // Allows the input to consume available space
	width: "90%", // Explicitly tell it to fill the available space
};

const OptionalInputStyle = { ...InputBaseStyle };
const TextAreaStyle: React.CSSProperties = {
	...InputBaseStyle,
	minHeight: "120px",
	resize: "vertical",
};

const CheckboxInputStyle: React.CSSProperties = {
	height: "100%",
	aspectRatio: 1,
	zoom: 2,
	// accentColor: "#007bff",
};

const LabelStyle: React.CSSProperties = {
	display: "block",
	marginBottom: "2%",
	fontWeight: 500,
	color: theme.secondaryColor,
	width: "90%",
};

const FormGroupStyle: React.CSSProperties = {
	marginBottom: "2%",
};
const DescriptionStyle = {
	// color: "#606770",
};
const FormContainerStyle: React.CSSProperties = {
	padding: "2%",
	// width: "90%",

	maxHeight: "90vh",
	color: theme.primaryColor,
	overflowY: "scroll",
	scrollbarGutter: "stable",

	// minWidth: "400px",
	// width: "fit-content",÷
	// display: "flex",
	// flexDirection: "column",
	// flexGrow: 1,
};
const TitleStyle: React.CSSProperties = {
	marginBottom: "5%",
	fontSize: "3rem",
	fontWeight: 600,
	textAlign: "center",
};

const SubmitContainerStyle: React.CSSProperties = {
	// display: "flex",
	display: "flex",
	flexDirection: "row",
	flexGrow: 1,
	maxWidth: "100%",
	justifyContent: "space-between",
	// justifyContent: "space-evenly",
	// gap: "5%",
};

const ErrMessageStyle: React.CSSProperties = {
	backgroundColor: "rgb(255,0,0,0.2)",
	padding: "2%",
	marginBottom: "2%",
};

const ButtonStyle: React.CSSProperties = {
	height: "5vh",
	borderRadius: "5%",
	backgroundColor: "transparent",
	padding: "0 3%",
	margin: "0 2px",
	textWrap: "nowrap",
};
export {
	ButtonStyle,
	CheckboxInputStyle,
	DescriptionStyle,
	ErrMessageStyle,
	FormContainerStyle,
	FormGroupStyle,
	InputBaseStyle,
	LabelStyle,
	OptionalInputStyle,
	SubmitContainerStyle,
	TextAreaStyle,
	TitleStyle,
};
