import axios from 'axios';

// ✅ SINGLE SOURCE OF TRUTH — sirf yahan URL change karo
// Development: http://localhost:5000
// Production:  .env file mein VITE_BACKEND_URL set karo
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Axios globally configure — baseURL + cookies
axios.defaults.baseURL = `${BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

export default axios;
