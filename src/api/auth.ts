// src/api/auth.ts

import api from "./axios";

export const loginRequest = (usernameOrEmail: string, password: string) => {
  return api.post("/api/auth/login", { usernameOrEmail, password });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerRequest = (payload: any) => {
  return api.post("/api/auth/register", payload);
};

export const getCurrentUser = () => {
  return api.get("/api/auth/me");
};


// import api from "./axios";

// type LoginBody = { username?: string; email?: string; password: string };
// type RegisterBody = { username: string; email: string; password: string; fullName?: string };

// export const loginRequest = (body: LoginBody) => api.post("/auth/login", body);
// export const registerRequest = (body: RegisterBody) => api.post("/auth/register", body);

// // optional: get current user (if backend exposes /api/auth/me)
// export const meRequest = () => api.get("/auth/me");
