import {
  requireField,
  validateEmail,
  validateRole,
  minLength,
} from "../../utils/validation.util.js";
import type { SignupRequestBody, LoginRequestBody } from "../../types/auth.types.js";
import type { Role } from "../../constants/roles.js";

export function validateSignup(body: Record<string, unknown>): SignupRequestBody {
  const name     = requireField(body["name"],     "name");
  const email    = validateEmail(body["email"]);
  const password = requireField(body["password"], "password");
  const role     = validateRole(body["role"]) as Role;

  minLength(password, "password", 6);

  return { name, email, password, role };
}

export function validateLogin(body: Record<string, unknown>): LoginRequestBody {
  const email    = validateEmail(body["email"]);
  const password = requireField(body["password"], "password");
  return { email, password };
}