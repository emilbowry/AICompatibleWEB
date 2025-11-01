// client/src/services/api/stripe/stripe.ts
import { useState } from "react";

// Define the expected structure of the checkout payload
interface CheckoutPayload {
	serviceType: string;
	participants: any; // Type comes from Redux state (string or number)
}

/**
 * Custom hook to manage the Stripe checkout process.
 * Returns the processing state and a function to initiate checkout.
 */
export const useStripeCheckout = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const initiateCheckout = async (payload: CheckoutPayload) => {
		if (isProcessing) return;

		setIsProcessing(true);
		setError(null);

		try {
			// 1. Make the POST request to the backend
			const response = await fetch(
				"/api/stripe/create-checkout-session",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
					credentials: "include", // CRUCIAL for sending the session cookie
				}
			);

			const data = await response.json();

			if (!response.ok) {
				// If the backend returns a 401 or 400, handle the error
				const errorMessage =
					data.error || "Failed to initiate Stripe session.";
				setError(errorMessage);
				throw new Error(errorMessage);
			}

			// 2. Redirect the user to the Stripe-hosted URL
			window.location.href = data.url;

			// Note: setIsProcessing(false) is not needed on success because the user navigates away.
		} catch (err) {
			console.error("Checkout Error:", err);
			// Alert the user and stop processing
			alert(
				`Error initiating checkout. Please try again. Details: ${error}`
			);
			setIsProcessing(false);
			// The error state is already set above if the response failed.
		}
	};

	return { initiateCheckout, isProcessing, error };
};
