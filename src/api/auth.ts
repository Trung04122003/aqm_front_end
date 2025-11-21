// src/api/auth.ts

// src/api/auth.ts
import api from "./axios";

export const loginRequest = (payload: { usernameOrEmail: string; password: string }) =>
  api.post("/auth/login", payload);

export const registerRequest = (payload: { username: string; password: string; email: string; fullName: string }) =>
  api.post("/auth/register", payload);

// Optional: /api/auth/me — BE có chưa thì ok, nếu chưa, this call may 404
export const getCurrentUser = () => api.get("/auth/me");


// import api from "./axios";

// export const loginRequest = (username: string, password: string) => {
//   return api.post("/auth/login", { username, password });
// };

// export const registerRequest = (username: string, email: string, password: string) => {
//   return api.post("/auth/register", { username, email, password});
// };

// export const getCurrentUser = () => {
//   return api.get("/auth/me");
// };


// import api from "./axios";

// type LoginBody = { username?: string; email?: string; password: string };
// type RegisterBody = { username: string; email: string; password: string; fullName?: string };

// export const loginRequest = (body: LoginBody) => api.post("/auth/login", body);
// export const registerRequest = (body: RegisterBody) => api.post("/auth/register", body);

// // optional: get current user (if backend exposes /api/auth/me)
// export const meRequest = () => api.get("/auth/me");
