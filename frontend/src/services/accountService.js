import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (token, formData) => {
  const response = await axios.put(`${API_URL}/profile`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
