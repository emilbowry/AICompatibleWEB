import { TFormConfigProps } from "./OutReachForm.types";

const NameInput: TFormConfigProps<"name"> = {
	name: "name",
	label: "Name",
	required: true,
	type: "text",
};

const ForTeamCheckbox: TFormConfigProps<"isMailingListable"> = {
	name: "isMailingListable",
	label: "Join Mailing List",
	required: true,
	type: "checkbox",
};
const EmailInput: TFormConfigProps<"email"> = {
	name: "email",
	label: "Email",
	required: true,
	type: "email",
};

const NotesTextArea: TFormConfigProps<"notes"> = {
	name: "notes",
	label: "Notes",
	required: true,
	type: undefined,
};

const OrganisationInput: TFormConfigProps<"organisation"> = {
	name: "organisation",
	label: "Organisation",
	required: false,
	type: "text",
};
const JobInput: TFormConfigProps<"job_title"> = {
	name: "job_title",
	label: "Job Title",
	required: false,
	type: "text",
};

const PhoneInput: TFormConfigProps<"raw_phone_number"> = {
	name: "raw_phone_number",
	label: "Phone Number",
	required: false,
	type: "tel",
};
const OptionalInputs = [OrganisationInput, JobInput, PhoneInput];

const RequiredInputs = [NameInput, ForTeamCheckbox, EmailInput, NotesTextArea];

const AllDefaultInputs = [...RequiredInputs, ...OptionalInputs];
export { AllDefaultInputs };
