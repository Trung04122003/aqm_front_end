// src/api/axios.ts

import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ✅ CRITICAL: Attach token to EVERY request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Sending token:", token.substring(0, 20) + "..."); // ✅ DEBUG
    } else {
      console.warn("⚠️ No token found in localStorage!"); // ✅ DEBUG
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (keep existing code)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session hết hạn. Vui lòng đăng nhập lại.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    } else if (status === 403) {
      toast.warn("Bạn không có quyền truy cập (403)."); // ✅ Your current error
    } else if (status >= 500) {
      toast.error("Lỗi server. Thử lại sau.");
    }
    return Promise.reject(error);
  }
);

export default api;