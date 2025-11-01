// server/src/types/user.types.ts

// interface SessionData {
// 		user?: IUserProfile; // Add our user property to the session data
// 	}

import type { SessionData } from "express-session";
interface IUserProfile {
	id: string;
	googleId: string;
	name: string;
	email: string;
	role: "admin" | "user";
}
interface UserSessionData extends SessionData {
	user?: IUserProfile;
}
export { IUserProfile, UserSessionData };
