import type { Request, Response, NextFunction } from "express";
import { StatusCodes }  from "http-status-codes";
import { verifyToken }  from "../utils/jwt.util.js";
import { sendError }    from "../utils/response.util.js";
import { logger }       from "../utils/logger.util.js";

export function authenticate(
  req:  Request,
  res:  Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"];

  if (!token) {
    logger.warn(`[Auth] Missing token — ${req.method} ${req.originalUrl}`);
    sendError({ res, statusCode: StatusCodes.UNAUTHORIZED, message: "Authorization token is required" });
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    logger.warn(`[Auth] Invalid or expired token — ${req.method} ${req.originalUrl}`);
    sendError({ res, statusCode: StatusCodes.UNAUTHORIZED, message: "Invalid or expired token" });
    return;
  }

  req.user = payload;
  next();
}