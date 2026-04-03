import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api"
});

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`
      };
    }
  } catch (err) {
    // nothing
  }
  return config;
});

export default api;
