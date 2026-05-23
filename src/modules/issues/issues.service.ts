import { pool }          from "../../config/db.js";
import { ISSUE_QUERIES } from "./issues.queries.js";
import type { Issue, IssueWithReporter, Reporter } from "../../interfaces/issue.interface.js";
import type { IssueType } from "../../constants/issueTypes.js";

// Fetch reporter rows in a separate query — NO JOIN used anywhere
async function fetchReporterMap(ids: number[]): Promise<Map<number, Reporter>> {
  if (ids.length === 0) return new Map();
  const result = await pool.query<Reporter>(
    ISSUE_QUERIES.FIND_REPORTERS_BY_IDS(ids.length),
    ids
  );
  return new Map(result.rows.map((r) => [r.id, r]));
}

function mergeReporter(issue: Issue, map: Map<number, Reporter>): IssueWithReporter {
  const { reporter_id, created_at, updated_at, ...rest } = issue;
  return {
    ...rest,
    reporter: map.get(reporter_id) ?? { id: reporter_id, name: "Unknown", role: "contributor" },
    created_at,
    updated_at,
  };
}

export async function getAllIssues(
  order:        "DESC" | "ASC",
  typeFilter?:   string,
  statusFilter?: string
): Promise<IssueWithReporter[]> {
  const params: string[] = [];
  if (typeFilter)   params.push(typeFilter);
  if (statusFilter) params.push(statusFilter);

  const issues = (
    await pool.query<Issue>(
      ISSUE_QUERIES.FIND_ALL(order, !!typeFilter, !!statusFilter),
      params
    )
  ).rows;

  if (issues.length === 0) return [];

  const reporterMap = await fetchReporterMap([
    ...new Set(issues.map((i) => i.reporter_id)),
  ]);

  return issues.map((issue) => mergeReporter(issue, reporterMap));
}

export async function getIssueById(id: number): Promise<IssueWithReporter | null> {
  const issue = (
    await pool.query<Issue>(ISSUE_QUERIES.FIND_BY_ID, [id])
  ).rows[0];

  if (!issue) return null;

  const reporterMap = await fetchReporterMap([issue.reporter_id]);
  return mergeReporter(issue, reporterMap);
}

export async function getRawIssueById(id: number): Promise<Issue | null> {
  return (
    await pool.query<Issue>(ISSUE_QUERIES.FIND_BY_ID, [id])
  ).rows[0] ?? null;
}

export async function createIssue(
  title:       string,
  description: string,
  type:        IssueType,
  reporterId:  number
): Promise<Issue> {
  return (
    await pool.query<Issue>(ISSUE_QUERIES.CREATE, [title, description, type, reporterId])
  ).rows[0] as Issue;
}

export async function updateIssue(
  id:     number,
  fields: Partial<{ title: string; description: string; type: string }>
): Promise<Issue | null> {
  const keys   = Object.keys(fields) as (keyof typeof fields)[];
  const values = keys.map((k) => fields[k]);

  if (keys.length === 0) return null;

  return (
    await pool.query<Issue>(ISSUE_QUERIES.BUILD_UPDATE(keys), [...values, id])
  ).rows[0] ?? null;
}

export async function deleteIssue(id: number): Promise<void> {
  await pool.query(ISSUE_QUERIES.DELETE_BY_ID, [id]);
}