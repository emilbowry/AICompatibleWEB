// client/src/pages/dpo-tool/CSS_Markdown/CSSMarkdown.types.ts

import type { Node } from "unist";
import {
	TAllPseudos,
	TClassSelector,
	TValidStyle,
} from "../../../utils/styles.types";
type TDocId = string;
type THighlightId = string;

// --- New Raw Data Structures ---

// output_p.json structure
interface IRawDocLibrary {
	[policyName: string]: {
		[policyHash: string]: {
			policy_content: string;
			fetch_date: string;
		};
	};
}

// output_q.json structure
interface IRawAnalysisData {
	[question: string]: {
		[policyHash: string]: {
			substring_indices: [number, number]; // [start, end]
		}[];
	};
}

// Internal Lookup for UI (Flattened)
interface IDocMeta {
	content: string;
	label: string;
}

// --- AST / Logic Types ---

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

interface IAnalysisUIState {
	activeIds: THighlightId[];
	setActiveIds: React.Dispatch<React.SetStateAction<THighlightId[]>>;

	scrollToId: THighlightId | null;

	selectedDocs: TDocId[];
	setSelectedDocs: React.Dispatch<React.SetStateAction<TDocId[]>>;
	syntheticDocs: TDocId[];
	setSyntheticDocs: React.Dispatch<React.SetStateAction<TDocId[]>>;
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	toggleDoc: (docId: TDocId) => void;
	toggleId: (id: THighlightId) => void;
	activeDoc: string | null;
	toggleActiveDoc: (docId: string | null) => () => void;
}

type THighlightRules = TValidStyle<TClassSelector | TAllPseudos>;

interface ICategoryButtonProps {
	id: THighlightId;
	labelPrefix?: string;
	StyleOverrides?: React.CSSProperties;
}

export {
	TDocId,
	THighlightId,
	IRawDocLibrary,
	IRawAnalysisData,
	IDocMeta,
	IHighlightNode,
	IFlatSegment,
	IAnalysisUIState,
	THighlightRules,
	ITextNode,
	ICategoryButtonProps,
};
