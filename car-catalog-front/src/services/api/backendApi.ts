import axios from 'axios';
import { BACKEND_API_BASE_URL, BACKEND_API_TIMEOUT } from './config';

// Create axios instance for backend API
export const backendApi = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  timeout: BACKEND_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - just clear it but don't redirect on public site
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default backendApi;