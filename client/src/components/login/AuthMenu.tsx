import React from "react";
import { useSelector } from "react-redux";
import {
	selectAuthStatus,
	selectUser,
} from "../../services/api/auth/auth.slice";
import {
	GoogleSignInContentStyle,
	GoogleSignInStyle,
	LoadingStyle,
	MenuStyle,
} from "./Login.styles";
import { LoginStatus } from "./LoginStatus";
import { LogOutButton } from "./LogOutButton";

const AuthMenu: React.FC = () => {
	const user = useSelector(selectUser);
	const status = useSelector(selectAuthStatus);

	return status === "loading" || status === "idle" ? (
		<div style={LoadingStyle}>Loading...</div>
	) : (
		<div style={MenuStyle}>
			{user ? (
				<>
					<LoginStatus />
					<LogOutButton />
				</>
			) : (
				<a
					href="/api/auth/google/login"
					style={GoogleSignInStyle}
				>
					<div style={GoogleSignInContentStyle}>
						Sign in with Google
					</div>
				</a>
			)}
		</div>
	);
};

export { AuthMenu };
