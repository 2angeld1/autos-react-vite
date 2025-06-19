export * from './car';
export * from './user';
export * from './auth';

// Common API types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface DashboardStats {
  totalCars: number;
  totalUsers: number;
  activeCars: number;
  activeUsers: number;
  recentCars: Car[];
  recentUsers: User[];
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  rowKey: keyof T | string;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (record: T) => void;
  rowActions?: (record: T) => React.ReactNode;
  emptyText?: string;
  className?: string;
}

// Import necessary React types
import React from 'react';
import { Car, User } from './car';