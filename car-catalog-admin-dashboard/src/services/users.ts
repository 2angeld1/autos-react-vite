import { User, UserFilters, PaginatedResponse } from '@/types';
import { api } from './api';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: File;
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: string;
  password?: string;
}

export interface UserQueryParams extends Partial<UserFilters> {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UsersService {
  private readonly baseUrl = '/admin/users';

  async getUsers(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get<PaginatedResponse<User>>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post<User>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateUser(id: string, userData: Partial<CreateUserData>): Promise<User> {
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put<User>(`${this.baseUrl}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async toggleUserStatus(id: string): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/toggle-status`);
    return response.data;
  }

  async changeUserRole(id: string, role: 'admin' | 'user'): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/${id}/role`, { role });
    return response.data;
  }

  async resetUserPassword(id: string): Promise<{ temporaryPassword: string }> {
    const response = await api.post<{ temporaryPassword: string }>(
      `${this.baseUrl}/${id}/reset-password`
    );
    return response.data;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await api.delete(`${this.baseUrl}/bulk`, {
      data: { ids },
    });
  }

  async exportUsers(params?: UserQueryParams): Promise<Blob> {
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

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    admins: number;
    users: number;
    recentUsers: User[];
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export const usersService = new UsersService();