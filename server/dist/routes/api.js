// server/src/routes/api.ts
import { Router } from "express";
import { getStatus } from "../controllers/status.js";
import authRoutes from "./auth.js";
import stripeRoutes from "./stripe.js";
import utilRoutes from "./util.js";
const router = Router();
router.get("/status", getStatus);
router.use("/auth", authRoutes);
router.use("/ip", utilRoutes);
router.use("/stripe/create-checkout-session", stripeRoutes);
export default router;
