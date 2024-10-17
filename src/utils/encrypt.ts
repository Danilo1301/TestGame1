import CryptoJS from "crypto-js";

export function encrypt(data: string) {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);
    const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // Retorna o texto criptografado em formato hexadecimal
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

export function decrypt(encryptedData: string) {
    const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);
    const iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_SECRET_KEY!);

    const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedData);

    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedBytes,
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedText;
}