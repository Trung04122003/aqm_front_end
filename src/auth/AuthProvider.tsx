// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, meRequest } from "../api/auth";
import api from "../api/axios";

type User = { id?: number; username?: string; email?: string; role?: string } | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<void>;
  register: (payload: { username: string; email: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }
    setLoading(false);
  }, []);

  const login = async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const body = { username: usernameOrEmail, password };
      const resp = await loginRequest(body);
      const data = resp.data ?? {};

      const token: string | undefined =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any)?.accessToken || (data as any)?.token || (data as any)?.jwt || (data as any)?.access_token;

      if (!token) {
        throw new Error("No token returned from server. Check backend response.");
      }

      localStorage.setItem("token", token);

      // try to extract user from response or fallback to /auth/me
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let userObj: any = (data as any)?.user || (data as any)?.data?.user || null;
      if (!userObj) {
        try {
          const me = await meRequest();
          userObj = me.data;
        } catch {
          userObj = { username: usernameOrEmail };
        }
      }

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate("/");
    } catch (err: unknown) {
      // rethrow to let UI show message
      throw err;
    }
  };

  const register = async (payload: { username: string; email: string; password: string; fullName?: string }) => {
    const resp = await api.post("/auth/register", payload);
    return resp.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}


// import React, { createContext, useState, useEffect, useContext } from "react";

// type User = { username: string; role: string } | null;

// interface AuthContextType {
//   user: User;
//   login: (token: string, user: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const login = (token: string, user: User) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
