// server/src/server.ts
import http from "http";
import app from "./app.js";
import { config } from "./config/config.js";
console.log("--- STARTING API SERVER ---");
const server = http.createServer(app);
server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
        console.error(`Error: Port ${config.port} is already in use.`);
        process.exit(1);
    }
    else {
        console.error("An unexpected server error occurred:", e);
        process.exit(1);
    }
});
try {
    await new Promise((resolve) => {
        server.listen(config.port, "127.0.0.1", () => {
            console.log(`API Server is running on http://127.0.0.1:${config.port} in ${config.isProduction ? "production" : "development"} mode`);
            resolve();
        });
    });
}
catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
}
