// AICompatibleWEB copy/server/src/index.ts
import cors from "cors";
import * as dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import http from "http";

console.log("--- STARTING API SERVER SETUP ---");

dotenv.config();

const app = express();
// CHANGE 1: The port now defaults to 7878 to match your Nginx config.
const PORT = process.env.PORT || 7878;
const isProduction = process.env.NODE_ENV === "production";

console.log(`PORT: ${PORT}, IsProduction: ${isProduction}`);

// --- Middleware Setup ---
app.use(express.json());

// In production, Nginx handles requests, so 'trust proxy' is still a good idea.
if (isProduction) {
	app.set("trust proxy", 1);
}

// In development, you still need CORS for webpack-dev-server
if (!isProduction) {
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		})
	);
	console.log("CORS enabled for development (http://localhost:3000)");
}

// --- API ROUTES ---
app.get("/api/status", (_req: Request, res: Response) => {
	res.json({ message: "Backend is running!", timestamp: new Date() });
});

app.get("/api/ip", (req: Request, res: Response) => {
	const ip = req.ip;
	console.log(`IP address request from: ${ip}`);
	res.json({ ip });
});

// CHANGE 2: The entire block for serving static files has been removed.
// Nginx is now responsible for this.

const server = http.createServer(app);

server.on("error", (e: NodeJS.ErrnoException) => {
	if (e.code === "EADDRINUSE") {
		console.error(`Error: Port ${PORT} is already in use.`);
		process.exit(1);
	} else {
		console.error("An unexpected server error occurred:", e);
		process.exit(1);
	}
});

try {
	await new Promise<void>((resolve) => {
		server.listen(PORT, () => {
			console.log(
				`API Server is running on http://localhost:${PORT} in ${
					isProduction ? "production" : "development"
				} mode`
			);
			resolve();
		});
	});
} catch (error) {
	console.error("Failed to start server:", error);
	process.exit(1);
}
