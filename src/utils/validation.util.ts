import { ROLES }          from "../constants/roles.js";
import { ISSUE_TYPES }    from "../constants/issueTypes.js";
import { ISSUE_STATUSES } from "../constants/issueStatuses.js";

export function requireField(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`'${fieldName}' is required and must be a non-empty string`);
  }
  return value.trim();
}

export function maxLength(value: string, fieldName: string, max: number): void {
  if (value.length > max) {
    throw new Error(`'${fieldName}' must not exceed ${max} characters`);
  }
}

export function minLength(value: string, fieldName: string, min: number): void {
  if (value.length < min) {
    throw new Error(`'${fieldName}' must be at least ${min} characters`);
  }
}

export function validateEmail(value: unknown): string {
  const email = requireField(value, "email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("'email' must be a valid email address");
  }
  return email;
}

export function validateRole(value: unknown): string {
  const role = requireField(value, "role");
  if (!ROLES.includes(role as typeof ROLES[number])) {
    throw new Error(`'role' must be one of: ${ROLES.join(", ")}`);
  }
  return role;
}

export function validateIssueType(value: unknown): string {
  const type = requireField(value, "type");
  if (!ISSUE_TYPES.includes(type as typeof ISSUE_TYPES[number])) {
    throw new Error(`'type' must be one of: ${ISSUE_TYPES.join(", ")}`);
  }
  return type;
}

export function validateIssueStatus(value: unknown): string {
  const status = requireField(value, "status");
  if (!ISSUE_STATUSES.includes(status as typeof ISSUE_STATUSES[number])) {
    throw new Error(`'status' must be one of: ${ISSUE_STATUSES.join(", ")}`);
  }
  return status;
}