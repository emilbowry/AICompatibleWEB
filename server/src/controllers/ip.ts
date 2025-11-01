// server/src/controllers/ip.ts

import type { Request, Response } from "express";

const getIp = (req: Request, res: Response) => {
	const ip = req.ip;
	console.log(`IP address request from: ${ip}`);
	res.json({ ip });
};

export { getIp };
