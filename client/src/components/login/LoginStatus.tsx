import React from "react";
import { useSelector } from "react-redux";
import {
	selectAuthStatus,
	selectUser,
} from "../../services/api/auth/auth.slice";
import { loginStyle } from "./Login.styles";

const LoginStatus: React.FC = () => {
	const user = useSelector(selectUser);
	const status = useSelector(selectAuthStatus);

	return (
		<div style={loginStyle(user)}>
			{status === "loading" || status === "idle"
				? `Checking status...`
				: user
				? `Logged in as: ${user.email}`
				: "Not Logged In"}
		</div>
	);
};

export { LoginStatus };
