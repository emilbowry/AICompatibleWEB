// client/src/features/outreach-form/OutReachForm.slice.ts

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import type { IFormMetaData, IOutreachFormFields } from "./OutReachForm.types";
import { generatePdf, TContent, TData } from "./createPdf";

interface ContactFormState {
	fields: IOutreachFormFields;
	metadata: IFormMetaData;
	status: "idle" | "loading" | "succeeded" | "failed"; // Added status for thunk
	error: string | null;
	pdfDownloadUrl: string | null;
}
const isMeaningfulValue = (value: any): boolean => {
	if (typeof value === "boolean") {
		return true;
	}
	if (value === null || value === undefined) {
		return false;
	}
	const strValue = String(value);
	return strValue.trim() !== "";
};

const formatStateForPdf = (
	state: ContactFormState,
	includeMetadata: boolean = true
): TData => {
	const filterAndMapContent = (obj: Record<string, any>) => {
		return Object.fromEntries(
			Object.entries(obj)
				.filter(([, value]) => isMeaningfulValue(value))
				.map(([key, value]) => [key, String(value)])
		);
	};

	const fieldsContent = filterAndMapContent(state.fields);

	const content: TContent = {};

	if (Object.keys(fieldsContent).length > 0) {
		content["Form Fields"] = fieldsContent;
	}

	if (includeMetadata) {
		const metadataContent = filterAndMapContent(state.metadata);
		if (Object.keys(metadataContent).length > 0) {
			content["Metadata"] = metadataContent;
		}
	}

	return {
		title: "Outreach Form Submission Data",
		content: content,
	};
};
export const submitFormAndGeneratePdf = createAsyncThunk<
	{ downloadUrl: string; message: string },
	boolean,
	{ state: RootState; rejectValue: string }
>(
	"outreachForm/submitAndGeneratePdf",
	async (includeMetadata: boolean, { getState, rejectWithValue }) => {
		try {
			const rootState = getState() as { outreachForm: ContactFormState };
			const formState = rootState.outreachForm;

			const pdfData = formatStateForPdf(formState, includeMetadata);

			const downloadUrl = generatePdf(pdfData);

			return {
				downloadUrl,
				message: "Form submitted and PDF generated successfully",
			};
		} catch (error) {
			console.error("PDF Generation or Submission Failed:", error);
			return rejectWithValue("Failed to submit form or generate PDF.");
		}
	}
);
const initialState: ContactFormState = {
	fields: {
		name: "",
		email: "",
		notes: undefined,
		isMailingListable: false,
		job_title: undefined,
		organisation: undefined,
		raw_phone_number: undefined,
		call_time: "",
	},
	metadata: {
		source: "",
		client_ip: "",
		user_agent: "",
		account_id: undefined,
		form_identifier: "other",
		submission_datetime: "",
	},
	status: "idle", // Initialize new status field
	error: null,
	pdfDownloadUrl: null,
};

export const outreachFormSlice = createSlice({
	name: "outreachForm",
	initialState,
	reducers: {
		updateField: (
			state,
			action: PayloadAction<{
				field: keyof IOutreachFormFields;
				value: IOutreachFormFields[keyof IOutreachFormFields];
			}>
		) => {
			const { field, value } = action.payload;
			(state.fields[field] as any) = value;
		},
		initializeMetadata: (state, action: PayloadAction<IFormMetaData>) => {
			state.metadata = action.payload;
		},
		resetForm: (state) => {
			state.fields = initialState.fields;
			state.metadata = initialState.metadata;
			state.status = "idle";
			state.error = null;
			state.pdfDownloadUrl = null; // <-- Reset the URL
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(submitFormAndGeneratePdf.pending, (state) => {
				state.status = "loading";
				state.error = null;
				state.pdfDownloadUrl = null; // Clear previous URL
			})
			.addCase(submitFormAndGeneratePdf.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Store the URL returned by the thunk
				state.pdfDownloadUrl = action.payload.downloadUrl;
			})
			.addCase(submitFormAndGeneratePdf.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					(action.payload as string) ||
					action.error.message ||
					"Unknown error";
				state.pdfDownloadUrl = null;
			});
	},
});

export const { updateField, initializeMetadata, resetForm } =
	outreachFormSlice.actions;
export { initialState };
export default outreachFormSlice.reducer;
