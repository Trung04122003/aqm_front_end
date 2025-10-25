// src/pages/Register.tsx
import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <h3 className="mb-3">Register</h3>
      <p className="text-muted">Placeholder Register page.</p>
      <div className="d-grid gap-2">
        <button className="btn btn-success" type="button">Mock Register</button>
      </div>

      <hr />
      <div className="text-center">
        <Link to="/login">Have an account? Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
