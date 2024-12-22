import { Db, MongoClient } from "mongodb";

let database: Db;

export const connectToMongo = async (): Promise<Db> => {
    if (!database) {
        try {
            const client = new MongoClient(process?.env?.MONGO_DB_URL ?? "");
            await client.connect();
            database = client.db("rxcrm"); // Replace with your database name
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            process.exit(1);
        }
    }
    return database;
};

