// client/src/features/outreach-form/OutReachForm.styles.ts

import React from "react";
import { getTheme, VOLUME_CONSTANT_SIZE } from "../../styles";

/**
 * @improvement * need better styling

 */
const theme = getTheme(0);
const InputBaseStyle: React.CSSProperties = {
	padding: "2%",
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
	border: "1px solid #ccd0d5",

	width: "90%",
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
const DescriptionStyle = {};
const FormContainerStyle: React.CSSProperties = {
	padding: "2%",

	maxHeight: "90vh",
	color: theme.primaryColor,
	overflowY: "scroll",
	scrollbarGutter: "stable",
};
const TitleStyle: React.CSSProperties = {
	marginBottom: "5%",
	fontSize: "3rem",
	fontWeight: 600,
	textAlign: "center",
};

const SubmitContainerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "row",
	flexGrow: 1,
	maxWidth: "100%",
	justifyContent: "space-between",
};

const ErrMessageStyle: React.CSSProperties = {
	backgroundColor: "rgb(255,0,0,0.2)",
	padding: "2%",
	marginBottom: "2%",
};

const ButtonStyle: React.CSSProperties = {
	height: "5vh",
	borderRadius: "5%",
	border: "1px solid rgb(255,255,255,0.4)",
	backgroundColor: "rgb(255,255,255,0.3)",

	padding: "0 3%",
	margin: "0 2px",
	boxShadow: "none",
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
