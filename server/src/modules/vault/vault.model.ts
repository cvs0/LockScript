import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "../user/user.model";
import { VAULT_TIMESTAMPS } from "../../constants";

// Define the Vault class, representing the structure of a vault document in the database.
export class Vault {
  // Define a property 'user' that is required and references the User model.
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  // Define a property 'data' with a default value of an empty string.
  @prop({ default: "" })
  data: string;

  // Define a property 'salt' that is required.
  @prop({ required: true })
  salt: string;
}

// Create the VaultModel using the Vault class and additional schema options.
export const VaultModel = getModelForClass(Vault, {
  schemaOptions: {
    timestamps: VAULT_TIMESTAMPS,
  },
});
