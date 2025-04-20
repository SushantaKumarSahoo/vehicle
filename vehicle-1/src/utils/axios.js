// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://vehicle-bvq2.onrender.com", // Adjust this if deployed
  
});

export default instance;
