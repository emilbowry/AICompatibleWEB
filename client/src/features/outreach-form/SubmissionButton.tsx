// client/src/features/outreach-form/SubmissionButton.tsx

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDynamicLink } from "../../hooks/DynamicLink";
import { AppDispatch, RootState } from "../../store";
import { dark_midnight_green } from "../../utils/defaultColours";
import { getFields } from "./Appointments";
import { _AddToCalender } from "./calendar/Calendar";
import { CheckoutButton } from "./checkout/Checkout";
import {
	FormContext,
	useInitializeFormMetadata,
	useMetadata,
} from "./OutReachForm";
import { initialState, submitFormAndGeneratePdf } from "./OutReachForm.slice";
import { ButtonStyle, SubmitContainerStyle } from "./OutReachForm.styles";
import { IOutreachFormFields } from "./OutReachForm.types";
/**
 * @improvement - fix filter logic
				- add post checkout/submit behaviour, i.e adding invoice id etc


 */
const useRequiredFields = (
	form_type?: string,
	remove_bools: boolean = false,
	remove_text_areas: boolean = false
	// remove_select: boolean = false
) => {
	const currentInputs = [...getFields(), ...getFields(form_type)];

	const requiredFieldNames = currentInputs
		.filter(
			(config) =>
				config.required &&
				remove_text_areas &&
				config.type !== "checkbox" &&
				remove_bools &&
				config.type
			// && remove_select &&
			// config.type !== "select"
		)
		.map((config) => config.name);
	return requiredFieldNames;
};
const validateEmail = (email: string) => {
	return !!String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const validateNumber = (maybeNum: string) => !isNaN(+maybeNum);

const useDirtyFields = (
	form_type?: string,
	remove_bools: boolean = false,
	remove_text_areas: boolean = false,
	// remove_select: boolean = false,
	use_required_filter = true
) => {
	const currentInputs = [...getFields(), ...getFields(form_type)];

	const currentFields = useSelector(
		(state: RootState) => state.outreachForm.fields
	);
	const iterable = use_required_filter
		? currentInputs
				.filter(
					(config) =>
						config.required &&
						remove_text_areas &&
						config.type !== "checkbox" &&
						remove_bools &&
						config.type
					//  && remove_select &&
					// config.type !== "select"
				)
				.map((config) => config.name)
		: Object.keys(currentFields);

	const defaultFields = initialState.fields;

	const dirtyFieldNames: any[] = [];
	console.log(currentFields);

	iterable.forEach((fieldName) => {
		const currentValue = (currentFields as any)[fieldName];
		const defaultValue = (defaultFields as any)[fieldName];
		if (remove_bools && typeof currentValue === "boolean") {
			return;
		}
		if (remove_text_areas && fieldName === "notes") {
			return;
		}
		if (currentValue !== defaultValue) {
			dirtyFieldNames.push(fieldName);
		}
	});

	return dirtyFieldNames;
};
const useValidation = (form_type?: string) => {
	const [err_state, setErrorState] = useState<string | undefined>(undefined);
	const [selectorCheckResult, setSelectorCheckResult] = useState(false);
	const requiredFieldNames = useRequiredFields(
		form_type,
		true,
		/* true, */
		true
	);
	const allDirtyFieldNames = useDirtyFields(
		form_type,
		true,
		true,
		// true,
		true
	);
	const fields = useSelector((state: RootState) => state.outreachForm.fields);
	const isValidLength =
		allDirtyFieldNames.length == requiredFieldNames.length;

	const runValidation = (
		err_message: string | undefined,
		fn: (...a: any[]) => boolean,
		name: string,
		valid_name: string | undefined = undefined,
		result = false
	) => {
		if (
			(valid_name ?? name) === name &&
			!fn((fields as any)[name as any])
		) {
			setErrorState(err_message);
			setSelectorCheckResult(result);
			return false;
		}

		return true;
	};

	const _MissingRequired = () => isValidLength;
	const _IsFullandComplete = () => !isValidLength;

	useEffect(() => {
		allDirtyFieldNames.forEach((n) => {
			runValidation("Invalid email", validateEmail, n, "email") &&
				runValidation(
					"Non-numerical number of participents",
					validateNumber,
					n,
					"participants"
				) &&
				runValidation(
					"Required Fields are marked with *",
					_MissingRequired,
					n
				) &&
				runValidation(
					"Required Fields are marked with *",
					_MissingRequired,
					n
				) &&
				runValidation(
					undefined,
					_IsFullandComplete,
					n,
					undefined,
					true
				);
		});
	}, [fields, allDirtyFieldNames, requiredFieldNames, isValidLength]);

	return { isInvalid: !selectorCheckResult, err_state };
};
const SubmitButton: React.FC<{
	isDisabled: boolean;
	includeMetaData?: boolean;
}> = ({ isDisabled, includeMetaData = false }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { status } = useSelector((state: RootState) => state.outreachForm);

	const isLoading = status === "loading";
	const _setSubmitted = useContext(FormContext).setSubmitted;
	const handleSubmit = (e: React.MouseEvent) => {
		e.preventDefault();
		_setSubmitted(true);
		if (!isDisabled && !isLoading) {
			dispatch(submitFormAndGeneratePdf(includeMetaData));
		}
	};

	const buttonText = isLoading ? "Submitting..." : "Submit";
	const linkprops = useDynamicLink({
		style_args: ["2px"],

		useDefaultDecoration: true,
		StyleOverrides: {
			color: dark_midnight_green,
		},
	});

	return (
		<button
			type="submit"
			disabled={isDisabled || isLoading}
			onClick={handleSubmit}
			style={ButtonStyle}
		>
			<div {...linkprops}>{buttonText}</div>
		</button>
	);
};

const DownloadButton = () => {
	const { status, pdfDownloadUrl } = useSelector(
		(state: RootState) => state.outreachForm
	);
	const pdfLinkProps = useDynamicLink({
		style_args: ["2px"],

		StyleOverrides: {
			color: dark_midnight_green,
		},
	});

	return (
		status === "succeeded" &&
		pdfDownloadUrl && (
			<button style={ButtonStyle}>
				<a
					href={pdfDownloadUrl}
					download="outreach_form_submission.pdf"
					style={{
						color: "none",

						textDecorationColor: "none",
						textDecorationLine: "none",
					}}
				>
					<div {...pdfLinkProps}> Download PDF</div>
				</a>
			</button>
		)
	);
};
const AddToCalender: React.FC<{ date_key?: string }> = ({ date_key }) => {
	return (
		<>
			{date_key && (
				<_AddToCalender
					date_key={date_key as keyof IOutreachFormFields}
				/>
			)}
		</>
	);
};
const Submission: React.FC<{
	includeMetaData?: boolean;
}> = ({ includeMetaData }) => {
	const { form_type, isFormError = false } = useContext(FormContext);
	const MetaData = useMetadata();
	useInitializeFormMetadata(MetaData);

	const data_val_key =
		form_type === "BookCall"
			? "call_time"
			: form_type === "BookService"
			? "preliminary_date"
			: undefined;

	return (
		<div style={SubmitContainerStyle}>
			<SubmitButton
				isDisabled={isFormError}
				includeMetaData={includeMetaData}
			/>
			<DownloadButton />
			{form_type === "BookCall" || form_type === "BookService" ? (
				<AddToCalender date_key={data_val_key} />
			) : null}
			{form_type === "BookService" && !isFormError ? (
				<CheckoutButton />
			) : null}
		</div>
	);
};

export { Submission, useValidation };
