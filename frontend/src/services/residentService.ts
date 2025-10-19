// src/services/residentService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Assuming /api/users returns all users

// 🧩 Get only residents
export const getResidents = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // ✅ Filter only residents
  return response.data.filter((user) => user.role === "resident");
};

// ➕ Add new resident
export const addResident = async (token, formData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    { ...formData, role: "resident" }, // ✅ Automatically assign resident role
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ✏️ Update resident
export const updateResident = async (token, id, formData) => {
  const response = await axios.put(`${API_URL}/update/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🗑️ Delete resident
export const deleteResident = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
