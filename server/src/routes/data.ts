import { Router } from "express";
import { getJourneyData } from "../controllers/data/journeydata.js";

const router = Router();
router.get("/journey_data", getJourneyData);
export default router;
