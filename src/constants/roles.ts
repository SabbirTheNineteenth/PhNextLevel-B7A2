export const ROLES = ["contributor", "maintainer"] as const;
export type Role   = typeof ROLES[number];