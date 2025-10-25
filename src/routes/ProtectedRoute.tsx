// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
}


// import { Navigate, Outlet } from "react-router-dom";

// export default function ProtectedRoute() {
//   const token = localStorage.getItem("token");
//   return token ? <Outlet /> : <Navigate to="/login" />;
// }
