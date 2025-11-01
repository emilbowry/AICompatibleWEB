import cors from "cors";
import express from "express";
import session from "express-session";
import { config } from "./config/config.js";
import { sessionConfig } from "./config/session.js";
import apiRoutes from "./routes/api.js";
const app = express();
app.use(express.json());
app.set("trust proxy", 1);
app.use(session(sessionConfig));
const corsOptions = {
    origin: config.isProduction ? "https://emilbowry.com" : config.clientURL,
    credentials: true,
};
app.use(cors(corsOptions));
console.log(`CORS enabled for: ${Array.isArray(corsOptions.origin)
    ? corsOptions.origin.join(", ")
    : corsOptions.origin}`);
app.use("/api", apiRoutes);
export default app;
