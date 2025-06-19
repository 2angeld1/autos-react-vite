// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'car_admin_access_token';

// Authentication
export const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'car_admin_refresh_token';

// Features
export const ENABLE_2FA = import.meta.env.VITE_ENABLE_2FA === 'true';
export const ENABLE_REMEMBER_ME = import.meta.env.VITE_ENABLE_REMEMBER_ME === 'true';

// File Upload
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');

// App Configuration
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Table Configuration
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Car Constants
export const FUEL_TYPES = [
  { value: 'gas', label: 'Gas' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electricity', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

export const TRANSMISSION_TYPES = [
  { value: 'a', label: 'Automatic' },
  { value: 'm', label: 'Manual' },
] as const;

export const CAR_CLASSES = [
  'Compact',
  'Midsize',
  'Large',
  'SUV',
  'Pickup',
  'Minivan',
  'Sports',
  'Luxury',
  'Electric',
] as const;

export const POPULAR_MAKES = [
  'Acura',
  'Audi',
  'BMW',
  'Chevrolet',
  'Ford',
  'Honda',
  'Hyundai',
  'Lexus',
  'Mercedes-Benz',
  'Nissan',
  'Tesla',
  'Toyota',
  'Volkswagen',
] as const;

// User Constants
export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
] as const;

// Status Constants
export const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const;

// Time Constants
export const TIME_PERIODS = [
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'never', label: 'Never logged in' },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CAR_CREATED: 'Car created successfully',
  CAR_UPDATED: 'Car updated successfully',
  CAR_DELETED: 'Car deleted successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_RESET: 'Password reset successfully',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
} as const;