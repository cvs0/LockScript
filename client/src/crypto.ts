import { SHA256 } from "crypto-js";

export function hashPassword(password: string) {
    return SHA256(password).toString();
}

export function generateVaultKey() {
    
}