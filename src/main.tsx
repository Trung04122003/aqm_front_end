// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./api/axios"; // ensure interceptor registered
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import AQICard from "./components/AQICard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AQICardAnimated(props: any) {
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}>
      <AQICard {...props} />
    </motion.div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" newestOnTop />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);