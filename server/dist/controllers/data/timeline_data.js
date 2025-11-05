// // server/src/controllers/data/timeline_data.ts
import { db } from "../../config/mongo.js";
const getTimelineData = async (_req, res) => {
    try {
        const timelineCollection = db.collection("timeline");
        const data = await timelineCollection
            .find()
            .sort({ date: 1 })
            .toArray();
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching timeline data:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
};
// const addTimelineEntry = async (req: Request, res: Response) => {
// 	try {
// 		const timelineCollection = db.collection<TimelineEntry>("timeline");
// 		const newEntry = req.body;
// 		if (!newEntry || !newEntry.date || !newEntry.content) {
// 			return res.status(400).json({
// 				message: "Invalid data. 'date' and 'content' are required.",
// 			});
// 		}
// 		const result = await timelineCollection.insertOne(newEntry);
// 		return res.status(201).json(result);
// 	} catch (error) {
// 		console.error("Error adding timeline entry:", error);
// 		return res
// 			.status(500)
// 			.json({ message: "An internal server error occurred." });
// 	}
// };
export { getTimelineData /* addTimelineEntry */ };
