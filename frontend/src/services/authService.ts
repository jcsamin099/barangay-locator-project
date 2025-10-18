// src/services/authService.ts
import api from "../api/axios";

export type LoginResponse = {
  token: string;
  user: { id?: string; _id?: string; name: string; role: string; email?: string };
};

export const register = async (payload: { name: string; email: string; password: string; role?: string }) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: { email: string; password: string }): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const verify = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};
