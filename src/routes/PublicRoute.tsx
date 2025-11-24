// src/routes/PublicRoute.tsx
// import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  return user ? <Navigate to="/" /> : <Outlet />;
}