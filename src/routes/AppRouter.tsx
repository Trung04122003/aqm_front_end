import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Forecast from "../pages/Forecast";
import Alerts from "../pages/Alerts";
import Reports from "../pages/Reports";
import Support from "../pages/Support";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<Support />} />
      </Route>
    </Routes>
  );
}


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import Forecast from "../pages/Forecast";
// import Alerts from "../pages/Alerts";
// import Reports from "../pages/Reports";
// import Support from "../pages/Support";
// import ProtectedRoute from "./ProtectedRoute";
// import PublicRoute from "./PublicRoute";

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route element={<PublicRoute />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Route>

//         {/* Protected */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/forecast" element={<Forecast />} />
//           <Route path="/alerts" element={<Alerts />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/support" element={<Support />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }
