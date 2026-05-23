import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const ENV = {
  PORT:               parseInt(process.env["PORT"] ?? "3000", 10),
  NODE_ENV:           process.env["NODE_ENV"] ?? "development",
  DATABASE_URL:       requireEnv("DATABASE_URL"),
  JWT_SECRET:         requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN:     process.env["JWT_EXPIRES_IN"] ?? "7d",
  BCRYPT_SALT_ROUNDS: parseInt(process.env["BCRYPT_SALT_ROUNDS"] ?? "10", 10),
} as const;