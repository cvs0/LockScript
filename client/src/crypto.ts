import pbkdf2 from "crypto-js/pbkdf2";
import { AES, enc } from "crypto-js";
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';

const hashAsync = promisify(bcrypt.hash);

const saltRounds = 15;

/**
 * Hashes a password using bcrypt with enhanced security settings.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 * @throws {Error} - Throws an error if the hashing process fails.
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await hashAsync(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    // Handle hash failure
    throw new Error('Error hashing password');
  }
}

/**
 * Generates a vault key using PBKDF2 based on the user's email, hashed password, and salt.
 * @param {Object} params - Parameters for generating the vault key.
 * @param {string} params.email - The user's email.
 * @param {string} params.hashedPassword - The hashed password.
 * @param {string} params.salt - The salt for the PBKDF2 function.
 * @returns {string} - The generated vault key.
 */
export function generateVaultKey({
  email,
  hashedPassword,
  salt,
}: {
  email: string;
  hashedPassword: string;
  salt: string;
}) {
  return pbkdf2(`${email}:${hashedPassword}`, salt, {
    keySize: 32,
  }).toString();
}

/**
 * Decrypts the vault using the provided vault key.
 * @param {Object} params - Parameters for decrypting the vault.
 * @param {string} params.vaultKey - The vault key used for decryption.
 * @param {string} params.vault - The vault to be decrypted.
 * @returns {string | null} - The decrypted vault or null if decryption fails.
 */
export function decryptVault({
  vaultKey,
  vault,
}: {
  vaultKey: string;
  vault: string;
}) {
  // Decrypt the vault using the vault key.
  const bytes = AES.decrypt(vault, vaultKey);
  const decrypted = bytes.toString(enc.Utf8);

  // Attempt to parse the decrypted data as JSON and extract the 'vault' property.
  try {
    return JSON.parse(decrypted).vault;
  } catch (e) {
    // Return null if parsing fails.
    return null;
  }
}

/**
 * Encrypts the vault using the provided vault key.
 * @param {Object} params - Parameters for encrypting the vault.
 * @param {string} params.vaultKey - The vault key used for encryption.
 * @param {string} params.vault - The vault to be encrypted.
 * @returns {string} - The encrypted vault.
 */
export function encryptVault({
  vaultKey,
  vault,
}: {
  vaultKey: string;
  vault: string;
}) {
  // Encrypt the vault using the vault key.
  return AES.encrypt(vault, vaultKey).toString();
}
