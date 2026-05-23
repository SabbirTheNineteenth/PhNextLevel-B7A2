import type { Request, Response, NextFunction } from "express";
import { StatusCodes }                          from "http-status-codes";
import {
  validateCreateIssue,
  validateUpdateIssue,
  parseIssueQueryParams,
} from "./issues.validation.js";
import {
  getAllIssues,
  getIssueById,
  getRawIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from "./issues.service.js";
import { sendSuccess, sendError } from "../../utils/response.util.js";
import { logger }                 from "../../utils/logger.util.js";

function isValidationError(msg: string): boolean {
  return msg.startsWith("'");
}

export async function createIssueHandler(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, type } = validateCreateIssue(
      req.body as Record<string, unknown>
    );

    // reporter_id always from JWT — never from request body
    const issue = await createIssue(title, description, type, req.user!.id);

    logger.info(`[Issues] Created issue #${issue.id} by user ${req.user!.id}`);

    sendSuccess({
      res,
      statusCode: StatusCodes.CREATED,
      message:    "Issue created successfully",
      data:       issue,
    });
  } catch (err) {
    if (err instanceof Error && isValidationError(err.message)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: err.message });
      return;
    }
    next(err);
  }
}

export async function getAllIssuesHandler(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const { sort, type, status } = parseIssueQueryParams(
      req.query as Record<string, unknown>
    );
    const issues = await getAllIssues(sort === "oldest" ? "ASC" : "DESC", type, status);

    // Exact message from assignment spec (typo intentional — must match spec)
    sendSuccess({
      res,
      statusCode: StatusCodes.OK,
      message:    "Issues retrived successfully",
      data:       issues,
    });
  } catch (err) {
    next(err);
  }
}

export async function getIssueByIdHandler(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params["id"] as string, 10);
    if (isNaN(id)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: "Invalid issue ID" });
      return;
    }

    const issue = await getIssueById(id);
    if (!issue) {
      sendError({ res, statusCode: StatusCodes.NOT_FOUND, message: "Issue not found" });
      return;
    }

    // Exact message from assignment spec (typo intentional — must match spec)
    sendSuccess({
      res,
      statusCode: StatusCodes.OK,
      message:    "Issue retrived successfully",
      data:       issue,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateIssueHandler(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params["id"] as string, 10);
    if (isNaN(id)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: "Invalid issue ID" });
      return;
    }

    const raw = await getRawIssueById(id);
    if (!raw) {
      sendError({ res, statusCode: StatusCodes.NOT_FOUND, message: "Issue not found" });
      return;
    }

    const { id: userId, role } = req.user!;

    // Contributor: only own issues AND only when status is 'open'
    if (role === "contributor") {
      if (raw.reporter_id !== userId) {
        sendError({ res, statusCode: StatusCodes.FORBIDDEN, message: "Forbidden: you can only edit your own issues" });
        return;
      }
      if (raw.status !== "open") {
        sendError({ res, statusCode: StatusCodes.FORBIDDEN, message: "Forbidden: only open issues can be edited" });
        return;
      }
    }

    const fields  = validateUpdateIssue(req.body as Record<string, unknown>);
    const updated = await updateIssue(id, fields);

    logger.info(`[Issues] Updated issue #${id} by user ${userId}`);

    sendSuccess({
      res,
      statusCode: StatusCodes.OK,
      message:    "Issue updated successfully",
      data:       updated,
    });
  } catch (err) {
    if (err instanceof Error && isValidationError(err.message)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: err.message });
      return;
    }
    next(err);
  }
}

export async function deleteIssueHandler(
  req:  Request,
  res:  Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params["id"] as string, 10);
    if (isNaN(id)) {
      sendError({ res, statusCode: StatusCodes.BAD_REQUEST, message: "Invalid issue ID" });
      return;
    }

    const raw = await getRawIssueById(id);
    if (!raw) {
      sendError({ res, statusCode: StatusCodes.NOT_FOUND, message: "Issue not found" });
      return;
    }

    await deleteIssue(id);

    logger.info(`[Issues] Deleted issue #${id} by maintainer ${req.user!.id}`);

    sendSuccess({
      res,
      statusCode: StatusCodes.OK,
      message:    "Issue deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}