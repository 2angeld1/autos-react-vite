import { BACKEND_API_BASE_URL } from './config';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export const inventoryService = {
  /**
   * Obtener todas las categorías activas
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/inventory/categories`);
      const json = await response.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  /**
   * Obtener todas las marcas
   */
  getBrands: async (): Promise<Brand[]> => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/inventory/brands`);
      const json = await response.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }
};
