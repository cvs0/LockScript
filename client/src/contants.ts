/**
 * Constant representing the default page title.
 * Uses the value from the environment variable if available, otherwise defaults to "LockScript".
 */
export const PAGE_TITLE =
  process.env.PAGE_TITLE ||
  "LockScript";

/**
 * Constant representing the default page description.
 * Uses the value from the environment variable if available, otherwise defaults to "Best solution for password security."
 */
export const PAGE_DESCRIPTION = 
  process.env.PAGE_DESCRIPTION ||
  "Best solution for password security.";
