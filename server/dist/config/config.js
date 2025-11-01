// src/config/index.ts
import * as dotenv from "dotenv";
dotenv.config();
const google_config = {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: "http://localhost:7878/api/auth/google/callback",
};
const config = {
    port: parseInt(process.env.PORT || "7878", 10),
    isProduction: process.env.NODE_ENV === "production",
    clientURL: process.env.CLIENT_URL || "http://localhost:3000",
    google: google_config,
};
export { config };
