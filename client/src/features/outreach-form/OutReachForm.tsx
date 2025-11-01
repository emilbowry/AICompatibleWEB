import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHref } from "react-router-dom";
import { useAuth } from "../../components/login/auth";
import { user_agent } from "../../hooks/BrowserDependant";
import { AppDispatch } from "../../store";
import { Appointment } from "./Appointments";
import { getDefaultDateTimeLocal } from "./CalanderHooks";
import { FormContainer } from "./FormUI";
import { initializeMetadata } from "./OutReachForm.slice";
import {
	ErrMessageStyle,
	FormContainerStyle,
	TitleStyle,
} from "./OutReachForm.styles";
import type { IFormMetaData } from "./OutReachForm.types";
import { PortalContext } from "./PopOver";
import { Submission, useValidation } from "./SubmissionButton";

const useMetadata = () => {
	const ctx = useAuth();
	const source = useContext(PortalContext)?.source || useHref("");
	const form_identifier: IFormMetaData["form_identifier"] =
		source === "/demo_and_testing" ? "ContactUs" : "Footer";

	const [metaData, setMetaData] = useState<IFormMetaData>({
		source,
		form_identifier,
		user_agent,
		client_ip: "fetching...",
		account_id: ctx.user?.id,
		submission_datetime: getDefaultDateTimeLocal(),
	});

	useEffect(() => {
		const fetchIp = async () => {
			try {
				const response = await fetch("/api/ip");
				if (response.ok) {
					const data = await response.json();
					setMetaData((prevData) => ({
						...prevData,
						client_ip: data.ip || "not_found",
					}));
				} else {
					setMetaData((prevData) => ({
						...prevData,
						client_ip: "error_response",
					}));
				}
			} catch (error) {
				setMetaData((prevData) => ({
					...prevData,
					client_ip: "error_fetching",
				}));
			}
		};

		fetchIp();
	}, [source, form_identifier]);
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

interface IFormContext {
	submit_disabled: boolean;
	isFormError: boolean | undefined;
	validationErr: string | undefined;
	form_type: string | undefined;
	setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
	setIsValidated: React.Dispatch<React.SetStateAction<boolean>>;
	submitted: boolean;
	setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

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
