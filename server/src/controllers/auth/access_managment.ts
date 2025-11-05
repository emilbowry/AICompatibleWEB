import type { Request, Response } from "express";
import { config } from "../../config/config.js";
import { IUserSessionData } from "./google_auth.types.js";

const getRole = (req: Request, res: Response) => {
	const user = (req.session as IUserSessionData).user;
	if (!user) {
		res.json({ roles: ["DEFAULT"] });
	} else if (user.email === config.owner_email) {
		res.json({ roles: ["ADMIN"] });
	} else {
		res.json({ roles: user.role });
	}
};
export { getRole };
