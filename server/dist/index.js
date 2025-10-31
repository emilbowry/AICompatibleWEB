// AICompatibleWEB copy/server/src/index.ts
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import http from "http"; // Import the native http module
import path from "path";
import { fileURLToPath } from "url"; // Import for ESM __dirname equivalent
console.log("--- STARTING SERVER SETUP ---");
// Load environment variables from .env file
dotenv.config();
const app = express();
const PORT = process.env.PORT || 7878;
const isProduction = process.env.NODE_ENV === "production";
console.log(`PORT: ${PORT}, IsProduction: ${isProduction}`);
// --- Middleware Setup ---
app.use(express.json());
// 1. Configure CORS for Development
if (!isProduction) {
	app.use(
		cors({
			origin: "http://localhost:3000",
			credentials: true,
		})
	);
	console.log("CORS enabled for development (http://localhost:3000)");
}
// Basic API Route
app.get("/api/status", (_req, res) => {
	res.json({ message: "Backend is running!", timestamp: new Date() });
});
// --- Production Serving Setup ---
if (isProduction) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const buildPath = path.join(__dirname, "..", "..", "client", "dist");
	app.use(express.static(buildPath));
	console.log(`Serving static files from: ${buildPath}`);
	app.get("*", (_req, res) => {
		res.sendFile(path.join(buildPath, "index.html"));
	});
}
// Create an HTTP server from the Express app
const server = http.createServer(app);
// Add a specific error handler for EADDRINUSE
server.on("error", (e) => {
	if (e.code === "EADDRINUSE") {
		console.error(`Error: Port ${PORT} is already in use.`);
		console.error("Another server is likely running on the same port.");
		process.exit(1);
	} else {
		console.error("An unexpected server error occurred:", e);
		process.exit(1);
	}
});
// Use top-level await to start the server
try {
	await new Promise((resolve) => {
		server.listen(PORT, () => {
			console.log(
				`Server is running on http://localhost:${PORT} in ${
					isProduction ? "production" : "development"
				} mode`
			);
			console.log("--- SERVER IS LIVE AND LISTENING ---");
			resolve();
		});
	});
} catch (error) {
	console.error("Failed to start server:", error);
	process.exit(1);
}
