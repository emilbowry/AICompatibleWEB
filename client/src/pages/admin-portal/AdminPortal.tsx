import { useEffect, useState } from "react";
import { Page } from "../../features/page/Page";
import {
	dark_midnight_green,
	lighter_logo_blue,
} from "../../utils/defaultColours";
const ApiStatusChecker: React.FC = () => {
	const [status, setStatus] = useState("Checking backend connection...");
	const [color, setColor] = useState(dark_midnight_green);

	useEffect(() => {
		fetch("/api/status")
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setStatus(
					`Backend Status: ${data.message} (${data.timestamp})`
				);
				setColor(lighter_logo_blue); // Success color
			})
			.catch((error) => {
				console.error("Connection Error:", error);
				setStatus(
					`Backend Error: Could not connect or invalid response.`
				);
				setColor("red"); // Error color
			});
	}, []);

	const style: React.CSSProperties = {
		position: "fixed",
		top: "10vh",
		left: "50%",
		transform: "translateX(-50%)",
		padding: "10px 20px",
		background: color,
		color: "white",
		borderRadius: "5px",
		zIndex: 1000,
		textAlign: "center",
		fontWeight: "bold",
		fontSize: "1.2rem",
	};

	return (
		<div
			style={style}
			className="no-aos"
		>
			{status}
		</div>
	);
};

const AdminPortal: React.FC = () => (
	<div style={{ height: "500px", width: "500px", background: "red" }}>
		<h1 style={{ color: "black" }}>Hello Testing</h1>
		<ApiStatusChecker />
	</div>
);

const AdminPage = () => <Page page={AdminPortal} />;
export default AdminPage;
