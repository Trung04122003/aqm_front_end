// src/routes/AdminRoute.tsx (FIXED)
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function AdminRoute() {
  const { user, loading } = useAuth();
  
  // ✅ WAIT for auth to initialize
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div 
            className="spinner-border text-danger mb-3" 
            style={{ width: 60, height: 60 }} 
          />
          <div className="text-muted">Verifying admin access...</div>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/admin-login" replace />;

  // Check if user has ADMIN role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (user as any)?.role || (user as any)?.roles || (user as any)?.authorities;
  const isAdmin =
    (Array.isArray(role) && role.some((r: string) => String(r).toUpperCase().includes("ADMIN"))) ||
    (typeof role === "string" && String(role).toUpperCase().includes("ADMIN"));

  if (!isAdmin) {
    return <Navigate to="/" replace />; // Redirect to user dashboard
  }
  
  return <Outlet />;
}

// // src/routes/AdminRoute.tsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";

// export default function AdminRoute() {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/admin-login" replace />;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const role = (user as any)?.role || (user as any)?.roles || (user as any)?.authorities;
//   const isAdmin =
//     (Array.isArray(role) && role.some((r: string) => String(r).toUpperCase().includes("ADMIN"))) ||
//     (typeof role === "string" && String(role).toUpperCase().includes("ADMIN"));

//   if (!isAdmin) return <Navigate to="/" replace />; // or show 403 page
//   return <Outlet />;
// }