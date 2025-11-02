import { Router } from "express";
import { getIp } from "../controllers/util/ip.js";
const router = Router();
router.get("/ip", getIp);
export default router;
