import jwt            from "jsonwebtoken";
import { ENV }        from "../config/env.js";
import type { JwtPayload } from "../types/auth.types.js";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}