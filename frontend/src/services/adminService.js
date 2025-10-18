import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Get dashboard statistics
export const getAdminStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
