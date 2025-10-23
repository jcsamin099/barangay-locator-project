// src/pages/AdminAccountPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAccountPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
    if (storedUser) {
      setFormData({ name: storedUser.name, email: storedUser.email, password: "" });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Profile updated successfully!", "success");
      localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ update local data
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password"
          type="password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminAccountPage;
