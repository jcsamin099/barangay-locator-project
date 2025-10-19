import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Main user route

// 🔹 Get all admins only
export const getAdmins = async (token) => {
  const response = await axios.get(`${API_URL}/role/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // returns only admins (filtered from backend)
};

// ➕ Add new admin
export const addAdmin = async (token, formData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    { ...formData, role: "admin" }, // force role = admin
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ✏️ Update admin info
export const updateAdmin = async (token, id, formData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🗑️ Delete admin
export const deleteAdmin = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 🔘 Set admin online (on login)
export const setAdminOnline = async (userId) => {
  const response = await axios.put(`${API_URL}/${userId}`, {
    status: "online",
  });
  return response.data;
};

// 🔘 Set admin offline (on logout)
export const setAdminOffline = async (userId) => {
  const response = await axios.put(`${API_URL}/${userId}`, {
    status: "offline",
  });
  return response.data;
};
