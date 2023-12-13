import pbkdf2 from "crypto-js/pbkdf2";
import { AES, enc, lib } from "crypto-js";
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';
import * as crypto from 'crypto';

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
  const keySize = 32;
  const iterations = 10000;

  const keyBuffer = crypto.pbkdf2Sync(`${email}:${hashedPassword}`, salt, iterations, keySize, 'sha512');
  const key = enc.Hex.parse(keyBuffer.toString('hex'));

  return pbkdf2(key, salt, {
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
  const hexIv = vault.substr(0, 32);
  const cipherText = vault.substr(32);

  const bytes = AES.decrypt(cipherText, vaultKey, {
    iv: lib.WordArray.create(Buffer.from(hexIv, 'hex') as any),
    format: 'hex' as any,
  });

  const decrypted = bytes.toString(enc.Utf8);

  try {
    return JSON.parse(decrypted).vault;
  } catch (e) {
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
  const iv = enc.Hex.parse(crypto.randomBytes(16).toString('hex'));
  const cipherParams = AES.encrypt(vault, vaultKey, { iv });
  
  if (!cipherParams) {
    throw new Error('Encryption failed');
  }

  const encryptedText = enc.Hex.stringify(iv) + cipherParams.ciphertext.toString(enc.Hex);
  return encryptedText;
}