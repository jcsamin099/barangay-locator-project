import api from "../api/axios";

// 🧩 Get only residents
export const getResidents = async () => {
  try {
    const response = await api.get("/users");

    // ✅ Normalize data in case backend returns different shapes
    const users = Array.isArray(response.data)
      ? response.data
      : response.data.users || [];

    // ✅ Filter residents only
    return users.filter((user: any) => user.role === "resident");
  } catch (error: any) {
    console.error("Error fetching residents:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch residents.");
  }
};

// ➕ Add new resident
export const addResident = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/users/register", {
      ...formData,
      role: "resident", // force resident role
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding resident:", error);
    throw new Error(error.response?.data?.message || "Failed to add resident.");
  }
};

// ✏️ Update resident info
export const updateResident = async (
  id: string,
  formData: {
    name?: string;
    email?: string;
    password?: string;
  }
) => {
  try {
    const response = await api.put(`/users/${id}`, formData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating resident:", error);
    throw new Error(error.response?.data?.message || "Failed to update resident.");
  }
};

// 🗑️ Delete resident
export const deleteResident = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting resident:", error);
    throw new Error(error.response?.data?.message || "Failed to delete resident.");
  }
};
