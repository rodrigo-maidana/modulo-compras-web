// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.rodrigomaidana.com:8080',
});

axiosInstance.interceptors.request.use((config) => {
  // Excluir endpoints de autenticación de la inclusión del token
  if (!config.url.includes('/auth/')) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
