import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function AdminRoute() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles = (user as any)?.roles || (user as any)?.authorities || [];
  const isAdmin = Array.isArray(roles) ? roles.some((r: string) => r.includes("ADMIN")) : false;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />; // or 403 page
  return <Outlet />;
}
