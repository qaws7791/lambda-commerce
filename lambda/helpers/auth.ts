import { argon2id, argon2Verify } from "hash-wasm";
import { decode, sign, verify } from "hono/jwt";

export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  return argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 256,
    memorySize: 512,
    hashLength: 32,
    outputType: "encoded",
  });
}

export async function verifyPassword(
  storedHash: string,
  password: string
): Promise<boolean> {
  return argon2Verify({
    hash: storedHash,
    password,
  });
}

// export async function hashPassword(
//   password: string,
//   providedSalt?: Uint8Array
// ): Promise<string> {
//   const encoder = new TextEncoder();
//   // 제공된 소금이 있을 경우 사용하고, 그렇지 않으면 새로 생성
//   const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
//   const keyMaterial = await crypto.subtle.importKey(
//     "raw",
//     encoder.encode(password),
//     { name: "PBKDF2" },
//     false,
//     ["deriveBits", "deriveKey"]
//   );
//   const key = await crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt: salt.buffer as ArrayBuffer,
//       iterations: 100000,
//       hash: "SHA-256",
//     },
//     keyMaterial,
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );
//   const exportedKey = (await crypto.subtle.exportKey(
//     "raw",
//     key
//   )) as ArrayBuffer;
//   const hashBuffer = new Uint8Array(exportedKey);
//   const hashArray = Array.from(hashBuffer);
//   const hashHex = hashArray
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");
//   const saltHex = Array.from(salt)
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");
//   return `${saltHex}:${hashHex}`;
// }
// export async function verifyPassword(
//   storedHash: string,
//   passwordAttempt: string
// ): Promise<boolean> {
//   const [saltHex, originalHash] = storedHash.split(":");
//   const matchResult = saltHex.match(/.{1,2}/g);
//   if (!matchResult) {
//     throw new Error("Invalid salt format");
//   }
//   const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
//   const attemptHashWithSalt = await hashPassword(passwordAttempt, salt);
//   const [, attemptHash] = attemptHashWithSalt.split(":");
//   return attemptHash === originalHash;
// }

export const signJWT = sign;
export const verifyJWT = verify;
export const decodeJWT = decode;
