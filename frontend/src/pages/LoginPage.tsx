// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await login({ email, password });
      // backend returns { token, user: { id, name, role } }
      const token = res.token;
      const user = res.user || res;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name || "");
      // redirect admin to admin dashboard
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // or resident view
      }
    } catch (error: any) {
      console.error("login error", error);
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {err && <div className="text-red-600 mb-3">{err}</div>}

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-2 border rounded" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full mb-3 p-2 border rounded" required />

        <button className="w-full bg-blue-600 text-white p-2 rounded">Log In</button>

        <p className="mt-3 text-sm text-center">
          Don't have an account yet? <Link to="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
