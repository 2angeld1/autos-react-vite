import { Types } from 'mongoose';

export interface ICar {
  _id?: Types.ObjectId;
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  description: string;
  fuel_type: 'gas' | 'diesel' | 'electricity' | 'hybrid';
  transmission: 'a' | 'm'; // automatic, manual
  cylinders: number;
  class: string;
  displacement: number;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  features?: string[];
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICarFilters {
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  fuel_type?: string;
  transmission?: string;
  class?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ICarResponse {
  success: boolean;
  data: ICar[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: ICarFilters;
}

export interface ICarStats {
  totalCars: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  totalMakes: number;
  totalClasses: number;
}