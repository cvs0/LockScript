import logger from "../../utils/logger";
import { VaultModel } from "./vault.model";

/**
 * Creates a new vault entry in the database.
 * @param {Object} params - Parameters for creating a vault.
 * @param {string} params.user - The user associated with the vault.
 * @param {string} params.salt - The salt for the vault.
 * @returns {Promise<VaultModel>} - Promise resolving to the created vault document.
 * @throws {Error} - Throws an error if creating the vault fails.
 */
export async function createVault({ user, salt }: { user: string; salt: string }) {
  try {
    // Attempt to create a new vault entry in the database.
    const vault = await VaultModel.create({ user, salt });
    logger.info(`Vault created successfully for user: ${user}`);
    return vault;
  } catch (error) {
    // Log an error if creating the vault fails and throw an error.
    logger.error(`Error creating vault for user ${user}:`, error);
    throw new Error("Failed to create vault");
  }
}

/**
 * Updates the data property of a vault entry in the database.
 * @param {Object} params - Parameters for updating a vault.
 * @param {string} params.userId - The user associated with the vault.
 * @param {string} params.data - The new data to be stored in the vault.
 * @returns {Promise<boolean>} - Promise resolving to a boolean indicating whether the update was successful.
 * @throws {Error} - Throws an error if updating the vault fails.
 */
export async function updateVault({ userId, data }: { userId: string; data: string }): Promise<boolean> {
  try {
    // Attempt to update the data property of the vault associated with the user.
    const result = await VaultModel.updateOne({ user: userId }, { data });
    return result.modifiedCount > 0;
  } catch (error) {
    // Log an error if updating the vault fails and throw an error.
    logger.error(`Error updating vault for user ${userId}:`, error);
    throw new Error("Failed to update vault");
  }
}

/**
 * Finds a vault entry in the database based on the associated user.
 * @param {string} userId - The user associated with the vault.
 * @returns {Promise<VaultModel | null>} - Promise resolving to the found vault document or null if not found.
 * @throws {Error} - Throws an error if finding the vault fails.
 */
export async function findVaultByUser(userId: string) {
  try {
    // Attempt to find a vault entry in the database based on the associated user.
    const vault = await VaultModel.findOne({ user: userId });
    return vault;
  } catch (error) {
    // Log an error if finding the vault fails and throw an error.
    logger.error(`Error finding vault for user ${userId}:`, error);
    throw new Error("Failed to find vault");
  }
}
