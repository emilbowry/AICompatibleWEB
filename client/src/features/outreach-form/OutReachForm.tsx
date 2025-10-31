import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHref } from "react-router-dom";
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

// const useMetadata = (): IFormMetaData => {
// 	const ctx = useAuth();
// 	const source = useContext(PortalContext)?.source || useHref("");
// 	const form_identifier: IFormMetaData["form_identifier"] =
// 		source === "/demo_and_testing" ? "ContactUs" : "Footer";
// 	const MetaData = {
// 		source,
// 		form_identifier,
// 		user_agent,
// 		client_ip: "0.0.0.0",
// 		account_id: ctx.user?.id,
// 		submission_datetime: getDefaultDateTimeLocal(),
// 	};
// 	return MetaData;
// };
const useMetadata = (): IFormMetaData => {
	// const ctx = useAuth(); // Assuming useAuth() is defined
	const source = useContext(PortalContext)?.source || useHref("");
	const form_identifier: IFormMetaData["form_identifier"] =
		source === "/demo_and_testing" ? "ContactUs" : "Footer";

	// 1. Initialize state with a placeholder for the IP
	const [metaData, setMetaData] = useState<IFormMetaData>({
		source,
		form_identifier,
		user_agent,
		client_ip: "fetching...", // Placeholder IP
		account_id: "0.0.0.0",
		submission_datetime: getDefaultDateTimeLocal(),
	});

	// 2. Use useEffect to fetch the IP address once on component mount
	// useEffect(() => {
	// 	const fetchIp = async () => {
	// 		try {
	// 			const response = await fetch("/api/ip");
	// 			if (response.ok) {
	// 				const data = await response.json();
	// 				// 3. Update the state with the fetched IP, triggering a re-render
	// 				setMetaData((prevData) => ({
	// 					...prevData,
	// 					client_ip: data.ip || "not_found",
	// 				}));
	// 			} else {
	// 				setMetaData((prevData) => ({
	// 					...prevData,
	// 					client_ip: "error_response",
	// 				}));
	// 			}
	// 		} catch (error) {
	// 			console.error("Failed to fetch client IP:", error);
	// 			setMetaData((prevData) => ({
	// 				...prevData,
	// 				client_ip: "error_fetching",
	// 			}));
	// 		}
	// 	};

	// 	fetchIp();
	// }, [source, form_identifier]); // Dependencies ensure this runs if the source changes

	// 4. Return the stateful metadata object
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

	// setValidationErr: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const default_form_context = {
	submit_disabled: true,
	isFormError: undefined,
	validationErr: "",
	form_type: undefined,
	submitted: false,
	setSubmitted: () => {},

	setDisabled: () => {},
	// setValidationErr: () => {},
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
				{/* const TestAuth = () => {
	const ctx = useAuth();
	const a = ctx.user?.id;
	return <p>{a}</p>;
}; */}
				{/* <AuthGuard> */}
				<Submission includeMetaData={includeMetaData} />
				{/* </AuthGuard> */}
			</div>
		</FormContext>
	);
};

export { FormContext, OutReachForm };
