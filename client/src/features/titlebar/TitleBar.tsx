// src/features/titlebar/Bars.tsx

import React from "react";

import { ITitleBarProps } from "./TitleBar.types";

import { titleBarStyles } from "./TitleBar.styles";
import { usePillBarStyle } from "./TitleBarHelpers";
import { Dropdown, TitleBarUI } from "./TitleBarUI";
const TitleBar: React.FC<ITitleBarProps> = (props) => (
	<TitleBarUI
		{...props}
		styleFunction={props.styleFunction || titleBarStyles}
	>
		{props.children}
	</TitleBarUI>
);

const ExpandableTitleBar: React.FC<ITitleBarProps> = (props) => (
	<TitleBar {...props}>
		<Dropdown {...props} />
	</TitleBar>
);
const PillTitleBar: React.FC<ITitleBarProps> = (props) => (
	<ExpandableTitleBar
		{...props}
		styleFunction={usePillBarStyle}
	/>
);

export { PillTitleBar, ExpandableTitleBar };
