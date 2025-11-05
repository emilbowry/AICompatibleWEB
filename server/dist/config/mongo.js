// server/src/config/mongo.ts
import { MongoClient } from "mongodb";
import { config } from "./config.js";
import { TimelineData } from "./config_data/journey_defaults.js";
const mongoUri = config.mongo.mongoUri;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables. Please check your .env file.");
}
const client = new MongoClient(mongoUri, {});
let db;
const connectToMongo = async () => {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB.");
        db = client.db();
    }
    catch (error) {
        console.error("Failed to connect to MongoDB. The application will exit.", error);
        process.exit(1);
    }
};
const seedDatabase = async () => {
    if (!db) {
        console.error("Database not connected. Cannot seed.");
        return;
    }
    try {
        const timelineCollection = db.collection("timeline");
        const count = await timelineCollection.countDocuments();
        if (count === 0) {
            console.log("'timeline' collection is empty. Seeding with initial data...");
            await timelineCollection.insertMany(TimelineData);
            console.log("Database seeded successfully.");
        }
        else {
            console.log("'timeline' collection already contains data. Skipping seed.");
        }
    }
    catch (error) {
        console.error("Failed to seed database:", error);
    }
};
export { connectToMongo, db, seedDatabase };
