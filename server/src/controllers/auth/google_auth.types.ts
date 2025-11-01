// server/src/controllers/auth/google_auth.types.ts

import { User } from "#prisma/client";
import { SessionData } from "express-session";

type TUserProfile = User;

interface IPrismaUserData extends SessionData {
	user?: TUserProfile;
}
export type { IPrismaUserData, TUserProfile };
