// src/api/axios.ts
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach token automatically from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Central response handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // session expired or unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.error("Session hết hạn. Vui lòng đăng nhập lại.");
      // redirect to login (hard redirect safe from interceptor)
      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    } else if (status === 403) {
      toast.warn("Bạn không có quyền truy cập (403).");
    } else if (status >= 500) {
      toast.error("Lỗi server. Thử lại sau.");
    }
    return Promise.reject(error);
  }
);

export default api;


// // src/api/axios.ts
// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
//   withCredentials: false, // JWT header flow; set true only for cookie auth
// });

// // Request: attach token automatically from localStorage
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// // Response: global 401 handler
// api.interceptors.response.use(
//   (resp) => resp,
//   (error) => {
//     const status = error?.response?.status;
//     if (status === 401 || status === 403) {
//       // Logout: clear token & user (we keep simple - expected AuthProvider also watches localStorage)
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       // optional: redirect to login
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   // debug:
//   console.log("[axios] attaching token:", token ? token.slice(0,20) : '<<no-token>>');
//   if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });


// export default api;

