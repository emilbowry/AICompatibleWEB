// client/src/services/api/ip.ts

import { useEffect, useState } from "react";

const useTimelineData = () => {
	const [TimelineData, setTimeLineData] = useState<any>([{}]);

	useEffect(() => {
		const fetchTimelineData = async () => {
			try {
				const response = await fetch("/api/data/timeline");
				if (response.ok) {
					const data = await response.json();
					console.log(data);
					setTimeLineData(data || [{}]);
				} else {
					setTimeLineData([{}]);
				}
			} catch (error) {
				console.error("Failed to fetch TimelineData address:", error);
				setTimeLineData([]);
			}
		};

		fetchTimelineData();
	}, []);
	return TimelineData;
};

export { useTimelineData };
