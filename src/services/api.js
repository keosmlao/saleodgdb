import axios from "axios";

const api = axios.create({
  // baseURL: "http://119.59.124.56:5000/api", //server
  baseURL: "http://localhost:5500/api", //LOCAL 
  timeout: 30000, // 10 seconds
});

// ✅ Automatically attach JWT token (if available) to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
