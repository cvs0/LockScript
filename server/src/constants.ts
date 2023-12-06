/**
 * The MongoDB connection string used to connect to the database.
 * Retrieved from the environment variable DB_CONNECTION_STRING.
 * If not explicitly specified, it defaults to a local MongoDB instance with the database name 'password-manager'.
 * Adjust this value to connect to your MongoDB database, specifying the database's location and name.
 */
export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/password-manager";


/**
 * The CORS (Cross-Origin Resource Sharing) origin allowed for incoming requests.
 * Retrieved from the environment variable CORS_ORIGIN.
 * If not explicitly specified, it defaults to 'http://localhost:3000'.
 * Adjust this value based on your frontend application's address or the origin from which requests are expected.
 */
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

/**
 * The domain to set for cookies, obtained from the environment variable COOKIE_DOMAIN.
 * If not explicitly specified, it defaults to 'localhost'.
 * Adjust this value based on your deployment environment.
 */
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost";

/**
 * Enable SECURE mode only in production environments, such as the final product where Transport Layer Security (TLS) is implemented.
 * SECURE mode enhances security measures and should be activated specifically in environments that support TLS, ensuring a secure communication channel.
 * This setting is designed for use in the production version of the application to safeguard sensitive information.
 * To enable SECURE mode, set the SECURE environment variable to 'true'. During development or non-production use, SECURE mode should be disabled..
 */
export const SECURE: boolean = process.env.SECURE === 'true' || false;

/**
 * Sets the current port for the server to listen on.
 * This variable will be applied when the server is created.
 */
export const PORT: number = 4000;

/**
 * Sets the current hostname for the server to listen on.
 * It is localhost, but binded to a single address for better security to prevent unintended access.
 */
export const HOST: string = process.env.HOST || "0.0.0.0";