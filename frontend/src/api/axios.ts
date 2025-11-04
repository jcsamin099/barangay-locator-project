import axios from "axios";

// Dynamically set the base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000/api" // local dev
      : "https://barangay-locator-backend.onrender.com/api"), // your Render backend
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
