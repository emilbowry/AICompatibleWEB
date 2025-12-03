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
	styleOverrides?: React.CSSProperties;
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

type TQuestionString = `Does the privacy policy affirm that ${string}?`;
type TEmbedding = `embedding_vector` | `${string}_embedding_vector`;

type TStartIndex = number;
type TEndIndex = number;
type TEmbeddingData = Record<TEmbedding, number[]>;
interface IData {
	[question_string: TQuestionString]: {
		policy_data: {
			[document_hash: string]: {
				[subsection_hash: string]: {
					substring: string;
					substring_indices: [TStartIndex, TEndIndex];
				}[];
			};
		} & TEmbeddingData;
	};
}

// TEndIndex > TStartIndex, TEndIndex <= len(Document)
// interface TData
