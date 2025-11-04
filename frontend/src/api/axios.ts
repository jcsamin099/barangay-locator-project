// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "mongodb+srv://juliusceasarsamin_db_user:t2Yu1nBlHEqkMOYI@cluster0.nciwkzv.mongodb.net/?appName=Cluster0",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
