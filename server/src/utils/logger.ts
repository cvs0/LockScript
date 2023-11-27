import pino from "pino";

// Create a Pino logger instance with a pretty-printing transport.
const logger = pino({
  transport: {
    // Use the 'pino-pretty' transport for human-readable console output.
    target: "pino-pretty",

    options: {
      // Ignore the 'hostname' field when pretty-printing logs.
      ignore: "hostname",
    },
  },
});

// Export the logger instance as the default export for this module.
export default logger;
