import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "../constants";
import logger from "./logger";

export async function connectToDb() {
    try {

        await mongoose.connect(DB_CONNECTION_STRING)
    } catch(e) {
        logger.error("Error connecting to database.");
        process.exit(1);
    }
}

export async function disconnectFromDb() {
    await mongoose.connection.close();

    logger.info("Disconnected from db.");

    return;
}