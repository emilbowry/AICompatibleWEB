import { Router } from "express";
import { getTimelineData } from "../controllers/data/timeline_data.js";
const router = Router();
router.get("/timeline", getTimelineData);
export default router;
