import {
  requireField,
  maxLength,
  minLength,
  validateIssueType,
} from "../../utils/validation.util.js";
import type { CreateIssueBody, UpdateIssueBody, IssueQueryParams } from "../../types/issue.types.js";
import type { IssueType } from "../../constants/issueTypes.js";

export function validateCreateIssue(body: Record<string, unknown>): CreateIssueBody {
  const title       = requireField(body["title"],       "title");
  const description = requireField(body["description"], "description");
  const type        = validateIssueType(body["type"]) as IssueType;

  maxLength(title,       "title",       150);
  minLength(description, "description", 20);

  return { title, description, type };
}

export function validateUpdateIssue(body: Record<string, unknown>): UpdateIssueBody {
  const result: UpdateIssueBody = {};

  if (body["title"] !== undefined) {
    const title = requireField(body["title"], "title");
    maxLength(title, "title", 150);
    result.title = title;
  }

  if (body["description"] !== undefined) {
    const description = requireField(body["description"], "description");
    minLength(description, "description", 20);
    result.description = description;
  }

  if (body["type"] !== undefined) {
    result.type = validateIssueType(body["type"]) as IssueType;
  }

  if (Object.keys(result).length === 0) {
    throw new Error("'title', 'description', or 'type' — at least one field is required");
  }

  return result;
}

export function parseIssueQueryParams(query: Record<string, unknown>): IssueQueryParams {
  return {
    sort:   (query["sort"] as IssueQueryParams["sort"]) ?? "newest",
    type:   query["type"]   as string | undefined,
    status: query["status"] as string | undefined,
  };
}