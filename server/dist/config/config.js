// src/config/index.ts
import * as dotenv from "dotenv";
dotenv.config();
const config = {
    port: parseInt(process.env.PORT || "7878", 10),
    isProduction: process.env.NODE_ENV === "production",
    clientURL: process.env.CLIENT_URL || "http://localhost:3000",
};
export { config };
