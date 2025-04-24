import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", // Set your API base URL in .env if needed
  withCredentials: true, // Send cookies if your backend uses sessions
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;