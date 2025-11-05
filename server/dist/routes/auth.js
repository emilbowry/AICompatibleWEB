// server/src/routes/auth.ts
import { Router } from "express";
import { getRole } from "../controllers/auth/access_managment.js";
import { getCurrentUser, googleCallback, googleLogin, logout, } from "../controllers/auth/google_auth.js";
const router = Router();
router.get("/google/login", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/me", getCurrentUser);
router.post("/logout", logout);
router.get("/role", getRole);
export default router;
