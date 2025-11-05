import React from "react";
import googleSVG from "../../assets/googleNeutral.svg";
import { GoogleSignInContentStyle, GoogleSignInStyle } from "./Login.styles";
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

export { SignInButtons };
