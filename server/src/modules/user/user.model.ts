import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import argon2 from "argon2";
import { USER_TIMESTAMPS } from "../../constants";

/**
 * Middleware function to hash the user's password before saving or updating the user document.
 * Uses Argon2 for password hashing.
 * @param {Function} next - The next function in the middleware chain.
 */
@pre<User>("save", async function (next) {
  // Check if the password is modified or it's a new user.
  if (this.isModified("password") || this.isNew) {
    // Hash the password using Argon2.
    const hash = await argon2.hash(this.password);

    // Update the user's password with the hashed value.
    this.password = hash;

    // Call the next function in the middleware chain.
    return next();
  }
})
export class User {
  // Define a property 'email' that is required and must be unique.
  @prop({ required: true, unique: true })
  email: string;

  // Define a property 'password' that is required.
  @prop({ required: true })
  password: string;
}

// Create the UserModel using the User class and additional schema options.
export const UserModel = getModelForClass(User, {
  schemaOptions: {
    // Enable automatic timestamping for createdAt and updatedAt fields.
    timestamps: USER_TIMESTAMPS,
  },
});
