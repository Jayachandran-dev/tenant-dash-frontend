import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://tenant-dash-api.onrender.com/api",  // ← Our Render URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    config.headers["X-Tenant-Id"] = tenantId;
  }
  return config;
});

export default api;