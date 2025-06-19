// src/types/index.ts
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Car {
  _id: string;
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  description: string;
  fuel_type: 'gas' | 'diesel' | 'electricity' | 'hybrid';
  transmission: 'a' | 'm';
  cylinders: number;
  class: string;
  displacement: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  features?: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalCars: number;
  totalUsers: number;
  activeCars: number;
  activeUsers: number;
  recentCars: Car[];
}

export { apiClient } from './api';
export { authService } from './auth';
export type { LoginResponse, TwoFactorSetupResponse } from './auth';