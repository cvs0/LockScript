import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import logger from "./utils/logger";
import { connectToDb, disconnectFromDB } from "./utils/db";
import fs from "fs";
import path from "path";
import axios from "axios";

/**
 * Handles the graceful shutdown of the Fastify server.
 * @param {string} signal - The signal received for the shutdown.
 * @param {FastifyInstance} app - The Fastify server instance.
 */
async function gracefulShutdown(signal: string, app: FastifyInstance) {
  try {
    logger.info("Shutting down server gracefully.");
    logger.info(`Received signal ${signal}`);

    // Close the Fastify server and disconnect from the database.
    await app.close();
    await disconnectFromDB();

    logger.info("Shutdown.");
    // Exit the process with a successful status code.
    process.exit(0);
  } catch (error) {
    // Log an error if the graceful shutdown encounters an error and exit the process with an error status code.
    logger.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
}

async function fetchKeyFromUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching key from URL ${url}:`, error);
    process.exit(1);
  }
}

async function fetchKeyFromFile(filePath: string): Promise<string> {
  try {
    const keyContent = await fs.readFileSync(filePath, "utf-8");
    return keyContent;
  } catch (error) {
    logger.error(`Error reading key from file ${filePath}:`, error);
    process.exit(1);
  }
}

/**
 * Starts the Fastify server, listens on a specified port, and connects to the database.
 * @returns {FastifyInstance} - The Fastify server instance.
 */
async function startServer(): Promise<FastifyInstance> {
  try {
    const privateFilePath = path.join(process.cwd(), "certs", "private.key");
    const publicFilePath = path.join(process.cwd(), "certs", "public.key");

    const privateKeyContent = await fetchKeyFromFile(privateFilePath);
    const publicKeyContent = await fetchKeyFromFile(publicFilePath);

    if (privateKeyContent === publicKeyContent) {
      logger.error('The private and public RSA keys are the same. Please check your keys.');
      process.exit(1);
    }

    const app = createServer();
    const url = await app.listen(4000, "0.0.0.0");
    logger.info(`Server is ready at ${url}`);

    await connectToDb();
    return app;
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
}

/**
 * The main function that orchestrates the startup and shutdown of the Fastify server.
 */
async function main() {
  try {
    // Start the Fastify server.
    const app = await startServer();

    // Define the signals to handle for graceful shutdown.
    const signals = ["SIGTERM", "SIGINT"];

    // Attach signal handlers for graceful shutdown.
    for (const signal of signals) {
      process.on(signal, async () => {
        await gracefulShutdown(signal, app);
      });
    }
  } catch (error) {
    // Log an error if the main function encounters an error and exit the process with an error status code.
    logger.error("Error in main function:", error);
    process.exit(1);
  }
}

// Invoke the main function to start the application.
main();
