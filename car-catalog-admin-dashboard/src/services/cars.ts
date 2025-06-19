import { Car, CarFilters, PaginatedResponse } from '@/types';
import { api } from './api';

export interface CreateCarData {
  make: string;
  model: string;
  year: number;
  price: number;
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
  image?: File;
}

export interface UpdateCarData extends Partial<CreateCarData> {
  id: string;
}

export interface CarQueryParams extends Partial<CarFilters> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class CarsService {
  private readonly baseUrl = '/admin/cars';

  async getCars(params?: CarQueryParams): Promise<PaginatedResponse<Car>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get<PaginatedResponse<Car>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getCarById(id: string): Promise<Car> {
    const response = await api.get<Car>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createCar(carData: CreateCarData): Promise<Car> {
    const formData = new FormData();
    
    // Add all car fields to FormData
    Object.entries(carData).forEach(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post<Car>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateCar(id: string, carData: Partial<CreateCarData>): Promise<Car> {
    const formData = new FormData();
    
    Object.entries(carData).forEach(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'image' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put<Car>(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteCar(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async toggleCarAvailability(id: string): Promise<Car> {
    const response = await api.patch<Car>(`${this.baseUrl}/${id}/toggle-availability`);
    return response.data;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await api.delete(`${this.baseUrl}/bulk`, {
      data: { ids },
    });
  }

  async exportCars(params?: CarQueryParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`${this.baseUrl}/export?${queryParams.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async importCars(file: File): Promise<{ success: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ success: number; errors: any[] }>(
      `${this.baseUrl}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export const carsService = new CarsService();