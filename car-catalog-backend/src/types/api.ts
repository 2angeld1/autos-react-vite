import { Request } from 'express';

export interface IApiResponse<T = unknown> {
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

export interface IErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  stack?: string;
}

export interface IPaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
}

export interface IAuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}