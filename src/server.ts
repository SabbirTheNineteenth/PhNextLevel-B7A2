import app          from "./app.js";
import { ENV }      from "./config/env.js";
import "./config/db.js";
import { logger }   from "./utils/logger.util.js";

const server = app.listen(ENV.PORT, () => {
  logger.info(`[Server] DevPulse running on port ${ENV.PORT} (${ENV.NODE_ENV})`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    logger.info("[Server] Shutdown complete");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.close(() => {
    logger.info("[Server] Shutdown complete");
    process.exit(0);
  });
});