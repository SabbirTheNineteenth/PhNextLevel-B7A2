import bcrypt  from "bcryptjs";
import { ENV } from "../config/env.js";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}