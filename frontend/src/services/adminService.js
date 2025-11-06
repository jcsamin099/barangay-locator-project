import api from "../api/axios";

// 🔹 Get all admins only
export const getAdmins = async () => {
  const response = await api.get("/users/role/admins");
  return response.data;
};

// ➕ Add new admin
export const addAdmin = async (formData) => {
  const response = await api.post("/users/register", {
    ...formData,
    role: "admin", // force role = admin
  });
  return response.data;
};

// ✏️ Update admin info
export const updateAdmin = async (id, formData) => {
  const response = await api.put(`/users/${id}`, formData);
  return response.data;
};

// 🗑️ Delete admin
export const deleteAdmin = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// 🔘 Set admin online (on login)
export const setAdminOnline = async (userId) => {
  const response = await api.put(`/users/${userId}`, { status: "online" });
  return response.data;
};

// 🔘 Set admin offline (on logout)
export const setAdminOffline = async (userId) => {
  const response = await api.put(`/users/${userId}`, { status: "offline" });
  return response.data;
};
