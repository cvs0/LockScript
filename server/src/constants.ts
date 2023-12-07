// MongoDB Configuration
/**
 * The MongoDB connection string used to connect to the database.
 * Retrieved from the environment variable DB_CONNECTION_STRING.
 * If not explicitly specified, it defaults to a local MongoDB instance with the database name 'password-manager'.
 * Adjust this value to connect to your MongoDB database, specifying the database's location and name.
 */
export const DB_CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/password-manager";

// CORS Configuration
/**
 * The CORS (Cross-Origin Resource Sharing) origin allowed for incoming requests.
 * Retrieved from the environment variable CORS_ORIGIN.
 * If not explicitly specified, it defaults to 'http://localhost:3000'.
 * Adjust this value based on your frontend application's address or the origin from which requests are expected.
 */
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Enable or disable credentials for CORS requests
export const CREDENTIALS: boolean = process.env.CREDENTIALS === 'true' || true;

// Cookie Configuration
/**
 * The domain to set for cookies, obtained from the environment variable COOKIE_DOMAIN.
 * If not explicitly specified, it defaults to 'localhost'.
 * Adjust this value based on your deployment environment.
 */
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost";

// Cookie Flags
// Flag indicating whether to apply the SameSite attribute to cookies
export const SAMESITE: boolean = process.env.SAMESITE === 'false' || false;

// Flag indicating whether to set the HttpOnly attribute for cookies
export const HTTPONLY: boolean = process.env.HTTPONLY === 'false' || false;

// Flag indicating whether to set the Secure attribute for cookies
export const SECURE: boolean = process.env.SECURE === 'false' || false;

// Flag indicating whether to sign cookies
export const SIGNED: boolean = process.env.SIGNED === 'false' || false;

// The name to be used for the cookie
export const COOKIE_NAME: string = process.env.COOKIE_NAME || 'token';

// Server Configuration
/**
 * Sets the current port for the server to listen on.
 */
export const PORT: number = 4000;

/**
 * Sets the current hostname for the server to listen on.
 * Defaults to '0.0.0.0' (bind to all available network interfaces) if not explicitly specified.
 * Binded to a single address for better security to prevent unintended access.
 */
export const HOST: string = process.env.HOST || "0.0.0.0";

// VaultModel Configuration
/**
 * Enables automatic timestamping for createdAt and updatedAt fields.
 * If set to true, the database will automatically manage timestamp fields for created and updated times.
 * Adjust this value based on whether you want the database to handle timestamping for your VaultModel.
 */
export const VAULT_TIMESTAMPS: boolean = process.env.VAULT_TIMESTAMPS === 'true' || true;

// UserModel Configuration
/**
 * Enables automatic timestamping for createdAt and updatedAt fields.
 * If set to true, the database will automatically manage timestamp fields for created and updated times.
 * Adjust this value based on whether you want the database to handle timestamping for your UserModel.
 */
export const USER_TIMESTAMPS: boolean = process.env.USER_TIMESTAMPS === 'true' || true;