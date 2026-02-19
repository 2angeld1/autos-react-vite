import axios from 'axios';
import { BACKEND_API_BASE_URL } from '@/services/api/config';

export interface JewelProduct {
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
}

const MOCK_PRODUCTS: JewelProduct[] = [
    { _id: '1', title: 'Anillo Solitario Eterno', category: 'ANILLOS', price: '1,850', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', material: 'Oro 18k' },
    { _id: '2', title: 'Collar Lágrima de Luna', category: 'COLLARES', price: '950', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', material: 'Plata 925' },
    { _id: '3', title: 'Reloj Maestro Suizo', category: 'RELOJES', price: '4,200', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', material: 'Acero PVD' },
    { _id: '4', title: 'Pulsera Diamante Tennis', category: 'PULSERAS', price: '2,300', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', material: 'Oro Blanco 14k' },
    { _id: '5', title: 'Aretes Star Drop', category: 'ARETES', price: '680', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', material: 'Plata Rhodiada' },
    { _id: '6', title: 'Set Nupcial Royal', category: 'SETS', price: '6,500', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600', material: 'Oro 18k' },
    { _id: '7', title: 'Gargantilla Esmeralda', category: 'COLLARES', price: '3,100', image: '/images/gargantilla-esmeralda.png', material: 'Oro y Esmeraldas' },
    { _id: '8', title: 'Pendientes Gota Rubí', category: 'ARETES', price: '1,450', image: '/images/pendientes-rubi.png', material: 'Oro Rosa' },
    { _id: '9', title: 'Reloj Cronógrafo Noir', category: 'RELOJES', price: '2,900', image: '/images/reloj-cronografo-noir.png', material: 'Titano' },
    { _id: '10', title: 'Brazale Diamantado', category: 'PULSERAS', price: '1,750', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', material: 'Platino' },
];

const API_URL = `${BACKEND_API_BASE_URL}/jewelry`;

const mapBackendProduct = (p: any): JewelProduct => ({
    _id: p._id,
    title: p.name,
    category: p.specs?.jewelryCategory?.toUpperCase() || 'JOYERÍA',
    price: p.price?.toLocaleString() || '0',
    image: p.thumbnail || MOCK_PRODUCTS[0].image,
    images: p.images || [p.thumbnail],
    description: p.specs?.description,
    specs: p.specs,
    stock: p.stock,
    material: p.specs?.material,
});

export const jewelService = {
    getCategories: async () => {
        try {
            const res = await axios.get<{ data: any[] }>(`${API_URL}/categories`);
            return res.data.data || [];
        } catch {
            return [];
        }
    },

    getAllProducts: async (): Promise<JewelProduct[]> => {
        try {
            const res = await axios.get(`${API_URL}/products`);
            const data: any = res.data;
            if (data?.data?.length > 0) return data.data.map(mapBackendProduct);
            return MOCK_PRODUCTS;
        } catch {
            return MOCK_PRODUCTS;
        }
    },

    getProductById: async (id: string): Promise<JewelProduct | undefined> => {
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
