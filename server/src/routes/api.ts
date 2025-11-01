// server/src/routes/api.ts

import { Router } from "express";
import { getIp } from "../controllers/ip.js";
import { getStatus } from "../controllers/status.js";
import authRoutes from "./auth.js"; // 1. Import the new auth routes
const router = Router();

router.get("/status", getStatus);
router.get("/ip", getIp);
router.use("/auth", authRoutes);
export default router;
