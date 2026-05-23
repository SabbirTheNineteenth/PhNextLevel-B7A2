import type { Response }                    from "express";
import { StatusCodes }                      from "http-status-codes";

interface SuccessPayload {
  res:        Response;
  statusCode: StatusCodes;
  message:    string;
  data?:      unknown;
}

interface ErrorPayload {
  res:        Response;
  statusCode: StatusCodes;
  message:    string;
  errors?:    unknown;
}

export function sendSuccess({ res, statusCode, message, data }: SuccessPayload): void {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
}

export function sendError({ res, statusCode, message, errors }: ErrorPayload): void {
  res.status(statusCode).json({
    success: false,
    message,
    errors:  errors ?? message,
  });
}