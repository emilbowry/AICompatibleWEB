// // server/src/controllers/data/timeline_data.ts

import type { Request, Response } from "express";
import { db } from "../../config/mongo.js";

interface TimelineEntry {
	date: string;
	content: string;
	icon?: string;
	image: string;
}

const getTimelineData = async (_req: Request, res: Response) => {
	try {
		const timelineCollection = db.collection<TimelineEntry>("timeline");
		const data = await timelineCollection
			.find()
			.sort({ sortKey: 1 })
			.toArray();

		res.json(data);
	} catch (error) {
		console.error("Error fetching timeline data:", error);
		res.status(500).json({ message: "An internal server error occurred." });
	}
};

export { getTimelineData /* addTimelineEntry */ };
