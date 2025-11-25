// // client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.types.ts

// import type { Node } from "unist";

// import type {
// 	TAllPseudos,
// 	TClassSelector,
// 	TValidStyle,
// } from "../../../utils/styles.types";

// interface IHighlightRange<T extends string> {
// 	docId: T;
// 	start: number;
// 	end: number;
// }

// // interface IAnalysisData<T extends string, U extends string>  {
// // 	[id: U]: IHighlightRange<T>[];
// // }
// type IAnalysisData<T extends string, U extends string> = Record<
// 	U,
// 	IHighlightRange<T>[]
// >;

// // type IDocumentMap<
// // 	T extends string = `${string}`,
// // 	U extends string = string
// // > = Record<T, U>;
// // type IDocumentMap<T extends string, U extends string> = Record<T, U>;

// interface IDocumentMap {
// 	[docId: string]: string;
// }

// interface ITextNode extends Node {
// 	type: "text";
// 	value: string;
// }

// interface IHighlightNode extends Node {
// 	type: "highlight";
// 	data: {
// 		hName: string;
// 		hProperties: {
// 			className: string;
// 		};
// 	};
// 	children: (IHighlightNode | ITextNode)[];
// }

// interface IFlatSegment {
// 	start: number;
// 	end: number;
// 	ids: string[];
// }

// type THighlightRules = TValidStyle<TClassSelector | TAllPseudos>;
// interface ICategoryButtonProps {
// 	id: string;
// 	labelPrefix: string;
// 	StyleOverrides?: React.CSSProperties;
// }
// interface IAnalysisUIState {
// 	activeIds: string[];
// 	setActiveIds: React.Dispatch<React.SetStateAction<string[]>>;

// 	// NEW: Track which ID was just clicked to trigger a scroll event
// 	scrollToId: string | null;

// 	selectedDocs: string[];
// 	setSelectedDocs: React.Dispatch<React.SetStateAction<string[]>>;
// 	isDropdownOpen: boolean;
// 	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
// 	toggleDoc: (docId: string) => void;
// 	toggleId: (id: string) => void;
// }
// export {
// 	IAnalysisData,
// 	IDocumentMap,
// 	IHighlightNode,
// 	IFlatSegment,
// 	IAnalysisUIState,
// 	THighlightRules,
// 	ITextNode,
// 	ICategoryButtonProps,
// };
// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.types.ts

import type { Node } from "unist";

import type {
	TAllPseudos,
	TClassSelector,
	TValidStyle,
} from "../../../utils/styles.types";
type TDocId = string;
type THighlightId = string;

interface IHighlightRange {
	docId: TDocId;
	start: number;
	end: number;
}

interface IAnalysisData {
	[id: THighlightId]: IHighlightRange[];
}

interface IDocumentMap {
	[docId: TDocId]: string;
}

interface ITextNode extends Node {
	type: "text";
	value: string;
}

interface IHighlightNode extends Node {
	type: "highlight";
	data: {
		hName: string;
		hProperties: {
			className: string;
		};
	};
	children: (IHighlightNode | ITextNode)[];
}

interface IFlatSegment {
	start: number;
	end: number;
	ids: THighlightId[];
}

type THighlightRules = TValidStyle<TClassSelector | TAllPseudos>;
interface ICategoryButtonProps {
	id: THighlightId;
	labelPrefix: string;
	StyleOverrides?: React.CSSProperties;
}
interface IAnalysisUIState {
	activeIds: THighlightId[];
	setActiveIds: React.Dispatch<React.SetStateAction<THighlightId[]>>;

	// NEW: Track which ID was just clicked to trigger a scroll event
	scrollToId: THighlightId | null;

	selectedDocs: TDocId[];
	setSelectedDocs: React.Dispatch<React.SetStateAction<TDocId[]>>;
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	toggleDoc: (docId: TDocId) => void;
	toggleId: (id: THighlightId) => void;
}
export {
	TDocId,
	THighlightId,
	IAnalysisData,
	IDocumentMap,
	IHighlightNode,
	IFlatSegment,
	IAnalysisUIState,
	THighlightRules,
	ITextNode,
	ICategoryButtonProps,
};
