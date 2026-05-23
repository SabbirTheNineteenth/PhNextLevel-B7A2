import express                from "express";
import type { Application, Request, Response, NextFunction } from "express";
import { StatusCodes }        from "http-status-codes";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import apiRoutes              from "./routes/index.js";
import { logger }             from "./utils/logger.util.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger — every incoming request is recorded
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, message: "DevPulse API is running" });
});

app.use("/api", apiRoutes);

app.use((_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    errors:  "Route not found",
  });
});

app.use(globalErrorHandler);

export default app;