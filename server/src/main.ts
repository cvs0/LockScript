import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import logger from "./utils/logger";
import { connectToDb, disconnectFromDB } from "./utils/db";

function gracefulShutdown(signal: string, app: FastifyInstance) {
  process.on(signal, async () => {
    try {
      logger.info("Shutting down server gracefully.");
      logger.info(`Received signal ${signal}`);

      await app.close();
      await disconnectFromDB();

      logger.info("Shutdown.");
      process.exit(0);
    } catch (error) {
      logger.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  });
}

async function startServer() {
  const app = createServer();

  try {
    const url = await app.listen(4000, "0.0.0.0");
    logger.info(`Server is ready at ${url}`);

    await connectToDb();
    return app;
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
}

async function main() {
  const app = await startServer();

  const signals = ["SIGTERM", "SIGINT"];

  for (const signal of signals) {
    gracefulShutdown(signal, app);
  }
}

main();
