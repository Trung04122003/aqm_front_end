// src/pages/Register.tsx
import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr(null);
  setMsg(null);
  setLoading(true);
  try {
    const resp = await register({ username, email, password });
    // nếu backend trả message -> show briefly, rồi redirect
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const successMsg = (resp as any)?.message || "Registration successful. Redirecting to login...";
    setMsg(successMsg);

    // small UX delay để user thấy thông báo, rồi chuyển hướng
    setTimeout(() => {
      navigate("/login");
    }, 900); // 900ms — đủ để đọc thông báo, không quá lâu

  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    setErr(e?.response?.data?.message || e?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <h3 className="mb-3">Register</h3>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={submit}>
        <div className="mb-2">
          <label className="form-label">Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="d-grid">
          <button className="btn btn-success" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;


// // src/pages/Register.tsx
// import React from "react";
// import { Link } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";

// const Register: React.FC = () => {
//   return (
//     <AuthLayout>
//       <h3 className="mb-3">Register</h3>
//       <p className="text-muted">Placeholder Register page.</p>
//       <div className="d-grid gap-2">
//         <button className="btn btn-success" type="button">Mock Register</button>
//       </div>

//       <hr />
//       <div className="text-center">
//         <Link to="/login">Have an account? Sign in</Link>
//       </div>
//     </AuthLayout>
//   );
// };

// export default Register;
