import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatWidget from "../components/ChatWidget";

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
      <ChatWidget />
    </div>
  );
}