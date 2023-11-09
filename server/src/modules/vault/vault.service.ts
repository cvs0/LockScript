import { VaultModel } from "./vault.model";

export function createVault(input: { user: string; salt: string }) {
    return VaultModel.create(input);
  }