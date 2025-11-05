// // server/src/controllers/data/timeline_data.ts
import { db } from "../../config/mongo.js";
const getTimelineData = async (_req, res) => {
    try {
        const timelineCollection = db.collection("timeline");
        const data = await timelineCollection
            .find()
            .sort({ sortKey: 1 })
            .toArray();
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching timeline data:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
};
export { getTimelineData /* addTimelineEntry */ };
