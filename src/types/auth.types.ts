import type { Role }       from "../constants/roles.js";
import type { PublicUser } from "../interfaces/user.interface.js";

export interface JwtPayload {
  id:   number;
  name: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface SignupRequestBody {
  name:     string;
  email:    string;
  password: string;
  role:     Role;
}

export interface LoginRequestBody {
  email:    string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user:  PublicUser;
}