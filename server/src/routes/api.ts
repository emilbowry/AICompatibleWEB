// server/src/routes/api.ts

import { Router } from "express";
import { getIp } from "../controllers/ip.js";
import { getStatus } from "../controllers/status.js";
const router = Router();

router.get("/status", getStatus);
router.get("/ip", getIp);

export default router;
