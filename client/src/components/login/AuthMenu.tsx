import React from "react";
import { useSelector } from "react-redux";
import {
	selectAuthStatus,
	selectUser,
} from "../../services/api/auth/auth.slice";
import { LoginStatus } from "./LoginStatus";
import { LogOutButton } from "./LogOutButton";

const MenuStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "10px 20px",
	fontSize: "16px",
	cursor: "pointer",
	border: "1px solid #ccc",
	borderRadius: "4px",
	backgroundColor: "#f8f8f8",
	color: "#333",
	width: "200px",
	textAlign: "center",
};

const AuthMenu: React.FC = () => {
	const user = useSelector(selectUser);
	const authStatus = useSelector(selectAuthStatus);

	if (authStatus === "loading" || authStatus === "idle") {
		return (
			<div style={{ padding: "20px", minWidth: "200px" }}>Loading...</div>
		);
	}

	return (
		<div
			style={{
				padding: "20px",
				backgroundColor: "white",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "15px",
			}}
		>
			{user ? (
				<>
					<LoginStatus />
					<LogOutButton />
				</>
			) : (
				<a
					href="/api/auth/google/login"
					style={{ textDecoration: "none" }}
				>
					<div style={MenuStyle}>Sign in with Google</div>
				</a>
			)}
		</div>
	);
};

export { AuthMenu };
