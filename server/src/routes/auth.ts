// server/src/routes/auth.ts
import { Router } from "express";
import {
	googleCallback,
	googleLogin,
} from "../controllers/auth/google_auth.js";

const router = Router();

router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
