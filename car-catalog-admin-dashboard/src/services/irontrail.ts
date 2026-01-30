import api from './api';

/**
 * IronTrail Categories Enum (Mirrored from Backend)
 */
export enum IronTrailCategory {
    SUSPENSION = 'suspension',
    RESORTES = 'resortes',
    SNORKEL = 'snorkel',
    RESCATE = 'rescate',
    ELEVACION = 'elevacion',
    ILUMINACION = 'iluminacion',
    PROTECCION = 'proteccion',
    ACCESORIOS = 'accesorios',
}

export interface IronTrailCategoryOption {
    value: string;
    label: string;
    icon: string;
}

export interface IronTrailProduct {
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
        ironCategory?: IronTrailCategory;
        description?: string;
        [key: string]: any;
    };
    category?: {
        _id: string;
        name: string;
    };
    brand?: {
        _id: string;
        name: string;
        logo?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface IronTrailProductInput {
    name: string;
    sku?: string;
    ironCategory: IronTrailCategory;
    price: number;
    comparePrice?: number;
    stock?: number;
    thumbnail: string;
    images?: string[];
    description?: string;
    specs?: Record<string, any>;
    brand?: string;
    category?: string;
}

export interface IronTrailProductsResponse {
    success: boolean;
    data: IronTrailProduct[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IronTrailCategoriesResponse {
    success: boolean;
    data: IronTrailCategoryOption[];
}

/**
 * IronTrail Service - API calls for IronTrail module
 */
export const irontrailService = {
    // Get all available categories (from enum)
    getCategories: async (): Promise<IronTrailCategoryOption[]> => {
        const response = await api.get<IronTrailCategoriesResponse>('/irontrail/categories');
        return response.data.data;
    },

    // Get products with filters
    getProducts: async (params?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }): Promise<IronTrailProductsResponse> => {
        const response = await api.get<IronTrailProductsResponse>('/irontrail/products', { params });
        return response.data;
    },

    // Get single product
    getProductById: async (id: string): Promise<IronTrailProduct> => {
        const response = await api.get<{ success: boolean; data: IronTrailProduct }>(`/irontrail/products/${id}`);
        return response.data.data;
    },

    // Create new product
    createProduct: async (data: IronTrailProductInput): Promise<IronTrailProduct> => {
        const response = await api.post<{ success: boolean; data: IronTrailProduct }>('/irontrail/products', data);
        return response.data.data;
    },

    // Update product
    updateProduct: async (id: string, data: Partial<IronTrailProductInput>): Promise<IronTrailProduct> => {
        const response = await api.put<{ success: boolean; data: IronTrailProduct }>(`/irontrail/products/${id}`, data);
        return response.data.data;
    },

    // Delete product
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/irontrail/products/${id}`);
    },
};

export default irontrailService;
