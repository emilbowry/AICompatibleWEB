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
