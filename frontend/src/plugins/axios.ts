import axios from "axios";
import { useAuthStore } from "@/modules/auth/auth.store";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
