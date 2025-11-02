// client/src/features/outreach-form/OutReachForm.styles.ts

import React from "react";

/**
 * @improvement * need better styling

 */

const InputBaseStyle: React.CSSProperties = {
	width: "100%",
	padding: "1rem",
	fontSize: "2rem",
	border: "1px solid #ccd0d5",
	borderRadius: "1%",
	boxSizing: "border-box",
	transition: "border-color 0.2s, box-shadow 0.2s",
	fontFamily: "inherit",
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
	accentColor: "#007bff",
};

const LabelStyle: React.CSSProperties = {
	display: "block",
	marginBottom: "2%",
	fontWeight: 500,
};

const FormGroupStyle: React.CSSProperties = {
	marginBottom: "2%",
};
const DescriptionStyle = {
	color: "#606770",
};
const FormContainerStyle: React.CSSProperties = {
	backgroundColor: "rgb(255 255 255 / 40%)",
	background: `linear-gradient(to bottom, rgb(255 222 89 / 20%), rgb(12 192 223 / 20%)),
		rgb(255 255 255 / 30%)`,
	padding: "2%",
	borderRadius: "2%",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
	maxHeight: "90vh",

	overflowY: "scroll",
};
const TitleStyle: React.CSSProperties = {
	marginBottom: "5%",
	fontSize: "3rem",
	fontWeight: 600,
	textAlign: "center",
};

const SubmitContainerStyle: React.CSSProperties = {
	display: "flex",
	justifyContent: "space-between",
};

const ErrMessageStyle: React.CSSProperties = {
	backgroundColor: "rgb(255,0,0,0.2)",
	padding: "2%",
	marginBottom: "2%",
};
export {
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
