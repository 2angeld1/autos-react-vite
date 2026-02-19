import api from './api';

export enum FurnitureCategory {
    LIVING = 'living',
    DINING = 'dining',
    BEDROOM = 'bedroom',
    OFFICE = 'office',
    OUTDOOR = 'outdoor',
    LIGHTING = 'lighting',
    DECOR = 'decor',
}

export interface FurnitureCategoryOption {
    value: string;
    label: string;
    icon: string;
}

export interface FurnitureProduct {
    _id: string;
    name: string;
    slug: string;
    sku?: string;
    price: number;
    comparePrice?: number;
    stock: number;
    isAvailable: boolean;
    thumbnail: string;
    images: string[];
    specs: {
        furnitureCategory?: string;
        description?: string;
        material?: string;
        dimensions?: string;
        style?: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface FurnitureProductInput {
    name: string;
    sku?: string;
    furnitureCategory: string;
    price: number;
    comparePrice?: number;
    stock?: number;
    thumbnail: string;
    images?: string[];
    description?: string;
    material?: string;
    dimensions?: string;
    style?: string;
}

export interface FurnitureProductsResponse {
    success: boolean;
    data: FurnitureProduct[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export const furnitureService = {
    getCategories: async (): Promise<FurnitureCategoryOption[]> => {
        const response = await api.get<{ success: boolean; data: FurnitureCategoryOption[] }>('/furniture/categories');
        return response.data.data;
    },
    getProducts: async (params?: { category?: string; search?: string; page?: number; limit?: number; }): Promise<FurnitureProductsResponse> => {
        const response = await api.get<FurnitureProductsResponse>('/furniture/products', { params });
        return response.data;
    },
    getProductById: async (id: string): Promise<FurnitureProduct> => {
        const response = await api.get<{ success: boolean; data: FurnitureProduct }>(`/furniture/products/${id}`);
        return response.data.data;
    },
    createProduct: async (data: FurnitureProductInput): Promise<FurnitureProduct> => {
        const response = await api.post<{ success: boolean; data: FurnitureProduct }>('/furniture/products', data);
        return response.data.data;
    },
    updateProduct: async (id: string, data: Partial<FurnitureProductInput>): Promise<FurnitureProduct> => {
        const response = await api.put<{ success: boolean; data: FurnitureProduct }>(`/furniture/products/${id}`, data);
        return response.data.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/furniture/products/${id}`);
    },
};

export default furnitureService;
