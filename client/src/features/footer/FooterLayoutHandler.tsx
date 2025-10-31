// src/features/footer/FooterLayoutHandler.tsx

import React from "react";
import { formatComponent, ValidComponent } from "../../utils/reactUtils";
import {
	footerContainerStyle,
	FooterLayoutWrapperStyle,
	FooterTopStyle,
	FooterWrapperStyle,
} from "./Footer.styles";

const FooterLayoutHandler: React.FC<{
	component: ValidComponent;
	StyleOverrides?: React.CSSProperties;
}> = ({ component, StyleOverrides = {} }) => {
	return (
		<div style={FooterLayoutWrapperStyle}>
			<div style={FooterTopStyle} />
			<div style={FooterWrapperStyle}>
				<div style={footerContainerStyle(StyleOverrides)}>
					{formatComponent(component)}
				</div>
			</div>
		</div>
	);
};

export { FooterLayoutHandler };
