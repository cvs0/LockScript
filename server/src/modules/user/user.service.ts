import { UserModel } from "./user.model";
import crypto from "crypto";
import argon2 from "argon2";
import { Types } from "mongoose";

/**
 * Generates a random salt for password hashing.
 * @returns {string} - Randomly generated salt.
 */
export function generateSalt() {
  return crypto.randomBytes(64).toString("hex");
}

/**
 * Creates a new user with the provided hashed password and email.
 * @param {Object} input - User input containing hashed password and email.
 * @param {string} input.hashedPassword - Hashed password of the user.
 * @param {string} input.email - Email of the user.
 * @returns {Promise<UserModel>} - Promise resolving to the created user.
 */
export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    password: input.hashedPassword,
  });
}

/**
 * Generates a hash for the provided password using Argon2.
 * @param {string} password - Password to be hashed.
 * @returns {Promise<string>} - Promise resolving to the hashed password.
 */
async function genHash(password: string) {
  return argon2.hash(password);
}

interface UserCredentials {
  email: string;
  hashedPassword: string;
}

/**
 * Finds a user by email and verifies the provided hashed password.
 * @param {Object} credentials - User credentials.
 * @param {string} credentials.email - Email of the user.
 * @param {string} credentials.hashedPassword - Hashed password to be verified.
 * @returns {Promise<UserModel>} - Promise resolving to the found and verified user.
 * @throws {Error} - Throws an error if the user is not found or credentials are invalid.
 */
export async function findUserByEmailAndPassword({
  email,
  hashedPassword,
}: UserCredentials) {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await argon2.verify(user.password, hashedPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials.");
    }

    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Internal server error");
  }
}
