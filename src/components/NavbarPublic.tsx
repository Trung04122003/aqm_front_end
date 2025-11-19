import { Link } from "react-router-dom";

export default function NavbarPublic() {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <Link to="/" className="navbar-brand">AQM System</Link>

      <div className="d-flex gap-3">
        <Link to="/login" className="nav-link">User Login</Link>
        <Link to="/admin-login" className="nav-link text-danger">Admin Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
}
