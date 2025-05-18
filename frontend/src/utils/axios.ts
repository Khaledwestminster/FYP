import axios from 'axios';

// Get the backend URL from environment variables
// @ts-ignore - Ignore TypeScript error for Vite's import.meta.env
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const instance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance; 