import axios from 'axios';
import { BACKEND_API_BASE_URL } from '@/services/api/config';

export interface FurnitureProduct {
    _id?: string;
    title: string;
    category: string;
    price: string;
    image: string;
    images?: string[];
    description?: string;
    specs?: any;
    stock?: number;
    material?: string;
    dimensions?: string;
}

const MOCK_PRODUCTS: FurnitureProduct[] = [
    { _id: '1', title: 'Sofá Modular Velvet', category: 'SALA', price: '2,450', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', material: 'Terciopelo', dimensions: '280x90x80cm' },
    { _id: '2', title: 'Mesa de Comedor Roble', category: 'COMEDOR', price: '1,800', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600', material: 'Roble Macizo', dimensions: '200x90x75cm' },
    { _id: '3', title: 'Cama Platform Florence', category: 'DORMITORIO', price: '3,200', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', material: 'Roble + Tapizado', dimensions: 'King 200x200cm' },
    { _id: '4', title: 'Escritorio Flotante Nordic', category: 'OFICINA', price: '890', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', material: 'MDF Lacado', dimensions: '140x60cm' },
    { _id: '5', title: 'Lámpara Arco Milano', category: 'ILUMINACIÓN', price: '650', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600', material: 'Mármol + Acero' },
    { _id: '6', title: 'Silla Tulip Replica', category: 'SALA', price: '420', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', material: 'Fibra de Vidrio' },
    { _id: '7', title: 'Juego Exterior Teca', category: 'EXTERIOR', price: '3,900', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600', material: 'Teca Certificada' },
    { _id: '8', title: 'Espejo Circular Bronce', category: 'DECORACIÓN', price: '380', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=600', material: 'Metal Bronce' },
    { _id: '9', title: 'Biblioteca Minimalista', category: 'OFICINA', price: '1,200', image: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600', material: 'Madera Natural' },
    { _id: '10', title: 'Butaca Lounge Zen', category: 'SALA', price: '950', image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600', material: 'Lino Premium' },
];

const API_URL = `${BACKEND_API_BASE_URL}/furniture`;

const mapBackendProduct = (p: any): FurnitureProduct => ({
    _id: p._id,
    title: p.name,
    category: p.specs?.furnitureCategory?.toUpperCase() || 'MUEBLES',
    price: p.price?.toLocaleString() || '0',
    image: p.thumbnail || MOCK_PRODUCTS[0].image,
    images: p.images || [p.thumbnail],
    description: p.specs?.description,
    specs: p.specs,
    stock: p.stock,
    material: p.specs?.material,
    dimensions: p.specs?.dimensions,
});

export const furnitureService = {
    getCategories: async () => {
        try {
            const res = await axios.get<{ data: any[] }>(`${API_URL}/categories`);
            return res.data.data || [];
        } catch {
            return [];
        }
    },

    getAllProducts: async (): Promise<FurnitureProduct[]> => {
        try {
            const res = await axios.get(`${API_URL}/products`);
            const data: any = res.data;
            if (data?.data?.length > 0) return data.data.map(mapBackendProduct);
            return MOCK_PRODUCTS;
        } catch {
            return MOCK_PRODUCTS;
        }
    },

    getProductById: async (id: string): Promise<FurnitureProduct | undefined> => {
        try {
            if (id.length === 24) {
                const res = await axios.get(`${API_URL}/products/${id}`);
                const data = res.data as any;
                if (data?.data) return mapBackendProduct(data.data);
            }
        } catch { /* fallback */ }
        return MOCK_PRODUCTS.find(p => p._id === id);
    },
};
