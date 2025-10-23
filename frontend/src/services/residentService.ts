// src/services/residentService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // ✅ Adjust if backend uses /api/auth

// 🧩 Get only residents
export const getResidents = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Handle both array and object response (e.g., { users: [...] })
    const users = Array.isArray(response.data)
      ? response.data
      : response.data.users || [];

    // ✅ Filter only users with role === "resident"
    return users.filter((user) => user.role === "resident");
  } catch (error) {
    console.error("Error fetching residents:", error);
    throw error;
  }
};

// ➕ Add new resident
export const addResident = async (token, formData) => {
  try {
    // ✅ Some backends use /api/users/register, others use /api/auth/register
    const response = await axios.post(
      `${API_URL}/register`,
      { ...formData, role: "resident" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding resident:", error);
    throw error;
  }
};

// ✏️ Update resident info
export const updateResident = async (token, id, formData) => {
  try {
    // ✅ Common backend route: PUT /api/users/:id
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating resident:", error);
    throw error;
  }
};

// 🗑️ Delete resident
export const deleteResident = async (token, id) => {
  try {
    // ✅ Common backend route: DELETE /api/users/:id
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting resident:", error);
    throw error;
  }
};
