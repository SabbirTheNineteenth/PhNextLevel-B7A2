import type { Role } from "../constants/roles.js";

export interface User {
  id:         number;
  name:       string;
  email:      string;
  password:   string;
  role:       Role;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id:         number;
  name:       string;
  email:      string;
  role:       Role;
  created_at: Date;
  updated_at: Date;
}