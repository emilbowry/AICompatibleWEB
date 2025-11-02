// client/src/services/api/stripe/stripe.ts
import { useState } from "react";
import { ICheckoutPayload } from "./stripe.types";

const useStripeCheckout = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const initiateCheckout = async (payload: ICheckoutPayload) => {
		if (isProcessing) return;

		setIsProcessing(true);
		setError(null);

		try {
			const response = await fetch(
				"/api/stripe/create-checkout-session",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					credentials: "include",
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const errorMessage =
					data.error || "Failed to initiate Stripe session.";
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			window.location.href = data.url;
		} catch (err) {
			console.error("Checkout Error:", err);
			alert(
				`Error initiating checkout. Please try again. Details: ${error}`
			);
			setIsProcessing(false);
		}
	};

	return { initiateCheckout, isProcessing, error };
};

export { useStripeCheckout };
