// src/pages/Login.tsx
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <h3 className="mb-3">Sign in</h3>
      <p className="text-muted">This is a placeholder Login page. Replace with your real form.</p>

      <div className="d-grid gap-2">
        <button className="btn btn-primary" type="button">Mock Sign In</button>
      </div>

      <hr />

      <div className="text-center">
        <Link to="/register">Create an account</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
