import { useContext } from "react";
import { useSelector } from "react-redux";
import { useDynamicLink } from "../../../hooks/DynamicLink";
import { useStripeCheckout } from "../../../services/api/stripe/stripe";
import { RootState } from "../../../store";
import { dark_midnight_green } from "../../../utils/defaultColours";
import { FormContext } from "../OutReachForm";
import { ButtonStyle } from "../OutReachForm.styles";

const useBookServiceCheckout = () => {
	const { initiateCheckout, isProcessing, error } = useStripeCheckout();

	const formFields = useSelector(
		(state: RootState) => state.outreachForm.fields
	);
	const { submitted } = useContext(FormContext);

	const handleInitiateCheckout = async (e: React.MouseEvent) => {
		e.preventDefault();

		if (!submitted || isProcessing) return;

		const payload = {
			serviceType: formFields.service_type || "consulting",
			participants: formFields.participants,
		};

		initiateCheckout(payload);
	};

	return { handleInitiateCheckout, isProcessing, error, submitted };
};
const CheckoutButton: React.FC = () => {
	const { handleInitiateCheckout, isProcessing, submitted } =
		useBookServiceCheckout();

	const link_props = useDynamicLink({
		style_args: ["2px"],

		StyleOverrides: {
			color: dark_midnight_green,
		},
	});

	const isDisabled = !submitted || isProcessing;

	return (
		<button
			disabled={isDisabled}
			style={ButtonStyle}
			onClick={handleInitiateCheckout}
		>
			<div {...(!isDisabled && link_props)}>
				{isProcessing ? "Processing..." : "Buy Now"}
			</div>
		</button>
	);
};

export { CheckoutButton };
