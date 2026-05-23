import type { IssueType } from "../constants/issueTypes.js";

export interface CreateIssueBody {
  title:       string;
  description: string;
  type:        IssueType;
}

export interface UpdateIssueBody {
  title?:       string;
  description?: string;
  type?:        IssueType;
}

export interface IssueQueryParams {
  sort?: "newest" | "oldest" | undefined;
  type?: string | undefined;
  status?: string | undefined;
}