import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function AdminLogin() {
  const { login } = useAuth();
  const [usernameOrEmail, setU] = useState("");
  const [password, setP] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await login(usernameOrEmail, password);
      // Admin sẽ tự bị redirect đến dashboard rồi check role
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      alert("Admin login failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h2 className="text-center mb-4">Admin Login</h2>

      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          placeholder="Admin username/email"
          value={usernameOrEmail}
          onChange={(e) => setU(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />

        <button type="submit" className="btn btn-danger w-100">
          Login as Admin
        </button>
      </form>
    </div>
  );
}
