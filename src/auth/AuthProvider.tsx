// src/auth/AuthProvider.tsx
// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest, getCurrentUser } from "../api/auth";
import api from "../api/axios";
import { toast } from "react-toastify";

type User = {
  id?: number;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string | null;
} | null;

type AuthContextType = {
  user: User;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  loginAdmin: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (payload: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();

  // Restore session on boot
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (userRaw) {
      try {
        setUser(JSON.parse(userRaw));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setSession = (token: string, userObj: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
  };

  // Standard login for regular users
  const login = async (usernameOrEmail: string, password: string) => {
    const res = await loginRequest({ usernameOrEmail, password });
    // BE returns AuthResponse(token) in .data (based on your controller)
    const token =
      res?.data?.token || res?.data?.data?.token || (res?.data?.data ?? null);
    // But in your AuthController earlier it returned new AuthResponse(token) in body
    // Common shape we handle:
    const extractedToken =
      typeof res?.data === "string"
        ? res.data
        : res?.data?.token || res?.data?.data?.token || res?.data?.token;
    // For safety, try several spots:
    const finalToken =
      res?.data?.token ||
      (res?.data?.data && res.data.data.token) ||
      (typeof res?.data === "string" ? res.data : undefined);

    const tokenToUse = finalToken || extractedToken || token;
    if (!tokenToUse) throw new Error("Không nhận được token từ server");

    // set token then fetch user info if endpoint exists
    api.defaults.headers.common["Authorization"] = `Bearer ${tokenToUse}`;
    let userObj = null;
    try {
      const me = await getCurrentUser();
      userObj = me.data;
    } catch {
      // fall back to minimal user
      userObj = { usernameOrEmail };
    }
    setSession(tokenToUse, userObj);
    navigate("/");
  };

  // Admin login: same loginRequest but enforce role = ADMIN
  const loginAdmin = async (usernameOrEmail: string, password: string) => {
    const res = await loginRequest({ usernameOrEmail, password });
    const token =
      res?.data?.token || (res?.data?.data && res.data.data.token) || undefined;
    if (!token) throw new Error("Không nhận được token từ server");

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    let userObj = null;
    try {
      const me = await getCurrentUser();
      userObj = me.data;
    } catch {
      userObj = null;
    }

    // check role
    const role =
      (userObj &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (userObj.role || userObj.roles || (userObj as any).authorities)) ||
      null;
    // Normalize difference: if roles array
    const isAdmin =
      (Array.isArray(role) &&
        role.some((r: string) => r.toUpperCase().includes("ADMIN"))) ||
      (typeof role === "string" && role.toUpperCase().includes("ADMIN"));

    if (!isAdmin) {
      // cleanup and reject
      delete api.defaults.headers.common["Authorization"];
      throw new Error("Tài khoản không có quyền ADMIN");
    }

    setSession(token, userObj);
    navigate("/admin");
  };

  const register = async (payload: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => {
    await registerRequest(payload); // KHÔNG return res nữa để TypeScript không quạu
    toast.success("Đăng ký thành công. Vui lòng đăng nhập.");
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAdmin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginRequest } from "../api/auth";
// import api from "../api/axios";

// type User = {
//   id?: number;
//   username?: string;
//   email?: string;
//   role?: string;
// } | null;

// interface AuthContextType {
//   user: User;
//   loading: boolean;
//   login: (credentials: {
//     username: string;
//     password: string;
//   }) => Promise<void>;
//   register: (payload: {
//     username: string;
//     email: string;
//     password: string;
//     fullName?: string;
//   }) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (token && storedUser) {
//       setUser(JSON.parse(storedUser));
//       setLoading(false);
//       return;
//     }
//     setLoading(false);
//   }, []);

//   const login = async ({ username, password }: { username: string; password: string }) => {
//   try {
//     const body = { username: username, password };
//     const resp = await loginRequest(body);
//     console.log("login resp.data:", resp.data); // debug: remove later

//     const data = resp.data ?? {};

//     // Try multiple field names that backend might return
//     const token: string | undefined =
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.accessToken ||
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.token ||
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.jwt ||
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.access_token ||
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.data?.accessToken ||
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       (data as any)?.data?.token;

//     if (!token) {
//       throw new Error("No token returned from server. Check login response payload in console.");
//     }

//     // store token and user
//     localStorage.setItem("token", token);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const userObj = (data as any)?.user || (data as any)?.data?.user || { username: username };
//     localStorage.setItem("user", JSON.stringify(userObj));
//     setUser(userObj);

//     // navigate to dashboard
//     navigate("/");
//   } catch (err: unknown) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const e: any = err;
//     // rethrow so UI shows message (or set an error state)
//     throw e;
//   }
// };

//   // const login = async ({
//   //   username,
//   //   password,
//   // }: {
//   //   username: string;
//   //   password: string;
//   // }) => {
//   //   // eslint-disable-next-line no-useless-catch
//   //   try {
//   //     const body = { username: username, password };
//   //     // inside login()
//   //     const resp = await loginRequest(body);
//   //     const data = resp.data ?? {};

//   //     // detect token (thử nhiều tên trường)
//   //     const token =
//   //       data?.accessToken || data?.token || data?.jwt || data?.access_token;
//   //     if (!token) throw new Error("No token returned from server");

//   //     localStorage.setItem("token", token); // <-- bắt buộc phải có
//   //     // optional: store user
//   //     const userObj = data?.user ||
//   //       data?.data?.user || { username: username };
//   //     localStorage.setItem("user", JSON.stringify(userObj));
//   //     setUser(userObj);
//   //     navigate("/");
//   //     console.log("login resp.data:", resp.data);
//   //   } catch (err: unknown) {
//   //     // rethrow to let UI show message
//   //     throw err;
//   //   }
//   // };

//   const register = async (payload: {
//     username: string;
//     email: string;
//     password: string;
//     fullName?: string;
//   }) => {
//     const resp = await api.post("/auth/register", payload);
//     return resp.data;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }
