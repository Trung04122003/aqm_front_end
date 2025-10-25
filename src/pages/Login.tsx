// src/pages/Login.tsx
import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../auth/AuthProvider";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ usernameOrEmail, password });
      // on success navigate happens inside login()
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="mb-3">Sign in</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-2">
          <label className="form-label">Username or Email</label>
          <input className="form-control" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;


// // src/pages/Login.tsx
// import React from "react";
// import { Link } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";

// const Login: React.FC = () => {
//   return (
//     <AuthLayout>
//       <h3 className="mb-3">Sign in</h3>
//       <p className="text-muted">This is a placeholder Login page. Replace with your real form.</p>

//       <div className="d-grid gap-2">
//         <button className="btn btn-primary" type="button">Mock Sign In</button>
//       </div>

//       <hr />

//       <div className="text-center">
//         <Link to="/register">Create an account</Link>
//       </div>
//     </AuthLayout>
//   );
// };

// export default Login;
