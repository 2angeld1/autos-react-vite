import api from './api';

export enum ProjectCategory {
    RESIDENTIAL = 'residencial',
    COMMERCIAL = 'comercial',
    INDUSTRIAL = 'industrial',
    INSTITUTIONAL = 'institucional',
    MIXED = 'mixto'
}

export interface ArchitectureCategoryOption {
    value: string;
    label: string;
    icon: string;
    subcategories?: { value: string; label: string; }[];
}

export interface ArchitectureProject {
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
    files?: string[];
    specs: {
        projectCategory?: string;
        description?: string;
        area?: number;
        levels?: number;
        style?: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ArchitectureProjectInput {
    name: string;
    sku?: string;
    projectCategory: string;
    projectSubCategory?: string;
    price: number;
    comparePrice?: number;
    stock?: number;
    thumbnail: string;
    images?: string[];
    files?: string[];
    description?: string;
    area?: number;
    levels?: number;
    style?: string;
}

export interface ArchitectureProjectsResponse {
    success: boolean;
    data: ArchitectureProject[];
    pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export const architectureService = {
    getCategories: async (): Promise<ArchitectureCategoryOption[]> => {
        const response = await api.get<{ success: boolean; data: ArchitectureCategoryOption[] }>('/architecture/categories');
        return response.data.data;
    },
    getProducts: async (params?: { category?: string; group?: string; search?: string; page?: number; limit?: number; }): Promise<ArchitectureProjectsResponse> => {
        const response = await api.get<ArchitectureProjectsResponse>('/architecture/projects', { params });
        return response.data;
    },
    getProjectById: async (id: string): Promise<ArchitectureProject> => {
        const response = await api.get<{ success: boolean; data: ArchitectureProject }>(`/architecture/projects/${id}`);
        return response.data.data;
    },
    createProduct: async (data: ArchitectureProjectInput): Promise<ArchitectureProject> => {
        const response = await api.post<{ success: boolean; data: ArchitectureProject }>('/architecture/projects', data);
        return response.data.data;
    },
    updateProduct: async (id: string, data: Partial<ArchitectureProjectInput>): Promise<ArchitectureProject> => {
        const response = await api.put<{ success: boolean; data: ArchitectureProject }>(`/architecture/projects/${id}`, data);
        return response.data.data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/architecture/projects/${id}`);
    },
};

export default architectureService;
