// src/auth/AuthProvider.tsx (FIXED - No reload bug)
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginRequest,
  registerRequest,
  getCurrentUser,
  registerAdminRequest,
} from "../api/auth";
import api from "../api/axios";
import { toast } from "react-toastify";

type User = {
  emailAlertsEnabled: boolean;
  id?: number;
  username?: string;
  fullName?: string;
  email?: string;
  role?: string | null;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean; // ✅ ADD loading state
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  loginAdmin: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (payload: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => Promise<void>;
  registerAdmin: (payload: {
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
  const [loading, setLoading] = useState(true); // ✅ ADD loading state
  const navigate = useNavigate();

  // ✅ FIXED: Restore session on boot
  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (userRaw) {
          try {
            const userData = JSON.parse(userRaw);
            setUser(userData);
          } catch (err) {
            console.error("Failed to parse user data", err);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        }
      }

      setLoading(false); // ✅ IMPORTANT: Set loading to false after restore
    };

    restoreSession();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setSession = (token: string, userObj: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await loginRequest({ usernameOrEmail, password });
      const token = res?.data?.token || res?.data?.data?.token;

      if (!token) throw new Error("No token returned from server");

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      let userObj = null;
      try {
        const me = await getCurrentUser();
        userObj = me.data;
      } catch {
        userObj = { username: usernameOrEmail };
      }

      setSession(token, userObj);
      toast.success("Login successful!");
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Login failed"
      );
      throw err;
    }
  };

  // src/auth/AuthProvider.tsx - loginAdmin function

  const loginAdmin = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await loginRequest({ usernameOrEmail, password });
      const token = res?.data?.token || res?.data?.data?.token;

      if (!token) throw new Error("No token returned from server");

      // ✅ Set token in axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ Store token
      localStorage.setItem("token", token);

      let userObj = null;
      try {
        const me = await getCurrentUser();
        userObj = me.data;

        // ✅ DEBUG: Log user data
        console.log("🔐 User Object:", userObj);
        console.log("🔐 User Role:", userObj?.role);
      } catch {
        userObj = { username: usernameOrEmail };
      }

      // ✅ Check admin role
      const role = userObj?.role;
      const isAdmin = role && String(role).toUpperCase().includes("ADMIN");

      console.log("🔐 Is Admin:", isAdmin);

      if (!isAdmin) {
        delete api.defaults.headers.common["Authorization"];
        throw new Error("Account does not have ADMIN privileges");
      }

      // ✅ Store user data
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);

      toast.success("Admin login successful!");
      navigate("/admin");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Admin login error:", err);
      toast.error(err?.message || "Admin login failed");
      throw err;
    }
  };

  // ✅ User registration
  const register = async (payload: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => {
    try {
      await registerRequest(payload);
      toast.success("✅ User registration successful. Please login.");
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  // ✅ Admin registration (NEW)
  const registerAdmin = async (payload: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }) => {
    try {
      await registerAdminRequest(payload); // ✅ Call admin endpoint
      toast.success("🎅 Admin registration successful. Please login.");
      navigate("/admin-login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Admin register error:", err);
      toast.error(err?.response?.data?.message || "Admin registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAdmin,
        register,
        registerAdmin,
        logout,
      }}
    >
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
