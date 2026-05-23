import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";

export function requireMaintainer(
  req:  Request,
  res:  Response,
  next: NextFunction
): void {
  if (req.user?.role !== "maintainer") {
    sendError({ res, statusCode: 403, message: "Forbidden: maintainer access required" });
    return;
  }
  next();
}