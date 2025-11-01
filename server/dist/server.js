// // server/src/server.ts
// import http from "http";
// import app from "./app.js";
// import { config } from "./config/config.js";
// console.log("--- STARTING API SERVER ---");
// const server = http.createServer(app);
// server.on("error", (e: NodeJS.ErrnoException) => {
// 	if (e.code === "EADDRINUSE") {
// 		console.error(`Error: Port ${config.port} is already in use.`);
// 		process.exit(1);
// 	} else {
// 		console.error("An unexpected server error occurred:", e);
// 		process.exit(1);
// 	}
// });
// try {
// 	await new Promise<void>((resolve) => {
// 		// server.listen(config.port, () => {
// 		// 	console.log(
// 		// 		`🚀 API Server is running on http://localhost:${
// 		// 			config.port
// 		// 		} in ${config.isProduction ? "production" : "development"} mode`
// 		// 	);
// 		// 	resolve();
// 		// });
// 		server.listen(config.port, "127.0.0.1", () => {
// 			console.log(
// 				`🚀 API Server is running on http://127.0.0.1:${
// 					// Also updated log for clarity
// 					config.port
// 				} in ${config.isProduction ? "production" : "development"} mode`
// 			);
// 			resolve();
// 		});
// 	});
// } catch (error) {
// 	console.error("Failed to start server:", error);
// 	process.exit(1);
// }
// server/src/index.ts
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
console.log("--- STARTING API SERVER SETUP ---");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 7878;
const isProduction = process.env.NODE_ENV === "production";
console.log(`PORT: ${PORT}, IsProduction: ${isProduction}`);
app.use(express.json());
if (isProduction) {
    app.set("trust proxy", 1);
}
if (!isProduction) {
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));
    console.log("CORS enabled for development (http://localhost:3000)");
}
app.get("/api/status", (_req, res) => {
    res.json({ message: "Backend is running!", timestamp: new Date() });
});
app.get("/api/ip", (req, res) => {
    const ip = req.ip;
    console.log(`IP address request from: ${ip}`);
    res.json({ ip });
});
const server = http.createServer(app);
server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
        console.error(`Error: Port ${PORT} is already in use.`);
        process.exit(1);
    }
    else {
        console.error("An unexpected server error occurred:", e);
        process.exit(1);
    }
});
try {
    await new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`API Server is running on http://localhost:${PORT} in ${isProduction ? "production" : "development"} mode`);
            resolve();
        });
    });
}
catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
}
