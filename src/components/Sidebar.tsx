// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white border-end vh-100 p-3">
      <h5 className="mb-3">Menu</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-1"><Link to="/" className="nav-link">Dashboard</Link></li>
        <li className="nav-item mb-1"><Link to="/forecast" className="nav-link">Forecast</Link></li>
        <li className="nav-item mb-1"><Link to="/alerts" className="nav-link">Alerts</Link></li>
        <li className="nav-item mb-1"><Link to="/reports" className="nav-link">Reports</Link></li>
        <li className="nav-item mb-1"><Link to="/support" className="nav-link">Support</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
