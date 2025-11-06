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
					setTimeLineData(data || [{}]);
				} else {
					setTimeLineData([{}]);
				}
			} catch (error) {
				console.error("Failed to fetch TimelineData address:", error);
			}
		};

		fetchTimelineData();
	}, []);
	return TimelineData;
};

export { useTimelineData };
