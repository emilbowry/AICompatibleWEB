// src/features/footer/FooterLayoutHandler.tsx

import React from "react";
import { dark_midnight_green } from "../../utils/defaultColours";
import { FormatComponent, ValidComponent } from "../../utils/reactUtils";
import {
	footerContainerStyle,
	FooterLayoutWrapperStyle,
	FooterTopStyle,
	FooterWrapperStyle,
} from "./Footer.styles";

const FooterLayoutHandler: React.FC<{
	component: ValidComponent;
	StyleOverrides?: React.CSSProperties;
	overrideBackground?: boolean;
}> = ({ component, StyleOverrides = {}, overrideBackground = false }) => {
	return (
		<div
			style={{
				...FooterLayoutWrapperStyle,
				...(overrideBackground
					? { background: dark_midnight_green }
					: {}),
			}}
		>
			<div style={FooterTopStyle} />
			<div style={FooterWrapperStyle}>
				<div style={footerContainerStyle(StyleOverrides)}>
					<FormatComponent Component={component} />
				</div>
			</div>
		</div>
	);
};

export { FooterLayoutHandler };
