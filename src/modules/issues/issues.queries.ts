
export const ISSUE_QUERIES = {

  FIND_ALL: (order: "DESC" | "ASC", hasType: boolean, hasStatus: boolean): string => {
    const conditions: string[] = [];
    let   idx = 1;

    if (hasType)   conditions.push(`type = $${idx++}`);
    if (hasStatus) conditions.push(`status = $${idx++}`);

    const where = conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    return `
      SELECT id, title, description, type, status, reporter_id, created_at, updated_at
      FROM   issues
      ${where}
      ORDER  BY created_at ${order}
    `;
  },

  FIND_BY_ID: `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM   issues
    WHERE  id = $1
    LIMIT  1
  `,

  CREATE: `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
  `,

  BUILD_UPDATE: (fields: string[]): string => {
    const set = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    return `
      UPDATE issues
      SET    ${set}
      WHERE  id = $${fields.length + 1}
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `;
  },

  DELETE_BY_ID: `
    DELETE FROM issues
    WHERE id = $1
  `,

  // Separate users query — NO JOIN
  FIND_REPORTERS_BY_IDS: (count: number): string => {
    const placeholders = Array.from({ length: count }, (_, i) => `$${i + 1}`).join(", ");
    return `
      SELECT id, name, role
      FROM   users
      WHERE  id IN (${placeholders})
    `;
  },

} as const;