import type { IssueType }   from "../constants/issueTypes.js";
import type { IssueStatus } from "../constants/issueStatuses.js";

export interface Issue {
  id:          number;
  title:       string;
  description: string;
  type:        IssueType;
  status:      IssueStatus;
  reporter_id: number;
  created_at:  Date;
  updated_at:  Date;
}

export interface Reporter {
  id:   number;
  name: string;
  role: string;
}

export interface IssueWithReporter extends Omit<Issue, "reporter_id"> {
  reporter: Reporter;
}