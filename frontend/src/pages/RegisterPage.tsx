import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await register({ name, email, password }); // role omitted — backend defaults to "resident"
      alert("Registered successfully! Please log in.");
      navigate("/login");
    } catch (error: any) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {err && <div className="text-red-600 mb-3">{err}</div>}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
