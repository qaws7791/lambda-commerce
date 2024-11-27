import { decode, sign, verify } from "hono/jwt";
import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return argon2.hash(password);
};

export const comparePassword = async (password: string, hash: string) => {
  return argon2.verify(hash, password);
};

export const signJWT = sign;
export const verifyJWT = verify;
export const decodeJWT = decode;
