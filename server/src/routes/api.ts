// server/src/routes/api.ts

import { Router } from "express";
import { getStatus } from "../controllers/status.js";
import authRoutes from "./auth.js";
import stripeRoutes from "./stripe.js";
import utilRoutes from "./util.js";
const router = Router();

router.get("/status", getStatus);
router.use("/auth", authRoutes);
router.use("/", utilRoutes);
router.use("/", stripeRoutes);

export default router;
