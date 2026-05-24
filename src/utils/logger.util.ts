import fs   from "fs";
import path from "path";

const LOG_FILE = path.resolve("logger.txt");

function timestamp(): string {
  return new Date().toISOString();
}

function writeToFile(level: string, message: string): void {
  // Skip file writing in production — Vercel filesystem is read-only
  if (process.env["NODE_ENV"] === "production") return;
  const line = `[${timestamp()}] [${level}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, line, "utf-8");
}

function info(message: string): void {
  const line = `[${timestamp()}] [INFO]  ${message}`;
  if (process.env["NODE_ENV"] !== "test") console.log(line);
  writeToFile("INFO ", message);
}

function error(message: string): void {
  const line = `[${timestamp()}] [ERROR] ${message}`;
  if (process.env["NODE_ENV"] !== "test") console.error(line);
  writeToFile("ERROR", message);
}

function warn(message: string): void {
  const line = `[${timestamp()}] [WARN]  ${message}`;
  if (process.env["NODE_ENV"] !== "test") console.warn(line);
  writeToFile("WARN ", message);
}

function debug(message: string): void {
  if (process.env["NODE_ENV"] !== "production") {
    const line = `[${timestamp()}] [DEBUG] ${message}`;
    console.log(line);
    writeToFile("DEBUG", message);
  }
}

export const logger = { info, error, warn, debug };