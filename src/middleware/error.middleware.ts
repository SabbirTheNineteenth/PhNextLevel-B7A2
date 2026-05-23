import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";

export function globalErrorHandler(
  err:   Error,
  _req:  Request,
  res:   Response,
  _next: NextFunction
): void {
  console.error("[Error]", err.message);
  sendError({
    res,
    statusCode: 500,
    message:    "Internal server error",
    errors:     err.message,
  });
}