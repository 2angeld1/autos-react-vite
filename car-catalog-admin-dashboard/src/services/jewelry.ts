import api from './api';

export enum JewelryCategory {
    RINGS = 'rings',
    NECKLACES = 'necklaces',
    BRACELETS = 'bracelets',
    EARRINGS = 'earrings',
    WATCHES = 'watches',
    ENGAGEMENT = 'engagement',
    SETS = 'sets',
}

export interface JewelryCategoryOption {
    value: string;
    label: string;
    icon: string;
}

export interface JewelryProduct {
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
        jewelryCategory?: string;
        description?: string;
        material?: string;
        carats?: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface JewelryProductInput {
    name: string;
    sku?: string;
    jewelryCategory: string;
    price: number;
    comparePrice?: number;
    stock?: number;
    thumbnail: string;
    images?: string[];
    description?: string;
    material?: string;
    carats?: string;
}

export interface JewelryProductsResponse {
    success: boolean;
    data: JewelryProduct[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export const jewelryService = {
    getCategories: async (): Promise<JewelryCategoryOption[]> => {
        const response = await api.get<{ success: boolean; data: JewelryCategoryOption[] }>('/jewelry/categories');
        return response.data.data;
    },
    getProducts: async (params?: { category?: string; search?: string; page?: number; limit?: number; }): Promise<JewelryProductsResponse> => {
        const response = await api.get<JewelryProductsResponse>('/jewelry/products', { params });
        return response.data;
    },
    getProductById: async (id: string): Promise<JewelryProduct> => {
        const response = await api.get<{ success: boolean; data: JewelryProduct }>(`/jewelry/products/${id}`);
        return response.data.data;
    },
    createProduct: async (data: JewelryProductInput): Promise<JewelryProduct> => {
        const response = await api.post<{ success: boolean; data: JewelryProduct }>('/jewelry/products', data);
        return response.data.data;
    },
    updateProduct: async (id: string, data: Partial<JewelryProductInput>): Promise<JewelryProduct> => {
        const response = await api.put<{ success: boolean; data: JewelryProduct }>(`/jewelry/products/${id}`, data);
        return response.data.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/jewelry/products/${id}`);
    },
};

export default jewelryService;
