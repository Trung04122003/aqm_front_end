// src/components/GuestNavbar.tsx
import { Link } from "react-router-dom";

export default function GuestNavbar() {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm py-3 px-4">
      <Link className="navbar-brand fw-bold" to="/" style={{ color: "#667eea" }}>
        AQM System
      </Link>

      <div className="d-flex gap-2">
        <Link className="btn btn-outline-primary" to="/login">User Login</Link>
        <Link className="btn btn-outline-secondary" to="/admin-login">Admin Login</Link>
        <Link className="btn btn-primary text-white" to="/register">Register</Link>
      </div>
    </nav>
  );
}
