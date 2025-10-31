// import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">AQM</Link>

        <div className="d-flex align-items-center">
          <div className="me-3">
            <input className="form-control form-control-sm" placeholder="Search city, location..." />
          </div>
          {user ? (
            <div className="d-flex align-items-center">
              <div className="me-3 small text-muted">Hi, {user.username || "User"}</div>
              <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/login">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}


// src/components/Navbar.tsx
// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar: React.FC = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">AQM</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse" id="nav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/forecast">Forecast</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/alerts">Alerts</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
