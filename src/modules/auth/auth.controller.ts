import type { Request, Response, NextFunction } from "express";
import { StatusCodes }                          from "http-status-codes";
import { validateSignup, validateLogin }        from "./auth.validation.js";
import { findUserByEmail, createUser }          from "./auth.service.js";
import { hashPassword, comparePassword }        from "../../utils/hash.util.js";
import { signToken }                            from "../../utils/jwt.util.js";
import { sendSuccess, sendError }               from "../../utils/response.util.js";
import { logger }                               from "../../utils/logger.util.js";

function isValidationError(message: string): boolean {
  return message.startsWith("'");
}

export async function signup(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role } = validateSignup(
      req.body as Record<string, unknown>
    );

    const existing = await findUserByEmail(email);
    if (existing) {
      sendError({ res, statusCode: StatusCodes.CONFLICT, message: "Email already in use" });
      return;
    }

    const hashed  = await hashPassword(password);
    const newUser = await createUser(name, email, hashed, role);

    logger.info(`[Auth] New user registered: ${email} (${role})`);

    sendSuccess({
      res,
      statusCode: StatusCodes.CREATED,
      message:    "User registered successfully",
      data:       newUser,
    });
  } catch (err) {
    if (err instanceof Error && isValidationError(err.message)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: err.message });
      return;
    }
    next(err);
  }
}

export async function login(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = validateLogin(
      req.body as Record<string, unknown>
    );

    const user = await findUserByEmail(email);
    if (!user) {
      sendError({ res, statusCode: StatusCodes.UNAUTHORIZED, message: "Invalid email or password" });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      sendError({ res, statusCode: StatusCodes.UNAUTHORIZED, message: "Invalid email or password" });
      return;
    }

    const token = signToken({ id: user.id, name: user.name, role: user.role });

    // Strip password — never returned in any response
    const { password: _pw, ...publicUser } = user;

    logger.info(`[Auth] User logged in: ${email}`);

    sendSuccess({
      res,
      statusCode: StatusCodes.OK,
      message:    "Login successful",
      data:       { token, user: publicUser },
    });
  } catch (err) {
    if (err instanceof Error && isValidationError(err.message)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: err.message });
      return;
    }
    next(err);
  }
}