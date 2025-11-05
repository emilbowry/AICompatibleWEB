// server/src/controllers/auth/google_auth.types.ts

import { User } from "#prisma/client";
import { SessionData } from "express-session";

type TUserProfile = User;

interface IPrismaUserData extends SessionData {
	user?: TUserProfile;
}

type role = "admin" | "user";
interface IUserProfile {
	id: string;
	googleId: string;
	name: string;
	email: string;
	role: role[];
}
interface IUserSessionData extends SessionData {
	user?: IUserProfile;
}

export { IUserProfile, IUserSessionData };
export type { IPrismaUserData, TUserProfile };
