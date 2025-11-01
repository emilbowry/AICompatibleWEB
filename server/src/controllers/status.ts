// server/src/controllers/status.ts

import type { Request, Response } from "express";

const getStatus = (_req: Request, res: Response) => {
	res.json({ message: "Backend is running!", timestamp: new Date() });
};

export { getStatus };
