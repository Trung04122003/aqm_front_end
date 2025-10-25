// src/layouts/AuthLayout.tsx
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ minWidth: 380 }}>
        {children}
      </div>
    </div>
  );
}


// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
//       <div className="card p-4 shadow-sm" style={{ minWidth: 400 }}>
//         {children}
//       </div>
//     </div>
//   );
// }
