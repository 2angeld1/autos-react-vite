// Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT || '5000');

// Database
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog';

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// File Upload
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// API Limits
export const MAX_CARS_PER_PAGE = 50;
export const MAX_USERS_PER_PAGE = 100;
export const DEFAULT_PAGE_SIZE = 10;

// Car Constants
export const FUEL_TYPES = ['gas', 'diesel', 'electricity', 'hybrid'] as const;
export const TRANSMISSION_TYPES = ['a', 'm'] as const;

// User Constants
export const USER_ROLES = ['user', 'admin'] as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error'
} as const;