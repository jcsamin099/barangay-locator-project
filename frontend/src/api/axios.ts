// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL?.trim() || // ✅ use .env if defined
    (import.meta.env.DEV
      ? "http://localhost:5000/api" // ✅ local dev
      : "https://barangay-backend.onrender.com/api"), // ✅ deployed backend
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
