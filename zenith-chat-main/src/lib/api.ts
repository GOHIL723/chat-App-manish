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

export default axios;
