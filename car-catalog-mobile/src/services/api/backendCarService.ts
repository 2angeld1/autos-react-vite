import { backendApi } from './backendApi';

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

export interface CarFilters {
  search?: string;
  make?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  isAvailable?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class BackendCarService {
  async fetchCars(filters?: CarFilters, page = 1, limit = 12): Promise<PaginatedResponse<Car>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await backendApi.get<{
      success: boolean;
      data: PaginatedResponse<Car>;
    }>(`/cars?${params}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch cars');
  }

  async fetchCarById(id: string): Promise<Car> {
    const response = await backendApi.get<{
      success: boolean;
      data: Car;
    }>(`/cars/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch car');
  }

  async fetchFeaturedCars(limit = 6): Promise<Car[]> {
    const response = await backendApi.get<{
      success: boolean;
      data: Car[];
    }>(`/cars/featured?limit=${limit}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch featured cars');
  }

  async searchCars(query: string, filters?: CarFilters): Promise<Car[]> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await backendApi.get<{
      success: boolean;
      data: Car[];
    }>(`/cars/search?${params}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to search cars');
  }

  async fetchMakes(): Promise<string[]> {
    const response = await backendApi.get<{
      success: boolean;
      data: string[];
    }>('/cars/makes');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch makes');
  }

  async fetchModelsByMake(make: string): Promise<string[]> {
    const response = await backendApi.get<{
      success: boolean;
      data: string[];
    }>(`/cars/models/${make}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch models');
  }

  async fetchCarStats(): Promise<any> {
    const response = await backendApi.get<{
      success: boolean;
      data: any;
    }>('/cars/stats');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch car stats');
  }

  async createCar(carData: Partial<Car>): Promise<Car> {
    const response = await backendApi.post<{
      success: boolean;
      data: Car;
    }>('/cars', carData);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create car');
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const response = await backendApi.put<{
      success: boolean;
      data: Car;
    }>(`/cars/${id}`, carData);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update car');
  }

  async deleteCar(id: string): Promise<void> {
    const response = await backendApi.delete<{
      success: boolean;
    }>(`/cars/${id}`);
    
    if (!response.data.success) {
      throw new Error('Failed to delete car');
    }
  }
}

export const backendCarService = new BackendCarService();