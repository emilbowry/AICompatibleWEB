// client/src/features/outreach-form/OutReachForm.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHref } from "react-router-dom";
import { PortalContext } from "../../components/pop-over/PopOver";
import { user_agent } from "../../hooks/BrowserDependant";
import { useAccountId } from "../../services/api/auth/auth";
import { useIP, useIPRegionGuess } from "../../services/api/util/ip";
import { AppDispatch, RootState } from "../../store";
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

import * as i18n from "i18n-iso-countries";
import { parsePhoneNumberFromString, PhoneNumber } from "libphonenumber-js";
i18n.registerLocale(require("i18n-iso-countries/langs/en.json"));

const inferRegionFromPhoneNumber = (
	phoneNumberString: string
): string | undefined => {
	if (!phoneNumberString.startsWith("+")) {
		return undefined;
	}

	const phoneNumber: PhoneNumber | undefined =
		parsePhoneNumberFromString(phoneNumberString);

	if (phoneNumber && phoneNumber.country) {
		return phoneNumber.country;
	}

	return undefined;
};

const inferRegionNameFromPhoneNumber = (
	phoneNumberString: string | undefined,
	lang: string = "en"
): string | undefined => {
	if (phoneNumberString === undefined) return undefined;
	const phone_num_string = stripAllWhitespace(phoneNumberString);
	const isoCountryCode = inferRegionFromPhoneNumber(phone_num_string);

	if (isoCountryCode) {
		const countryName = i18n.getName(isoCountryCode, lang);

		if (countryName && countryName !== isoCountryCode) {
			return countryName;
		}

		return isoCountryCode;
	}
	return undefined;
};
const stripAllWhitespace = (str: string): string => {
	const controlAndWhitespaceRegex =
		/[\s\u200E\u200F\u202A-\u202E\u202C\u2066-\u2069\uFEFF\xA0]/g;

	return str
		.replace(controlAndWhitespaceRegex, "")
		.replace(/^["'“”‘’]|["'“”‘’]$/g, "");
};
const usePhoneRegion = () => {
	const phoneNumber = useSelector(
		(state: RootState) => state.outreachForm.fields["raw_phone_number"]
	);

	const ctry = inferRegionNameFromPhoneNumber(phoneNumber);

	return ctry;
};
const useMetadata = (): IFormMetaData => {
	const source = useContext(PortalContext)?.source || useHref("");
	const client_ip = useIP();
	const client_ip_region = useIPRegionGuess(client_ip);
	const phone_region = usePhoneRegion();
	const account_id = useAccountId() ?? "n/a";
	const form_identifier: IFormMetaData["form_identifier"] =
		source === "/demo_and_testing" ? "ContactUs" : "Footer";

	const metaData: IFormMetaData = {
		source,
		form_identifier,
		client_ip_region,
		phone_region,
		user_agent,
		client_ip,
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
			<div style={{ minWidth: "50vw" }}>
				<div style={FormContainerStyle}>
					<h2 style={TitleStyle}>Contact Us</h2>
					<FormStatus />

					<FormContainer />
					{form_type && <Appointment />}

					<Submission includeMetaData={includeMetaData} />
				</div>
			</div>
		</FormContext>
	);
};

export { FormContext, OutReachForm };
