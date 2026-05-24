import { Pool } from "pg";
import { ENV }  from "./env.js";

export const pool = new Pool({
  connectionString:        ENV.DATABASE_URL,
  ssl:                     { rejectUnauthorized: false },
  max:                     1,
  idleTimeoutMillis:       30000,
  connectionTimeoutMillis: 5000,
});

if (ENV.NODE_ENV !== "production") {
  pool.connect((err, _client, release) => {
    if (err) {
      console.error(`[DB] Connection failed: ${err.message}`);
      process.exit(1);
    }
    release();
    console.log("[DB] Connected to NeonDB successfully");
  });
}