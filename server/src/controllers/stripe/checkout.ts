// server/src/controllers/stripe/checkout.ts
import type { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../../config/config.js";

import { IPrismaUserData } from "../auth/google_auth.types.js";
import {
	BASE_PRICES_CENTS,
	CANCEL_URL_PATH,
	SUCCESS_URL_PATH,
} from "./checkout.consts.js";

const calculatePrice = (serviceType: string, participants: number): number => {
	const basePrice = BASE_PRICES_CENTS[serviceType] || 0;

	return basePrice * participants;
};

const stripe = new Stripe(config.stripeSecretKey);

interface CheckoutRequestBody {
	serviceType: string;
	participants: number;
}

const createCheckoutSession = async (req: Request, res: Response) => {
	const sessionUser = (req.session as IPrismaUserData).user;

	const clientRefId = sessionUser?.id ?? "ANONYMOUS";

	const sessionId = req.session.id;

	const { serviceType, participants } = req.body as CheckoutRequestBody;
	const participantsNum = Number(participants);

	try {
		const totalAmountCents = calculatePrice(serviceType, participantsNum);

		if (totalAmountCents === 0) {
			return res
				.status(400)
				.json({ error: "Invalid service type or price." });
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",

			line_items: [
				{
					price_data: {
						currency: "gbp",
						product_data: {
							name: `Booking: ${serviceType
								.replace("_", " ")
								.toUpperCase()}`,
							description: `Consultancy/Training session for ${participantsNum} participant(s).`,
						},
						unit_amount: totalAmountCents,
					},
					quantity: 1,
				},
			],

			success_url: `${config.clientURL}${SUCCESS_URL_PATH}?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${config.clientURL}${CANCEL_URL_PATH}`,

			client_reference_id:
				clientRefId === "ANONYMOUS" ? sessionId : clientRefId,
			metadata: {
				user_id: clientRefId,
				express_session_id: sessionId,
				serviceType: serviceType,
				participants: participantsNum,
			},
		});

		return res.status(200).json({ url: session.url });
	} catch (error) {
		console.error("Error creating Stripe Checkout Session:", error);
		return res.status(500).json({
			error:
				error instanceof Error
					? error.message
					: "Failed to create checkout session",
		});
	}
};
export { createCheckoutSession };
