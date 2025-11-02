import { Router } from "express";

import { createCheckoutSession } from "../controllers/stripe/checkout.js";
const router = Router();
router.post("/stripe/create-checkout-session", createCheckoutSession);
export default router;
