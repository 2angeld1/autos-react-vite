import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, ACCESS_TOKEN_KEY } from '@/utils/constants';
import { getFromStorage, removeFromStorage } from '@/utils/helpers';
import toast from 'react-hot-toast';

console.log('🔧 API Base URL:', API_BASE_URL);

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export as apiClient for compatibility
export const apiClient = api;

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getFromStorage(ACCESS_TOKEN_KEY, null);

    console.log('📡 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('📡 Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('📡 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error) => {
    console.error('📡 API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    if (error.response?.status === 401) {
      removeFromStorage(ACCESS_TOKEN_KEY);
      removeFromStorage('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;