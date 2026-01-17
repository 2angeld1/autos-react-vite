import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, ACCESS_TOKEN_KEY } from '@/utils/constants';
import { getFromStorage, removeFromStorage } from '@/utils/helpers';
import toast from 'react-hot-toast';

console.log('🔧 API Base URL:', API_BASE_URL);

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: Math.max(API_TIMEOUT, 120000), // Ensure at least 2 minutes
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
      code: error.code
    });

    if (error.code === 'ECONNABORTED') {
      toast.error('The request timed out. Please check your connection or try a smaller file.');
    } else if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
    } else if (error.response?.status === 401) {
        // Avoid redirecting to login for authentication endpoints (login/register/2fa)
        const requestUrl = error.config?.url || '';
        const isAuthEndpoint = /auth\/(login|register|verify-2fa|resend-2fa)/i.test(requestUrl);

        if (!isAuthEndpoint) {
          removeFromStorage(ACCESS_TOKEN_KEY);
          removeFromStorage('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
    } else if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;