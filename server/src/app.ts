// // server/src/app.ts

// import cors from "cors";
// import express from "express";
// import { config } from "./config/config.js";
// import apiRoutes from "./routes/api.js";

// const app = express();

// app.use(express.json());

// if (config.isProduction) {
// 	app.set("trust proxy", 1);
// }

// if (!config.isProduction) {
// 	app.use(
// 		cors({
// 			origin: config.clientURL,
// 			credentials: true,
// 		})
// 	);
// 	console.log(`CORS enabled for development (${config.clientURL})`);
// }

// app.use("/api", apiRoutes);

// export default app;
// server/src/app.ts

import cors from "cors";
import express from "express";
import { config } from "./config/config.js";
import apiRoutes from "./routes/api.js";

const app = express();

app.use(express.json());

app.set("trust proxy", 1);

const corsOptions = {
	origin: config.isProduction ? "https://emilbowry.com" : config.clientURL,
	credentials: true,
};

app.use(cors(corsOptions));

console.log(
	`CORS enabled for: ${
		Array.isArray(corsOptions.origin)
			? corsOptions.origin.join(", ")
			: corsOptions.origin
	}`
);

app.use("/api", apiRoutes);

export default app;
