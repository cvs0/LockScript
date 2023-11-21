import { UserModel } from "./user.model";
import crypto from "crypto";
import argon2 from "argon2";

// generate salt
export function generateSalt() {
  return crypto.randomBytes(64).toString("hex");
}

// create user

export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create({
    email: input.email,
    password: input.hashedPassword,
  });
}

async function genHash(password: string) {
  return argon2.hash(password);
}

interface UserCredentials {
  email: string;
  hashedPassword: string;
}

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