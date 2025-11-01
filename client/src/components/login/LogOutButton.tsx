// client/src/components/login/LogOutButton.tsx
import { LogOut } from "lucide-react";
import React from "react";
import { useLogout } from "../../services/api/auth/auth";
import { ButtonStyle } from "./Login.styles";

const LogOutButton: React.FC = () => {
	const logout = useLogout();

	return (
		<button
			onClick={logout}
			style={ButtonStyle}
		>
			<LogOut size={16} />
			Logout
		</button>
	);
};

export { LogOutButton };
