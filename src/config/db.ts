import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection is successful.
 * @throws {Error} - If the connection fails.
 *
 * @example
 * await connectToMongoDB("mongodb://localhost:27017/mydatabase");
 * console.log("Connected to MongoDB");
 */
export async function connectToMongoDB(): Promise<void> {
    try {
        await mongoose.connect(process?.env?.MONGO_DB_URL ?? "");
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
}
