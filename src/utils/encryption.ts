import CryptoJS from "crypto-js";

// Keep the existing key for compatibility with accounts created before WeShop.
// This browser-side key is for the course demo; it cannot protect production credentials.
const secretKey = "shopping-list-secret-key";

// Encrypts a password before registration or a password change writes it to JSON Server.
export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Decrypts a stored password for comparison during sign-in, as required by the task.
export function decryptData(cipherText: string) {
  try {
    return CryptoJS.AES.decrypt(cipherText, secretKey).toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}
