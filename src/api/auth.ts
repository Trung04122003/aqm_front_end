// src/api/auth.ts

import api from "./axios";

// ==================== REGISTRATION ====================

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

// ==================== LOGIN ====================

// ✅ Login (accepts both username and email)
export const loginRequest = (payload: { 
  usernameOrEmail: string; 
  password: string 
}) => api.post("/auth/login", payload);

// ==================== USER INFO ====================

// ✅ Get current user
export const getCurrentUser = () => api.get("/user/me");

// ==================== PASSWORD RESET ====================

// ✅ NEW: Request password reset (send email with reset link)
export const forgotPasswordRequest = (payload: { 
  email: string 
}) => api.post("/auth/forgot-password", payload);

// ✅ NEW: Validate password reset token
export const validateResetTokenRequest = (payload: { 
  token: string 
}) => api.post("/auth/validate-reset-token", payload);

// ✅ NEW: Reset password with token
export const resetPasswordRequest = (payload: { 
  token: string; 
  newPassword: string 
}) => api.post("/auth/reset-password", payload);