// src/features/titlebar/TitleBar.types.ts

interface ITitleBarLink {
	alias?: string;
	path: string;
	image?: string;
}

interface ITitleBarProps {
	logo_src: string;
	Links: [ITitleBarLink[][], ITitleBarLink[]];
	styleFunction?: (...args: any[]) => React.CSSProperties;
	children?: React.ReactNode;
}
interface ITitleBarUILinksProps {
	active_link_alias: string;
	Links: ITitleBarLink[][];
	onLinkOver: (alias: string) => void;
}

interface ITitleBarUIState {
	initial_active_alias: string;
	active_link_alias: string;
	setActiveLinkAlias:
		| React.Dispatch<React.SetStateAction<string>>
		| ((alias: string) => void);
	isOverLink: boolean;
	setIsOverLink:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((overlink: boolean) => void);
	isActive: boolean;
	setIsActive:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((active: boolean) => void);
}
export type {
	ITitleBarLink,
	ITitleBarProps,
	ITitleBarUILinksProps,
	ITitleBarUIState,
};
