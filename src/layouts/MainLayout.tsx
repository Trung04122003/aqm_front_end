import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <div style={{ width: 260 }} className="d-none d-lg-block">
          <Sidebar />
        </div>
        <main className="flex-grow-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}


// src/layouts/MainLayout.tsx
// import React from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <Navbar />
//       <div className="d-flex">
//         <div style={{ width: 220 }}><Sidebar /></div>
//         <main className="flex-grow-1 p-4 bg-light min-vh-100">{children}</main>
//       </div>
//     </>
//   );
// }


// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import { Container, Row, Col } from "react-bootstrap";

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <Navbar />
//       <Container fluid>
//         <Row>
//           <Col md={2}><Sidebar /></Col>
//           <Col md={10} className="p-4 bg-light min-vh-100">{children}</Col>
//         </Row>
//       </Container>
//     </>
//   );
// }
