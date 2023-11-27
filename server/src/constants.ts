// The MongoDB connection string, retrieved from the environment variable DB_CONNECTION_STRING.
// If not provided, defaults to a local MongoDB instance with the database name 'password-manager'.
export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/password-manager";

// The CORS origin allowed for requests, retrieved from the environment variable CORS_ORIGIN.
// If not provided, defaults to 'http://localhost:3000'.
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// The domain for cookies, retrieved from the environment variable COOKIE_DOMAIN.
// If not provided, defaults to 'localhost'.
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost";
