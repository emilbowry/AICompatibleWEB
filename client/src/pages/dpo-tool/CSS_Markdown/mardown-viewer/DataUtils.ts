// --- Data Pre-Processing ---
// Data Imports
import local_question_data from "./output_q.json";
import local_policy_data from "./output_p.json";

import { useState, useContext, useMemo, createContext } from "react";
import { generateGradient } from "../../../../styles";
import {
	IRawDocLibrary,
	IRawAnalysisData,
	TDocId,
	IDocMeta,
	IFlatSegment,
	THighlightId,
	IAnalysisUIState,
} from "../CSSMarkdown.types";

const RAW_DOCS = local_policy_data as unknown as IRawDocLibrary;
const RAW_ANALYSIS = local_question_data as unknown as IRawAnalysisData;

// 1. Flatten Documents for O(1) Lookup and Flat UI List
const DOC_LOOKUP: Record<TDocId, IDocMeta> = {};

Object.entries(RAW_DOCS).forEach(([policyName, versions]) => {
	Object.entries(versions).forEach(([hash, data]) => {
		// We format the label here once: "Privacy Policy (2024-01-01)"
		DOC_LOOKUP[hash] = {
			content: data.policy_content,
			label: `${policyName} (${data.fetch_date})`,
		};
	});
});

// 2. Color Generation
const ANALYSIS_KEYS = Object.keys(RAW_ANALYSIS);
const GRADIENT_COLORS = generateGradient(ANALYSIS_KEYS.length);

const ID_COLORS: Record<string, string> = {};
ANALYSIS_KEYS.forEach((key, index) => {
	ID_COLORS[key] = GRADIENT_COLORS[index];
});

const DOC_HASHES = Object.keys(DOC_LOOKUP);
const DOC_COLORS_LIST = generateGradient(
	DOC_HASHES.length,
	"#16a34a", // Green
	"#ea580c" // Orange
);

const DOC_THEME_COLORS: Record<string, string> = {};
DOC_HASHES.forEach((hash, index) => {
	DOC_THEME_COLORS[hash] = DOC_COLORS_LIST[index];
});

// --- Logic Update: Flatten Ranges (New Structure) ---

const flattenRanges = (
	docId: TDocId,
	data: IRawAnalysisData
): IFlatSegment[] => {
	const points = new Set<number>();

	// Temporary map to hold ranges before segmentation
	// [ { id: "Question A", start: 10, end: 20 }, ... ]
	const rangeMap: { id: THighlightId; start: number; end: number }[] = [];

	// Iterate over every question in the analysis
	Object.entries(data).forEach(([questionId, docMap]) => {
		// Direct Access: Check if this question applies to our specific docHash
		const occurrences = docMap[docId];

		if (occurrences) {
			occurrences.forEach((instance) => {
				const [start, end] = instance.substring_indices;
				points.add(start);
				points.add(end);
				rangeMap.push({ id: questionId, start, end });
			});
		}
	});

	// Standard segmentation logic (unchanged)
	const sortedPoints = Array.from(points).sort((a, b) => a - b);
	const segments: IFlatSegment[] = [];

	for (let i = 0; i < sortedPoints.length - 1; i++) {
		const start = sortedPoints[i];
		const end = sortedPoints[i + 1];
		const mid = start + (end - start) / 2;

		const activeIds = rangeMap
			.filter((r) => r.start <= mid && r.end >= mid)
			.map((r) => r.id);

		if (activeIds.length > 0) {
			segments.push({ start, end, ids: activeIds });
		}
	}

	return segments;
};

const AnalysisCTX = createContext<IAnalysisUIState>(undefined as any);

const useAnalysisState = (): IAnalysisUIState => {
	const [activeIds, setActiveIds] = useState<THighlightId[]>([]);
	const [selectedDocs, setSelectedDocs] = useState<TDocId[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [scrollToId, setScrollToId] = useState<THighlightId | null>(null);

	const toggleDoc = (docId: TDocId) => {
		setSelectedDocs((prev) =>
			prev.includes(docId)
				? prev.filter((d) => d !== docId)
				: [...prev, docId]
		);
	};

	const toggleId = (id: THighlightId) => {
		const isTurningOn = !activeIds.includes(id);

		setActiveIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);

		if (isTurningOn) {
			setScrollToId(id);
			setTimeout(() => setScrollToId(null), 100);
		}
	};

	return {
		activeIds,
		setActiveIds,
		selectedDocs,
		setSelectedDocs,
		isDropdownOpen,
		setIsDropdownOpen,
		toggleDoc,
		toggleId,
		scrollToId,
	};
};
const useAnalysisContext = () => {
	const context = useContext(AnalysisCTX);
	if (!context) {
		throw new Error(
			"useAnalysisContext must be used within an AnalysisCTX Provider"
		);
	}
	return context;
};

// --- Logic Update: Categorization (New Structure) ---

const useDataCategorization = () => {
	const { selectedDocs } = useAnalysisContext();

	return useMemo(() => {
		const qTypes: Record<THighlightId, "unique" | "shared"> = {};

		// A. Determine Global Type using Nested Structure
		Object.entries(RAW_ANALYSIS).forEach(([questionId, docMap]) => {
			const uniqueDocsForQuestion = new Set(Object.keys(docMap)); // Keys are hashes
			if (uniqueDocsForQuestion.size > 1) {
				qTypes[questionId] = "shared";
			} else {
				qTypes[questionId] = "unique";
			}
		});

		const visibleUniqueMap: Record<TDocId, THighlightId[]> = {};
		const visibleSharedList: THighlightId[] = [];

		selectedDocs.forEach((docId) => (visibleUniqueMap[docId] = []));

		// B. Filter for Current View
		Object.entries(RAW_ANALYSIS).forEach(([questionId, docMap]) => {
			const type = qTypes[questionId];

			// Is this question relevant to ANY selected doc?
			const docKeys = Object.keys(docMap);
			const isRelevant = docKeys.some((docHash) =>
				selectedDocs.includes(docHash)
			);

			if (!isRelevant) return;

			if (type === "shared") {
				if (!visibleSharedList.includes(questionId)) {
					visibleSharedList.push(questionId);
				}
			} else {
				// It's unique to one doc
				const docId = docKeys[0];
				if (visibleUniqueMap[docId]) {
					visibleUniqueMap[docId].push(questionId);
				}
			}
		});

		return {
			uniqueMap: visibleUniqueMap,
			sharedList: visibleSharedList,
		};
	}, [selectedDocs]);
};

export {
	useAnalysisContext,
	ID_COLORS,
	DOC_THEME_COLORS,
	useDataCategorization,
	flattenRanges,
	RAW_ANALYSIS,
	AnalysisCTX,
	useAnalysisState,
	DOC_LOOKUP,
};
