// src/api/auth.ts

import api from "./axios";

// ✅ User registration
export const registerRequest = (payload: { 
  username: string; 
  password: string; 
  email: string; 
  fullName: string 
}) => api.post("/auth/register", payload);

// ✅ Admin registration (PUBLIC - Development)
export const registerAdminRequest = (payload: { 
  username: string; 
  password: string; 
  email: string; 
  fullName: string 
}) => api.post("/auth/register-admin", payload);

// ✅ Admin creation (PROTECTED - Production)
export const createAdminRequest = (payload: { 
  username: string; 
  password: string; 
  email: string; 
  fullName: string 
}) => api.post("/auth/create-admin", payload);

// Login
export const loginRequest = (payload: { 
  usernameOrEmail: string; 
  password: string 
}) => api.post("/auth/login", payload);

// Get current user
export const getCurrentUser = () => api.get("/user/me");