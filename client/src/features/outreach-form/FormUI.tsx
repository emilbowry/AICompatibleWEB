// client/src/features/outreach-form/FormUI.tsx

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { updateField } from "./OutReachForm.slice";
import {
	CheckboxInputStyle,
	DescriptionStyle,
	FormGroupStyle,
	InputBaseStyle,
	LabelStyle,
	OptionalInputStyle,
	TextAreaStyle,
} from "./OutReachForm.styles";
import type { TAllFields, TFormConfigProps } from "./OutReachForm.types";
import { AllDefaultInputs } from "./UniversalForm";

const useFormField = (fieldName: TAllFields, type: string | undefined) => {
	const dispatch = useDispatch<AppDispatch>();

	const value = useSelector(
		(state: RootState) => state.outreachForm.fields[fieldName]
	);

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const target = e.target;
		const newValue =
			type === "checkbox"
				? (target as HTMLInputElement).checked
				: target.value;

		dispatch(updateField({ field: fieldName, value: newValue }));
	};

	return type === "checkbox"
		? {
				checked: value,
				onChange,
		  }
		: {
				value,
				onChange,
		  };
};
const _FormField: React.FC<TFormConfigProps<TAllFields>> = (config) => {
	const props = config;

	const { type, required, name: key } = props;

	const OtherProps = { ...useFormField(key, type), id: key };
	const FieldProps = { ...props, ...OtherProps } as any;
	const El =
		type === undefined ? (
			<textarea
				{...FieldProps}
				style={TextAreaStyle}
			/>
		) : type === "checkbox" ? (
			<input
				{...FieldProps}
				style={CheckboxInputStyle}
			/>
		) : type === "select" ? (
			<select
				{...FieldProps}
				style={InputBaseStyle}
			>
				{props.options.map((option) => (
					<option
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
		) : required === true ? (
			<input
				{...FieldProps}
				style={InputBaseStyle}
			/>
		) : (
			<input
				{...FieldProps}
				style={OptionalInputStyle}
			/>
		);

	return El;
};

const FormLabel: React.FC<{
	htmlFor: string;
	label: string;
	required?: boolean;
}> = ({ htmlFor, label, required }) => (
	<label
		htmlFor={htmlFor}
		style={LabelStyle}
	>
		{required && "*"}

		{label}
	</label>
);

const FormField: React.FC<TFormConfigProps<TAllFields>> = (config) => {
	const { name: key, label, description, required, type } = config;

	return (
		<>
			<div style={FormGroupStyle}>
				<FormLabel
					htmlFor={key}
					label={label}
					required={
						required && type != "checkbox" && type !== undefined
					}
				/>
				<_FormField {...config} />
				{description && (
					<label
						htmlFor={key}
						style={DescriptionStyle}
					>
						{description}
					</label>
				)}
			</div>
		</>
	);
};

const FormFields: React.FC<{ inputs?: TFormConfigProps<any>[] }> = ({
	inputs = AllDefaultInputs,
}) => (
	<>
		{inputs.map((field) => (
			<FormField
				key={field.name}
				{...field}
			/>
		))}
	</>
);

const FormContainer: React.FC<{ inputs?: TFormConfigProps<any>[] }> = ({
	inputs = AllDefaultInputs,
}) => {
	return (
		<form className="no-aos">
			<FormFields inputs={inputs} />
		</form>
	);
};

export { FormContainer };
