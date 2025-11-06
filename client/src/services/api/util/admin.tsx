import { useEffect, useState } from "react";

const useAdmin = () => {
	const [admin, setAdmin] = useState<React.ReactNode>(null);

	useEffect(() => {
		const fetchAdmin = async () => {
			try {
				const response = await fetch("/admin");
				if (response.ok) {
					const data = await response.json();
					setAdmin(data.admin || null);
				} else {
					console.error("Failed to fetch admin");
				}
			} catch (error) {
				console.error("Failed to fetch admin", error);
			}
		};

		fetchAdmin();
	}, []);
	return admin;
};
export { useAdmin };
