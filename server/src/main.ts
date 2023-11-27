import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import logger from "./utils/logger";
import { connectToDb, disconnectFromDB } from "./utils/db";

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

/**
 * Starts the Fastify server, listens on a specified port, and connects to the database.
 * @returns {FastifyInstance} - The Fastify server instance.
 */
async function startServer(): Promise<FastifyInstance> {
  try {
    // Create the Fastify server instance.
    const app = createServer();
    // Listen on the specified port and log the server's URL.
    const url = await app.listen(4000, "0.0.0.0");
    logger.info(`Server is ready at ${url}`);

    // Connect to the database.
    await connectToDb();
    return app;
  } catch (error) {
    // Log an error if starting the server encounters an error and exit the process with an error status code.
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
