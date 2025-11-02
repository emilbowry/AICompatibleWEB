import { IUserProfile } from "../../services/api/auth/auth.types";

const ButtonStyle: React.CSSProperties = {
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

const loginStyle = (user: IUserProfile | null): React.CSSProperties => ({
	backgroundColor: user ? "#d4edda" : "#f8d7da",
	color: user ? "#155724" : "#721c24",
	border: `1px solid ${user ? "#c3e6cb" : "#f5c6cb"}`,
	borderRadius: "5px",
	zIndex: 2000,
	fontSize: "16px",
});

const MenuStyle: React.CSSProperties = {
	padding: "20px",
	backgroundColor: "white",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "15px",
};

const GoogleSignInContentStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	// justifyContent: "center",
	justifyContent: "space-between",
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
const LoadingStyle: React.CSSProperties = {
	padding: "20px",
	minWidth: "200px",
};
const GoogleSignInStyle: React.CSSProperties = { textDecoration: "none" };
export {
	ButtonStyle,
	GoogleSignInContentStyle,
	GoogleSignInStyle,
	LoadingStyle,
	loginStyle,
	MenuStyle,
};
