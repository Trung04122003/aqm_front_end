// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function AdminRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin-login" replace />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (user as any)?.role || (user as any)?.roles || (user as any)?.authorities;
  const isAdmin =
    (Array.isArray(role) && role.some((r: string) => String(r).toUpperCase().includes("ADMIN"))) ||
    (typeof role === "string" && String(role).toUpperCase().includes("ADMIN"));

  if (!isAdmin) return <Navigate to="/" replace />; // or show 403 page
  return <Outlet />;
}

// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";

// export default function AdminRoute() {
//   const { user } = useAuth();
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const roles = (user as any)?.roles || (user as any)?.authorities || [];
//   const isAdmin = Array.isArray(roles) ? roles.some((r: string) => r.includes("ADMIN")) : false;
//   if (!user) return <Navigate to="/login" replace />;
//   if (!isAdmin) return <Navigate to="/" replace />; // or 403 page
//   return <Outlet />;
// }
