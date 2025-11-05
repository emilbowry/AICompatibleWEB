import { Router } from "express";
import { getJourneyData } from "../controllers/data/journeydata.js";
import { getTimelineData } from "../controllers/data/timeline_data.js";
//
const router = Router();
router.get("/journey_data", getJourneyData);
router.get("/timeline", getTimelineData);
export default router;
