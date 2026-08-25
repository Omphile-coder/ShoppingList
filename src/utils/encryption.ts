
import CryptoJS from "crypto-js";

const SECRET_KEY = "shopping-list-secret-key";

export const encrptionData = (data: string): string => { 
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export const decryptData = (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
 }