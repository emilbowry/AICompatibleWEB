// client/src/components/login/LogOutButton.tsx
import { LogOut } from "lucide-react";
import React from "react";
import { useLogout } from "../../services/api/auth/auth";

const LogOutButton: React.FC = () => {
	const logout = useLogout();

	const buttonStyle: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "10px",
		cursor: "pointer",
		padding: "8px 16px",
		border: "1px solid #ccc",
		borderRadius: "4px",
		backgroundColor: "#f8f8f8",
		width: "200px",
		fontSize: "16px",
	};

	return (
		<button
			onClick={logout}
			style={buttonStyle}
		>
			<LogOut size={16} />
			Logout
		</button>
	);
};

export { LogOutButton };
