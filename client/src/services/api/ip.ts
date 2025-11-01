// client/src/services/api/ip.ts

import { useEffect, useState } from "react";

export const useIP = () => {
	const [ip, setIp] = useState<string>("fetching...");

	useEffect(() => {
		const fetchIp = async () => {
			try {
				const response = await fetch("/api/ip");
				if (response.ok) {
					const data = await response.json();
					setIp(data.ip || "not_found");
				} else {
					setIp("error_response");
				}
			} catch (error) {
				console.error("Failed to fetch IP address:", error);
				setIp("error_fetching");
			}
		};

		fetchIp();
	}, []);
	return ip;
};
