import { api } from './api';

export interface Brand {
  _id: string;
  name: string;
  country: string;
  founded?: number;
  logo?: string;
  website?: string;
  status: 'active' | 'inactive';
  featured: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  status: 'active' | 'inactive';
  parentCategory?: Category | null;
}

export interface Accessory {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  compatible: string[];
  image?: string;
  status: 'active' | 'out_of_stock' | 'inactive';
}

export const inventoryService = {
  // BRANDS
  getBrands: async () => {
    const response = await api.get('/inventory/brands');
    return response.data;
  },
  createBrand: async (data: FormData | Partial<Brand>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post('/inventory/brands', data, { headers });
    return response.data;
  },
  updateBrand: async (id: string, data: FormData | Partial<Brand>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/inventory/brands/${id}`, data, { headers });
    return response.data;
  },
  deleteBrand: async (id: string) => {
    const response = await api.delete(`/inventory/brands/${id}`);
    return response.data;
  },

  // CATEGORIES
  getCategories: async () => {
    const response = await api.get('/inventory/categories');
    return response.data;
  },
  createCategory: async (data: FormData | Partial<Category>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post('/inventory/categories', data, { headers });
    return response.data;
  },
  updateCategory: async (id: string, data: FormData | Partial<Category>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/inventory/categories/${id}`, data, { headers });
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/inventory/categories/${id}`);
    return response.data;
  },

  // ACCESSORIES
  getAccessories: async () => {
    const response = await api.get('/inventory/accessories');
    return response.data;
  },
  createAccessory: async (data: FormData | Partial<Accessory>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post('/inventory/accessories', data, { headers });
    return response.data;
  },
  updateAccessory: async (id: string, data: FormData | Partial<Accessory>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/inventory/accessories/${id}`, data, { headers });
    return response.data;
  },
  deleteAccessory: async (id: string) => {
    const response = await api.delete(`/inventory/accessories/${id}`);
    return response.data;
  },
};
