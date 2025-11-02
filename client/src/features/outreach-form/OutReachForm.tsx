// client/src/features/outreach-form/OutReachForm.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHref } from "react-router-dom";
import { PortalContext } from "../../components/pop-over/PopOver";
import { user_agent } from "../../hooks/BrowserDependant";
import { useAccountId } from "../../services/api/auth/auth";
import { useIP } from "../../services/api/util/ip";
import { AppDispatch } from "../../store";
import { Appointment } from "./Appointments";
import { getDefaultDateTimeLocal } from "./calendar/Calendar";
import { FormContainer } from "./FormUI";
import { initializeMetadata } from "./OutReachForm.slice";
import {
	ErrMessageStyle,
	FormContainerStyle,
	TitleStyle,
} from "./OutReachForm.styles";
import type { IFormContext, IFormMetaData } from "./OutReachForm.types";
import { Submission, useValidation } from "./SubmissionButton";
/**
 * @improvement - implement region heuristic


 */
const useMetadata = (): IFormMetaData => {
	const source = useContext(PortalContext)?.source || useHref("");
	const ip = useIP();
	const account_id = useAccountId() ?? "n/a";
	const form_identifier: IFormMetaData["form_identifier"] =
		source === "/demo_and_testing" ? "ContactUs" : "Footer";

	const metaData: IFormMetaData = {
		source,
		form_identifier,
		user_agent,
		client_ip: ip,
		account_id,
		submission_datetime: getDefaultDateTimeLocal(),
	};

	return metaData;
};
const useInitializeFormMetadata = (MetaData: IFormMetaData) => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (MetaData) {
			dispatch(initializeMetadata(MetaData));
		}
	}, [MetaData, dispatch]);
};

export { useInitializeFormMetadata, useMetadata };

const default_form_context = {
	submit_disabled: true,
	isFormError: undefined,
	validationErr: "",
	form_type: undefined,
	submitted: false,
	setSubmitted: () => {},
	setDisabled: () => {},
	setIsValidated: () => {},
};

const FormContext = createContext<IFormContext>(default_form_context);
const FormStatus: React.FC = () => {
	const { validationErr } = useContext(FormContext);
	return validationErr && <div style={ErrMessageStyle}>{validationErr}</div>;
};
const OutReachForm: React.FC<{
	form_type?: string;
	includeMetaData?: boolean;
}> = ({ form_type, includeMetaData }) => {
	const { isInvalid, err_state } = useValidation(form_type);

	const [submitted, setSubmitted] = useState(false);

	return (
		<FormContext
			value={{
				...default_form_context,
				form_type: form_type,
				isFormError: isInvalid,
				validationErr: err_state,
				submitted,
				setSubmitted,
			}}
		>
			<div style={FormContainerStyle}>
				<h2 style={TitleStyle}>Contact Us</h2>
				<FormStatus />

				<FormContainer />
				{form_type && <Appointment />}

				<Submission includeMetaData={includeMetaData} />
			</div>
		</FormContext>
	);
};

export { FormContext, OutReachForm };
