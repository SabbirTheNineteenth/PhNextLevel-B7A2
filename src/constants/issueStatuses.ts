export const ISSUE_STATUSES = ["open", "in_progress", "resolved"] as const;
export type IssueStatus     = typeof ISSUE_STATUSES[number];