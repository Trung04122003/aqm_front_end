// import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="mb-4">
        <div className="h5 mb-0">Air Quality</div>
        <div className="small text-muted">Real-time monitoring</div>
      </div>

      <nav className="nav flex-column">
        <NavLink to="/" className="nav-link">Dashboard</NavLink>
        <NavLink to="/forecast" className="nav-link">Forecast</NavLink>
        <NavLink to="/alerts" className="nav-link">Alerts</NavLink>
        <NavLink to="/reports" className="nav-link">Reports</NavLink>
        <NavLink to="/support" className="nav-link">Support</NavLink>
      </nav>
    </aside>
  );
}