import React from "react";
import { useSelector } from "react-redux";
import googleSVG from "../../assets/googleNeutral.svg";
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
const SignInButtons: React.FC<{ provider?: string }> = ({
	provider = "google",
}) => (
	<a
		href="/api/auth/google/login"
		style={GoogleSignInStyle}
	>
		<div style={GoogleSignInContentStyle}>
			{provider === "google" && <img src={googleSVG} />}Sign in with
			Google
		</div>
	</a>
);
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
				<SignInButtons />
			)}
		</div>
	);
};

export { AuthMenu };
