// src/components/Navbar.tsx (UPDATED with AlertBadge & SearchBar)
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import AlertBadge from "./AlertBadge";
import SearchBar from "./SearchBar";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch unread alerts count
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/alerts/unread");
        setUnreadCount(res.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch unread alerts", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user]);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic - navigate to search results page or filter dashboard
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav 
      className="navbar navbar-expand-lg bg-white shadow-sm sticky-top"
      style={{ 
        borderBottom: "1px solid rgba(15,23,42,0.06)",
        zIndex: 1000
      }}
    >
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          style={{ color: "#0ea5b7", fontSize: "1.4rem" }}
        >
          <motion.span
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🌍
          </motion.span>
          AQM
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="d-none d-lg-block mx-auto" style={{ maxWidth: 400 }}>
          <SearchBar 
            placeholder="Search locations, sensors..." 
            onSearch={handleSearch}
            suggestions={["Hanoi", "Ho Chi Minh City", "Da Nang"]}
          />
        </div>

        {/* Right Side Actions */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              {/* Alerts Icon with Badge */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/alerts")}
              >
                <FaBell size={20} className="text-muted" />
                <div className="position-absolute top-0 start-100 translate-middle">
                  <AlertBadge count={unreadCount} size="sm" />
                </div>
              </motion.div>

              {/* User Dropdown */}
              <div className="position-relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div 
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36, fontSize: "0.9rem" }}
                  >
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="d-none d-md-block">
                    <div className="small fw-semibold" style={{ lineHeight: 1.2 }}>
                      {user.username || "User"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                      {user.email || ""}
                    </div>
                  </div>
                </motion.div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="position-absolute end-0 mt-2 card border-0 shadow-lg"
                    style={{ 
                      minWidth: 200,
                      borderRadius: 12,
                      zIndex: 1050
                    }}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div className="card-body p-2">
                      <Link
                        to="/profile"
                        className="dropdown-item rounded py-2 px-3 d-flex align-items-center gap-2"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser size={14} />
                        Profile
                      </Link>
                      
                      <hr className="my-2" />
                      
                      <button
                        className="dropdown-item rounded py-2 px-3 d-flex align-items-center gap-2 text-danger"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt size={14} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="d-lg-none w-100 px-4 pb-3">
        <SearchBar 
          placeholder="Search..." 
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
}

// import { Link } from "react-router-dom";
// import { useAuth } from "../auth/AuthProvider";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   return (
//     <nav className="navbar navbar-expand-lg bg-white border-bottom">
//       <div className="container-fluid">
//         <Link to="/" className="navbar-brand fw-bold">AQM</Link>

//         <div className="d-flex align-items-center">
//           <div className="me-3">
//             <input className="form-control form-control-sm" placeholder="Search city, location..." />
//           </div>
//           {user ? (
//             <div className="d-flex align-items-center">
//               <div className="me-3 small text-muted">Hi, {user.username || "User"}</div>
//               <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
//             </div>
//           ) : (
//             <Link className="btn btn-primary btn-sm" to="/login">Sign in</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


