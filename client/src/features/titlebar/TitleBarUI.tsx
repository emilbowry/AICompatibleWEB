// src/features/titlebar/TitleBarUI.tsx

import React, { createContext, useContext, useMemo, useState } from "react";
import {
	DropdownContainerStyles,
	InteractionWrapperStyles,
} from "./TitleBar.styles";
import {
	ITitleBarLink,
	ITitleBarProps,
	ITitleBarUIState,
} from "./TitleBar.types";
import {
	DropDownOuter,
	formatLabel,
	TitleBarLogo,
	TitleBarMenu,
	TitleBarUILinks,
} from "./TitleBarHelpers";
const UICTX = createContext<ITitleBarUIState | undefined>(undefined);
const useCurrentActiveLinkAlias = (Links: ITitleBarLink[][]) => {
	return useMemo(() => {
		for (const LinkGroup of Links) {
			for (const sub_link of LinkGroup) {
				if (sub_link.path === window.location.pathname) {
					return formatLabel(LinkGroup[0].path, LinkGroup[0].alias);
				}
			}
		}
		return formatLabel(Links[0][0].path, Links[0][0].alias);
	}, [location.pathname, Links]);
};
const useUIState = (Links: ITitleBarLink[][]) => {
	const initial_active_alias = useCurrentActiveLinkAlias(Links);
	const [active_link_alias, setActiveLinkAlias] =
		useState(initial_active_alias);
	const [isOverLink, setIsOverLink] = useState(false);
	const [isActive, setIsActive] = useState(false);

	return {
		initial_active_alias,
		active_link_alias,
		setActiveLinkAlias,
		isOverLink,
		setIsOverLink,
		isActive,
		setIsActive,
	};
};
const useActiveTitleLink = () => {
	const ctx = useContext(UICTX);
	return {
		onLinkOver: ctx
			? (alias: string) => {
					ctx.setIsOverLink(true);
					ctx.setActiveLinkAlias(alias);
			  }
			: () => {},
		onWrapperMouseLeave: ctx
			? () => {
					ctx.setIsActive(false);

					ctx.setIsOverLink(false);
					ctx.setActiveLinkAlias(ctx.initial_active_alias);
			  }
			: () => {},
	};
};
const useActiveDropdownLink = () => {
	const ctx = useContext(UICTX);

	return { onMouseEnter: ctx ? () => ctx.setIsActive(true) : () => {} };
};
const useDropDownInteractions = (Links: ITitleBarLink[][]) => {
	const ctx = useContext(UICTX);
	if (ctx) {
		const { active_link_alias, isOverLink, isActive } = ctx;

		const ActiveLinkGroup = useMemo(
			() =>
				Links.find((LinkGroup) => {
					const main_link = LinkGroup[0];
					return (
						main_link &&
						formatLabel(main_link.path, main_link.alias) ===
							active_link_alias
					);
				}),
			[Links, active_link_alias]
		);
		const showDropdown = !!(
			(isOverLink || isActive) &&
			ActiveLinkGroup &&
			(ActiveLinkGroup.length > 1 || ActiveLinkGroup[0].image)
		);
		return {
			ActiveLinkGroup,
			showDropdown,
		};
	} else {
		return { ActiveLinkGroup: undefined, showDropdown: false };
	}
};
const TitleBarUI: React.FC<ITitleBarProps> = (props) => (
	<UICTX value={useUIState(props.Links)}>
		<InnerTitleBarUI {...props} />
	</UICTX>
);

/** 

* @improvment - size overflow on mobile
- Analyse window width, and put overflowing top level items into menu

*/
const InnerTitleBarUI: React.FC<ITitleBarProps> = (props) => {
	const { Links, styleFunction = () => ({}) } = props;
	const { onWrapperMouseLeave, onLinkOver } = useActiveTitleLink();
	return (
		<div
			style={InteractionWrapperStyles}
			className="no-aos"
			onMouseLeave={onWrapperMouseLeave}
		>
			<div style={styleFunction()}>
				<TitleBarLogo />
				<TitleBarUILinks
					active_link_alias={
						useContext(UICTX)?.active_link_alias || ""
					}
					Links={Links}
					onLinkOver={onLinkOver}
				/>
				<TitleBarMenu />
			</div>
			{props.children}
		</div>
	);
};
const Dropdown: React.FC<ITitleBarProps> = (props) => {
	const { ActiveLinkGroup, showDropdown } = useDropDownInteractions(
		props.Links
	);
	const { onMouseEnter } = useActiveDropdownLink();
	return (
		showDropdown &&
		ActiveLinkGroup && (
			<div
				style={DropdownContainerStyles}
				onMouseEnter={onMouseEnter}
			>
				<DropDownOuter ActiveLinkGroup={ActiveLinkGroup} />
			</div>
		)
	);
};
export { Dropdown, TitleBarUI };
