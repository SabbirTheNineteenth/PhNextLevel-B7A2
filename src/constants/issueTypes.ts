export const ISSUE_TYPES = ["bug", "feature_request"] as const;
export type IssueType    = typeof ISSUE_TYPES[number];