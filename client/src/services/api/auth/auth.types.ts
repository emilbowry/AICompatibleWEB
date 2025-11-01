interface IUserProfile {
	id: string;
	googleId: string;
	name: string;
	email: string;
	role: "admin" | "user";
}

interface IAuthState {
	user: IUserProfile | null;
	status: "idle" | "loading" | "authenticated" | "unauthenticated";
	error: string | null;
}

export type { IAuthState, IUserProfile };
