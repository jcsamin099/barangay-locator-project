import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({ name, email, password }); // backend defaults to "resident"

      await Swal.fire({
        icon: "success",
        title: "Registered Successfully!",
        text: "Your account has been created. You can now log in.",
        confirmButtonColor: "#16a34a", // green-600
      });

      navigate("/login");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626", // red-600
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

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

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded transition">
          Register
        </button>

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
