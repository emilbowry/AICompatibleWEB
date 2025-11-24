// src/features/titlebar/TitleBarHelpers.tsx
import React from "react";

import { Menu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { SignInButtons } from "../../components/login/AuthMenu";
import { MenuStyle } from "../../components/login/Login.styles";
import { LoginStatus } from "../../components/login/LoginStatus";
import { LogOutButton } from "../../components/login/LogOutButton";
import { ModalBody } from "../../components/pop-over/PopOver";
import { useDynamicLink } from "../../hooks/DynamicLink";
import {
	selectAuthStatus,
	selectUser,
} from "../../services/api/auth/auth.slice";
import {
	DropdownImageContainerStyles,
	DropdownImageStyles,
	DropdownImageViewOverviewStyles,
	DropdownLinksColumnStyles,
	DropdownLinkStyles,
	DropdownStyles,
	HamburgerStyle,
	LogoContainerStyles,
	LogoStyles,
	NavLinksContainerStyles,
	PillBarOverrides,
	RightHandContainerStyles,
	titleBarStyles,
} from "./TitleBar.styles";
import {
	ITitleBarLink,
	ITitleBarProps,
	ITitleBarUILinksProps,
} from "./TitleBar.types";

const formatLabel = (key: string, alias?: string): string => {
	if (alias) return alias;
	if (key === "/") return "Home";
	return key
		.replace(/_/g, " ")
		.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1));
};
const usePillOnScroll = (d_threshold: number = 5, u_threshold: number = 10) => {
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			const current_scroll_y = window.scrollY;
			setIsScrolled(
				(_isScrolled) =>
					(!_isScrolled && current_scroll_y > u_threshold) ||
					(_isScrolled && !(current_scroll_y < d_threshold))
			);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [d_threshold, u_threshold]);
	return isScrolled;
};

const usePillBarStyle = (_isScrolled: boolean) => {
	const pill_DEFAULT = usePillOnScroll();
	const isScrolled = _isScrolled || pill_DEFAULT;
	const TitleBarStyle = useMemo(
		() => ({
			...titleBarStyles(),
			transition: "all 0.5s ease-in-out",
			...(isScrolled ? PillBarOverrides : {}),
		}),
		[isScrolled]
	);

	return TitleBarStyle;
};
const TitleBarLogo: React.FC = () => (
	<div style={LogoContainerStyles}>
		<img
			src={logo}
			alt="Logo"
			style={LogoStyles}
		/>
	</div>
);
const AuthMenu: React.FC<{ menu_links?: ITitleBarLink[] }> = ({
	menu_links,
}) => {
	const user = useSelector(selectUser);
	const status = useSelector(selectAuthStatus);

	return (
		<div style={MenuStyle}>
			{status === "loading" || status === "idle" ? (
				<></>
			) : user ? (
				<>
					<LoginStatus />
					<LogOutButton />
				</>
			) : (
				<SignInButtons />
			)}
			{menu_links ? <LinkList link_group={menu_links} /> : <></>}
		</div>
	);
};
const TitleBarMenu: React.FC<ITitleBarProps> = ({ Links }) => {
	const [isOpen, setIsOpen] = useState(false);
	const menu_links = Links?.[1];

	return (
		<>
			<div style={RightHandContainerStyles}>
				<button
					style={HamburgerStyle}
					aria-label="Menu"
					onClick={() => setIsOpen(!isOpen)}
				>
					<Menu size={24} />
				</button>
			</div>
			{isOpen && (
				<ModalBody
					closeModal={() => {
						setIsOpen(false);
					}}
					node={<AuthMenu menu_links={menu_links} />}
				/>
			)}
		</>
	);
};

const TitleBarUILink: React.FC<{
	active_link_alias: string;
	display_alias: string;
	path: string;
	onLinkOver: (alias: string) => void;
}> = ({ active_link_alias, display_alias, onLinkOver, path }) => (
	<div
		{...useDynamicLink({
			useDefaultDecoration: false,
			condition_function: () => active_link_alias === display_alias,
			style_args: ["2px"],
			StyleOverrides: {
				backgroundPosition: "bottom  left",
				paddingBottom: "1px",
			},
		})}
	>
		<NavLink
			to={path}
			onMouseOver={() => onLinkOver(display_alias)}
			style={{
				color: "inherit",
				textDecorationColor: "inherit",
				textDecorationLine: "inherit",
			}}
		>
			{display_alias}
		</NavLink>
	</div>
);
const TitleBarUILinks: React.FC<ITitleBarUILinksProps> = ({
	active_link_alias,
	Links,
	onLinkOver,
}) => (
	<div style={NavLinksContainerStyles}>
		{Links.map((LinkGroup) => {
			const main_link = LinkGroup[0];
			if (!main_link) return null;
			const display_alias = formatLabel(main_link.path, main_link.alias);
			return (
				<TitleBarUILink
					active_link_alias={active_link_alias}
					display_alias={display_alias}
					path={main_link.path}
					onLinkOver={onLinkOver}
					key={display_alias}
				/>
			);
		})}
	</div>
);

const DropDownLink: React.FC<{ path: string; alias: string | undefined }> = ({
	path,
	alias,
}) => (
	<NavLink
		to={path}
		{...useDynamicLink({
			useDefaultDecoration: true,

			StyleOverrides: DropdownLinkStyles,
		})}
	>
		{formatLabel(path, alias)}
	</NavLink>
);

const LinkList: React.FC<{ link_group: ITitleBarLink[] }> = ({
	link_group,
}) => (
	<div style={DropdownLinksColumnStyles}>
		{link_group.map((link, index) => (
			<DropDownLink
				path={link.path}
				alias={link.alias}
				key={`${link.path}-${index}`}
			/>
		))}
	</div>
);
const DropDownOuter: React.FC<{ ActiveLinkGroup: ITitleBarLink[] }> = ({
	ActiveLinkGroup,
}) => (
	<div style={DropdownStyles}>
		{ActiveLinkGroup.length > 1 && (
			<LinkList link_group={ActiveLinkGroup} />
		)}
		<DropDownInner ActiveLinkGroup={ActiveLinkGroup} />
	</div>
);
const DropDownInner: React.FC<{ ActiveLinkGroup: ITitleBarLink[] }> = ({
	ActiveLinkGroup,
}) => (
	<>
		{ActiveLinkGroup[0].image && (
			<div style={DropdownImageContainerStyles}>
				<img
					src={ActiveLinkGroup[0].image}
					alt={`${formatLabel(
						ActiveLinkGroup[0].path,
						ActiveLinkGroup[0].alias
					)} overview`}
					style={DropdownImageStyles}
				/>
				<div style={DropdownImageViewOverviewStyles}>
					View overview
					<span style={{ marginLeft: "5px" }}>&rarr;</span>
				</div>
			</div>
		)}
	</>
);
export {
	DropDownOuter,
	formatLabel,
	TitleBarLogo,
	TitleBarMenu,
	TitleBarUILinks,
	usePillBarStyle,
};
