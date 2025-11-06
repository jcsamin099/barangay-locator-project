import api from "../api/axios";

// 🧩 Get only residents
export const getResidents = async () => {
  try {
    const response = await api.get("/users");

    // ✅ Handle both array and object responses
    const users = Array.isArray(response.data)
      ? response.data
      : response.data.users || [];

    // ✅ Filter only residents
    return users.filter((user) => user.role === "resident");
  } catch (error) {
    console.error("Error fetching residents:", error);
    throw error;
  }
};

// ➕ Add new resident
export const addResident = async (formData: any) => {
  try {
    const response = await api.post("/users/register", {
      ...formData,
      role: "resident", // force role = resident
    });
    return response.data;
  } catch (error) {
    console.error("Error adding resident:", error);
    throw error;
  }
};

// ✏️ Update resident info
export const updateResident = async (id: string, formData: any) => {
  try {
    const response = await api.put(`/users/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating resident:", error);
    throw error;
  }
};

// 🗑️ Delete resident
export const deleteResident = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resident:", error);
    throw error;
  }
};
