// src/config/index.ts
import * as dotenv from "dotenv";
dotenv.config();
const serverURL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 7878}`;
const google_config = {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: `${serverURL}/api/auth/google/callback`,
};
const config = {
    port: parseInt(process.env.PORT || "7878", 10),
    isProduction: process.env.NODE_ENV === "production",
    clientURL: process.env.CLIENT_URL || "http://localhost:3000",
    serverURL,
    google: google_config,
};
export { config };
