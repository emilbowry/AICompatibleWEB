// server/src/controllers/auth/google_auth.types.ts

import { User } from "#prisma/client";
import { SessionData } from "express-session";

type TUserProfile = User;

interface IPrismaUserData extends SessionData {
	user?: TUserProfile;
}

interface IUserProfile {
	id: string;
	googleId: string;
	name: string;
	email: string;
	role: "admin" | "user";
}
interface IUserSessionData extends SessionData {
	user?: IUserProfile;
}

export { IUserProfile, IUserSessionData };
export type { IPrismaUserData, TUserProfile };
