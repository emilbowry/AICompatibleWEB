// client/src/services/api/ip.ts

import { useEffect, useState } from "react";

const useIP = () => {
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

const GEOLOCATION_API_URL = "http://ip-api.com/json/";

const useIPRegionGuess = (ip: string) => {
	const initialGuess =
		ip === "127.0.0.1" || ip === "::1"
			? "Localhost"
			: "determining region...";
	const [regionGuess, setRegionGuess] = useState<string>(initialGuess);

	useEffect(() => {
		const fetchRegion = async () => {
			try {
				const apiResponse = await fetch(`${GEOLOCATION_API_URL}${ip}`);

				if (!apiResponse.ok) {
					console.error(
						`Geolocation API HTTP Error: ${apiResponse.status} for IP ${ip}`
					);
					setRegionGuess("Unknown (API Fail)");
					return;
				}

				const geoData = await apiResponse.json();

				if (geoData.status === "success") {
					let guess = "Unknown";
					if (geoData.city && geoData.country) {
						guess = `${geoData.city}, ${geoData.country}`;
					} else if (geoData.country) {
						guess = geoData.country;
					} else if (geoData.regionName) {
						guess = geoData.regionName;
					}
					setRegionGuess(guess);
				} else {
					setRegionGuess(
						`Unknown (API Status: ${geoData.message || "Error"})`
					);
				}
			} catch (error) {
				console.error(
					`Geolocation Network/Parsing Error for IP ${ip}:`,
					error
				);
				setRegionGuess("Unknown (Network Error)");
			}
		};

		fetchRegion();
	}, [ip]);

	return regionGuess;
};
export { useIP, useIPRegionGuess };
