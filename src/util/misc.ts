import crypto from "crypto";

export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// Define the encryption algorithm and key length
const algorithm = "aes-256-cbc";
const keyLength = 32; // AES-256 requires a 32-byte key
const ivLength = 16; // AES block size in bytes

// Function to generate a random initialization vector (IV)
const generateIV = () => {
  return crypto.randomBytes(ivLength);
};

// Function to generate a random encryption key
const generateKey = () => {
  return crypto.randomBytes(keyLength);
};

const key = generateKey();
const iv = generateIV();
// Function to encrypt plaintext
export const encrypt = (plaintext: any) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Function to decrypt ciphertext
export const decrypt = (ciphertext: any) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const sendResponseObject = <T>(
  code: number,
  status: "Sucess" | "Failed",
  resultDes: string,
  data?: any
): T | any => {
  const response = {
    result: {
      resultCode: code,
      resultTitle: status,
      resultDes,
    },
    data: data,
  };
  return response;
};
