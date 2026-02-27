import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://notehub-api.goit.study";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;