// src/components/callingcard/CallingCard.types.ts

import { ValidComponent } from "../../utils/reactUtils";

interface ICallOutProps {
	content: ValidComponent;
	wrapper_style?: React.CSSProperties;
	styleOverrides?: React.CSSProperties;
	noAos?: boolean;
}
interface IHeaderProps extends ICallOutProps {}

interface IFooterProps extends ICallOutProps {}

interface IContainerProps {
	components: ValidComponent[];
	styleOverrides?: React.CSSProperties;
	noAos?: boolean;
}
interface IGridBodyProps extends IContainerProps {
	columnOverrides?: string;
}
interface ICallingCardProps {
	components: ValidComponent[];
	header?: ValidComponent;
	footer?: ValidComponent;
	fullSpread?: boolean;
	index?: number;
	styleOverrides?: React.CSSProperties;
	isPageElement?: boolean;
	narrowPageEl?: boolean;

	noAos?: boolean;
	children?: React.ReactNode;
}

interface IGridItemProps {
	noAos?: boolean;

	content: ValidComponent;
	styleOverrides?: React.CSSProperties;
	item_key: React.Key | null | undefined;
}

export type {
	ICallingCardProps,
	ICallOutProps,
	IFooterProps,
	IGridBodyProps,
	IGridItemProps,
	IHeaderProps,
};
