// client/src/components/login/auth.tsx

/**  @ignore this file */

/*
Auth Module – React + TypeScript (arrow‑function, fixed provider nesting)
-----------------------------------------------------------------------
Key change: **GoogleOAuthProvider now wraps the inner Auth logic**, so
`useGoogleLogin()` is called inside the provider context—fixing the
runtime error “Google OAuth components must be used within
GoogleOAuthProvider”.
*/

import {
	GoogleOAuthProvider,
	TokenResponse,
	googleLogout,
	useGoogleLogin,
} from "@react-oauth/google";
import React, {
	PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserProfile {
	id: string;
	name: string;
	email: string;
	picture?: string;
	provider: "google" | "apple";
}

interface AuthState {
	status: "idle" | "loading" | "authenticated" | "error";
	user: UserProfile | null;
	accessToken: string | null;
	error?: string;
}

interface AuthContextValue extends AuthState {
	loginWithGoogle: () => void;
	loginWithApple: () => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "demo-auth";

// ---------------------------------------------------------------------------
// Outer AuthProvider – supplies GoogleOAuthProvider
// ---------------------------------------------------------------------------
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// 2. Add a check to ensure it exists. This is the key!
if (!GOOGLE_CLIENT_ID) {
	throw new Error(
		"Missing Google Client ID. Please set GOOGLE_CLIENT_ID in your .env file."
	);
}
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => (
	<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
		<AuthProviderInner>{children}</AuthProviderInner>
	</GoogleOAuthProvider>
);

// ---------------------------------------------------------------------------
// Inner provider where useGoogleLogin() is now valid
// ---------------------------------------------------------------------------

const AuthProviderInner: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const navigate = useNavigate();
	const [state, setState] = useState<AuthState>(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved
			? JSON.parse(saved)
			: { status: "idle", user: null, accessToken: null };
	});

	// Persist any non-loading state to localStorage
	useEffect(() => {
		if (state.status !== "loading") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		}
	}, [state]);

	// Google popup flow (hook now safely inside GoogleOAuthProvider)
	const startGoogle = useGoogleLogin({
		onSuccess: async (token: TokenResponse) => {
			setState((p) => ({ ...p, status: "loading" }));
			try {
				const res = await fetch(
					"https://www.googleapis.com/oauth2/v3/userinfo",
					{
						headers: {
							Authorization: `Bearer ${token.access_token}`,
						},
					}
				);
				const profile = await res.json();
				const user: UserProfile = {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					picture: profile.picture,
					provider: "google",
				};
				setState({
					status: "authenticated",
					user,
					accessToken: token.access_token,
				});
				navigate("/");
			} catch (err) {
				setState({
					status: "error",
					user: null,
					accessToken: null,
					error: String(err),
				});
			}
		},
		onError: () =>
			setState({
				status: "error",
				user: null,
				accessToken: null,
				error: "Google login failed",
			}),
		scope: "profile email",
		flow: "implicit",
	});

	const loginWithApple = useCallback(() => {
		alert(
			"Apple login placeholder – will open Apple ID in a future iteration"
		);
	}, []);

	const logout = useCallback(() => {
		if (state.user?.provider === "google") googleLogout();
		setState({ status: "idle", user: null, accessToken: null });
		navigate("/login");
	}, [state.user]);

	const ctxValue: AuthContextValue = {
		...state,
		loginWithGoogle: startGoogle,
		loginWithApple,
		logout,
	};

	return (
		<AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextValue => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};

export const SocialLoginButtons: React.FC = () => {
	const { loginWithGoogle /* loginWithApple */ } = useAuth();
	return (
		<div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
			<button
				onClick={loginWithGoogle}
				className="flex items-center justify-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-50"
			>
				<img
					src="https://developers.google.com/identity/images/g-logo.png"
					alt="Google"
					className="w-5 h-5"
				/>
				<span>Continue with Google</span>
			</button>
			{/* <button
				onClick={loginWithApple}
				className="flex items-center justify-center gap-2 rounded-md bg-black text-white px-4 py-2 hover:bg-gray-800"
			>
				<svg
					className="w-5 h-5"
					viewBox="0 0 14 17"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="currentColor"
						d="M13.336 13.335c-.536 1.256-1.19 2.505-2.13 2.517-1.006.01-1.274-.666-2.384-.666-1.114 0-1.413.654-2.299.678-.935.027-1.66-1.147-2.366-2.467C2.368 10.403 1.88 6.71 3.6 4.735c.752-.83 1.933-1.365 3.138-1.385.899-.018 1.746.6 2.384.6.64 0 1.668-.738 2.806-.63.478.02 1.817.189 2.681 1.425-.07.047-1.601.94-1.273 2.827.323 1.855 1.916 2.47 1.964 2.49-.034.097-.31 1.088-1.04 2.188zM9.19.35C9.95-.42 10.988-.83 11.69-.83c.05.823-.264 1.648-.81 2.242-.53.575-1.393 1.02-2.216.96-.07-.805.324-1.63.995-2.322z"
					/>
				</svg>
				<span>Continue with Apple</span>
			</button> */}
		</div>
	);
};

export const OAuthCallbackRoute: React.FC = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	const { loginWithApple } = useAuth();

	useEffect(() => {
		const params = new URLSearchParams(search);
		if (params.get("provider") === "apple") {
			loginWithApple();
		}
		navigate("/");
	}, [search]);

	return (
		<div className="flex items-center justify-center h-screen">
			<p className="text-lg animate-pulse">Finishing sign-in…</p>
		</div>
	);
};

// ---------------------------------------------------------------------------
// AuthGuard
// ---------------------------------------------------------------------------

export const AuthGuard: React.FC<PropsWithChildren<{}>> = ({ children }) => {
	const { status } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (status === "idle") navigate("/login", { replace: true });
	}, [status]);

	if (status === "idle" || status === "loading") {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-lg animate-pulse">Loading…</p>
			</div>
		);
	}

	return <>{children}</>;
};

// ---------------------------------------------------------------------------
// (Optional) Example routing usage remains unchanged – see previous version
// ---------------------------------------------------------------------------
