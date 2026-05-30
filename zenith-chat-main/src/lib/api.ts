import axios from 'axios';

// Dev mein directly backend URL use karo (TanStack SSR Vite proxy bypass karta hai)
// Production mein VITE_BACKEND_URL env var use hota hai
const BACKEND_URL = import.meta.env.DEV
  ? 'http://localhost:5000'  // Local backend
  : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

export { BACKEND_URL };

// Axios globally configure — baseURL + cookies
axios.defaults.baseURL = `${BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

// Intercept requests to attach the JWT token from localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('chat_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
