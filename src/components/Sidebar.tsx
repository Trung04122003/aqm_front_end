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


// src/components/Sidebar.tsx
// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar: React.FC = () => {
//   return (
//     <div className="bg-white border-end vh-100 p-3">
//       <h5 className="mb-3">Menu</h5>
//       <ul className="nav flex-column">
//         <li className="nav-item mb-1"><Link to="/" className="nav-link">Dashboard</Link></li>
//         <li className="nav-item mb-1"><Link to="/forecast" className="nav-link">Forecast</Link></li>
//         <li className="nav-item mb-1"><Link to="/alerts" className="nav-link">Alerts</Link></li>
//         <li className="nav-item mb-1"><Link to="/reports" className="nav-link">Reports</Link></li>
//         <li className="nav-item mb-1"><Link to="/support" className="nav-link">Support</Link></li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
