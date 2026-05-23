import { pool }         from "../../config/db.js";
import { AUTH_QUERIES } from "./auth.queries.js";
import type { User, PublicUser } from "../../interfaces/user.interface.js";
import type { Role }    from "../../constants/roles.js";

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(AUTH_QUERIES.FIND_BY_EMAIL, [email]);
  return result.rows[0] ?? null;
}

export async function createUser(
  name:     string,
  email:    string,
  password: string,
  role:     Role
): Promise<PublicUser> {
  const result = await pool.query<PublicUser>(
    AUTH_QUERIES.CREATE_USER,
    [name, email, password, role]
  );
  return result.rows[0] as PublicUser;
}