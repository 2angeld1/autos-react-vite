import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Interfaz para el payload del JWT
interface JWTPayload {
  id: Types.ObjectId | string;
  email: string;
  role: string;
}

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token - SIMPLIFICADO
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const tokenPayload = {
    id: payload.id.toString(),
    email: payload.email,
    role: payload.role
  };
  
  // Usar directamente sin tipos complejos
  return jwt.sign(tokenPayload, secret, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): Record<string, unknown> => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.verify(token, secret) as Record<string, unknown>;
};

/**
 * Generate unique ID
 */
export const generateUniqueId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Sanitize user data (remove password) - SIMPLIFICADO
 */
export const sanitizeUser = (user: Record<string, unknown>): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev
  };
};

/**
 * Format price to currency
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Clean object by removing undefined/null values
 */
export const cleanObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  
  return cleaned;
};

/**
 * Generate car slug for SEO
 */
export const generateCarSlug = (make: string, model: string, year: number): string => {
  const slug = `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return slug;
};

/**
 * Escape regex special characters
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Check if string is valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};