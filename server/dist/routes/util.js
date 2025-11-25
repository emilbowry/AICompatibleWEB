import { Router } from "express";
// import { getAdmin } from "../controllers/util/admin.js";
import { getIp } from "../controllers/util/ip.js";
const router = Router();
router.get("/ip", getIp);
// router.get("/admin", getAdmin);
export default router;
