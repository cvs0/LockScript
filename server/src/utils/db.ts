import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "../constants";
import logger from "./logger";

/**
 * Connects to the MongoDB database using the specified connection string.
 * Logs an error and exits the process with an error status code if the connection fails.
 */
export async function connectToDb() {
  try {
    // Attempt to connect to the MongoDB database using the provided connection string.
    await mongoose.connect(DB_CONNECTION_STRING);
  } catch (e) {
    // Log an error and exit the process with an error status code if the connection attempt fails.
    logger.error(e, "Error connecting to the database");
    process.exit(1);
  }
}

/**
 * Disconnects from the MongoDB database.
 * Logs an info message indicating successful disconnection.
 */
export async function disconnectFromDB() {
  // Close the connection to the MongoDB database.
  await mongoose.connection.close();

  // Log an info message indicating successful disconnection.
  logger.info("Disconnected from the database");

  // Return from the function.
  return;
}
