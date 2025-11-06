// server/src/controllers/ip.ts

import type { Request, Response } from "express";

// import type { Request, Response } from "express";
// // import { AdminPortal } from "../../ssr/adminrenderer.js";
// const getAdmin = (req: Request, res: Response) => {
// 	// const Admin = AdminPortal;
// 	// console.log("ADMIN");
// 	// console.log(Admin);
// 	// res.json({ Admin: "A" });
// 	const ip = req.ip;

// 	console.log(`other ${ip}`);
// 	res.json({ ip });
// };

// export { getAdmin };

const getIp = (req: Request, res: Response) => {
	const ip = req.ip;
	res.json({ ip });
};

export { getIp };
