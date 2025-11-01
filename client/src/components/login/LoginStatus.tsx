import React from "react";
import { useSelector } from "react-redux";
import {
	selectAuthStatus,
	selectUser,
} from "../../services/api/auth/auth.slice";

const LoginStatus: React.FC = () => {
	const user = useSelector(selectUser);
	const status = useSelector(selectAuthStatus);

	const style: React.CSSProperties = {
		backgroundColor: user ? "#d4edda" : "#f8d7da", // Green if logged in, red if not
		color: user ? "#155724" : "#721c24",
		border: `1px solid ${user ? "#c3e6cb" : "#f5c6cb"}`,
		borderRadius: "5px",
		zIndex: 2000, // Make sure it's on top of everything
		fontSize: "16px",
	};

	if (status === "loading" || status === "idle") {
		return <div style={style}>Checking status...</div>;
	}

	return (
		<div style={style}>
			{user ? `Logged in as: ${user.email}` : "Not Logged In"}
		</div>
	);
};

export { LoginStatus };
