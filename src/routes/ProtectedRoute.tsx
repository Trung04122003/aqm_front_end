// src/routes/ProtectedRoute.tsx (FIXED)
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  // ✅ WAIT for auth to initialize before redirecting
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div 
            className="spinner-border text-primary mb-3" 
            style={{ width: 60, height: 60 }} 
          />
          <div className="text-muted">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// // src/routes/ProtectedRoute.tsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";


// export default function ProtectedRoute() {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return <Outlet />;
// }
