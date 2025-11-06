import api from "../api/axios";

// ✅ Get user profile
export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// ✅ Update user profile
export const updateProfile = async (formData) => {
  const response = await api.put("/users/profile", formData);
  return response.data;
};
