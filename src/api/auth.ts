// src/api/auth.ts
import api from "./axios";

export const loginRequest = (payload: { usernameOrEmail: string; password: string }) =>
  api.post("/auth/login", payload);

export const registerRequest = (payload: { username: string; password: string; email: string; fullName: string }) =>
  api.post("/auth/register", payload);

// Optional: /api/auth/me — BE có chưa thì ok, nếu chưa, this call may 404
export const getCurrentUser = () => api.get("/user/me");