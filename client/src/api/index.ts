import axios from "axios";

// Define the base URL for user-related API endpoints.
const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;

// Define the base URL for vault-related API endpoints.
const vaultBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/vault`;

/**
 * Sends a POST request to register a new user.
 * @param {Object} payload - The payload containing hashed password and email.
 * @param {string} payload.hashedPassword - The hashed password for the new user.
 * @param {string} payload.email - The email for the new user.
 * @returns {Promise<{ salt: string; vault: string }>} - A promise resolving to the response data.
 */
export function registerUser(payload: {
  hashedPassword: string;
  email: string;
}) {
  return axios
    .post<{ salt: string; vault: string }>(userBase, payload, {
      withCredentials: true,
    })
    .then((res) => res.data);
}

/**
 * Sends a POST request to log in a user.
 * @param {Object} payload - The payload containing hashed password and email for login.
 * @param {string} payload.hashedPassword - The hashed password for login.
 * @param {string} payload.email - The email for login.
 * @returns {Promise<{ salt: string; vault: string }>} - A promise resolving to the response data.
 */
export function loginUser(payload: { hashedPassword: string; email: string }) {
  return axios
    .post<{ salt: string; vault: string }>(`${userBase}/login`, payload, {
      withCredentials: true,
    })
    .then((res) => res.data);
}

/**
 * Sends a PUT request to save the user's vault.
 * @param {Object} params - Parameters for saving the vault.
 * @param {string} params.encryptedVault - The encrypted vault data to be saved.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
export function saveVault({ encryptedVault }: { encryptedVault: string }) {
  return axios
    .put(vaultBase, { encryptedVault }, { withCredentials: true })
    .then((res) => res.data);
}

export function deleteAccount(payload: { userId: string }) {
  const { userId } = payload;

  return axios
    .delete(`${userBase}/delete/${userId}`, {
      withCredentials: true,
    })
    .then((res) => res.data);
}
