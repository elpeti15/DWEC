import { User } from "./user";

export interface LoginResponse {
  ok: boolean;
  token: string;
  rol: 'admin' | 'physio' | 'patient';
  id?: string;
}

export interface UserResponse {
  user: User;
}