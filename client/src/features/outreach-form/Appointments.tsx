// client/src/features/outreach-form/Appointments.tsx

import { useContext } from "react";
import { FormContainer } from "./FormUI";
import { FormContext } from "./OutReachForm";
import { TFormConfigProps } from "./OutReachForm.types";
import { AllDefaultInputs } from "./UniversalForm";

const CallTimeInput: TFormConfigProps<"call_time"> = {
	name: "call_time",
	label: "If you want a call scheduled, please indicate when works for you",
	type: "datetime-local",
	required: true,
};

const BookCallInputs = [CallTimeInput];

const EmailInquiryTextArea: TFormConfigProps<"request_email"> = {
	name: "request_email",
	label: "Notes or questions to be covered in email response",
	type: undefined,
	required: true,
};

const EmailInquiryInputs = [EmailInquiryTextArea];

const NumberOfParticipents: TFormConfigProps<"participants"> = {
	name: "participants",
	label: "Number of participants",
	type: "number",
	required: true,
};
const SessionDate: TFormConfigProps<"preliminary_date"> = {
	name: "preliminary_date",
	label: "Preliminary Date",
	type: "datetime-local",
	required: true,
};
const BookServiceInputs = [NumberOfParticipents, SessionDate];

const getFields = (form_type?: string) =>
	form_type === "BookCall"
		? BookCallInputs
		: form_type === "EmailInquiry"
		? EmailInquiryInputs
		: form_type === "BookService"
		? BookServiceInputs
		: AllDefaultInputs;
const Appointment: React.FC = () => {
	return (
		<FormContainer inputs={getFields(useContext(FormContext).form_type)} />
	);
};

export { Appointment, getFields };
