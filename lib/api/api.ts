import axios from "axios";

const BASE_URL = 'https://notehub-api.goit.study' + '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;