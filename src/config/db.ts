import pg from "pg";
import { ENV }    from "./env.js";
import { logger } from "../utils/logger.util.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString:        ENV.DATABASE_URL,
  ssl:                     { rejectUnauthorized: false },
  max:                     10,
  idleTimeoutMillis:       30000,
  connectionTimeoutMillis: 5000,
});

pool.connect((err, _client, release) => {
  if (err) {
    logger.error(`[DB] Connection failed: ${err.message}`);
    process.exit(1);
  }
  release();
  logger.info("[DB] Connected to NeonDB successfully");
});