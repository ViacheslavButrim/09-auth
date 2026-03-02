import axios from "axios";

const BASE_URL = '/api';

export const nextServer = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default nextServer;