import axios from 'axios';
import { BACKEND_API_BASE_URL } from '@/services/api/config';

// Datos Mock de Respaldo (Backup Data)
// Si el backend falla o está vacío, usaremos esto para la demo.
import suspensionImg from '../assets/suspension.png';
import springsImg from '../assets/springs.png';
import snorkelImg from '../assets/snorkel.png';
import specsTruckImg from '../assets/specs_truck.png';

export interface IronProduct {
    _id?: string;
    title: string;
    category: string;
    price: string;
    image: string;
    images?: string[];
    description?: string;
    specs?: any;
    stock?: number;
}

const MOCK_PRODUCTS: IronProduct[] = [
    { _id: '1', title: 'Kit MRR Pro 2.0', category: 'SUSPENSIÓN', price: '1,299', image: suspensionImg },
    { _id: '2', title: 'Resortes Heavy Duty', category: 'RESORTES', price: '249', image: springsImg },
    { _id: '3', title: 'Snorkel Safari Pro', category: 'ACCESORIOS', price: '189', image: snorkelImg },
    { _id: '4', title: 'Amortiguador Nitro 3000', category: 'SUSPENSIÓN', price: '899', image: suspensionImg },
    { _id: '5', title: 'Kit Lift 2"', category: 'ELEVACIÓN', price: '1,599', image: springsImg },
    { _id: '6', title: 'Amortiguador Racing', category: 'SUSPENSIÓN', price: '1,099', image: suspensionImg },
    { _id: '7', title: 'Winch 12000lbs', category: 'RESCATE', price: '599', image: specsTruckImg },
    { _id: '8', title: 'Barras LED 50"', category: 'ILUMINACIÓN', price: '349', image: snorkelImg },
];

// Categoría labels para mapeo
const CATEGORY_LABELS: Record<string, string> = {
    'suspension': 'SUSPENSIÓN',
    'resortes': 'RESORTES',
    'snorkel': 'SNORKEL',
    'rescate': 'RESCATE',
    'elevacion': 'ELEVACIÓN',
    'iluminacion': 'ILUMINACIÓN',
    'proteccion': 'PROTECCIÓN',
    'accesorios': 'ACCESORIOS',
};

// URL del endpoint IronTrail (usa variable de entorno desde config)
const API_URL = `${BACKEND_API_BASE_URL}/irontrail`;

/**
 * Mapea un producto del backend al formato IronProduct del frontend
 */
const mapBackendProduct = (p: any): IronProduct => ({
    _id: p._id,
    title: p.name,
    category: CATEGORY_LABELS[p.specs?.ironCategory] || p.specs?.ironCategory?.toUpperCase() || 'GENERAL',
    price: p.price?.toLocaleString() || '0',
    image: p.thumbnail || suspensionImg,
    images: p.images || [p.thumbnail],
    description: p.specs?.description || p.seoDescription,
    specs: p.specs,
    stock: p.stock,
});

export const ironService = {
    /**
     * Obtiene todas las categorías disponibles (desde el enum del backend)
     */
    getCategories: async () => {
        try {
            const response = await axios.get<{ data: any[] }>(`${API_URL}/categories`);
            return response.data.data || [];
        } catch (error) {
            console.warn('Could not fetch categories from backend');
            return Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label, icon: '🔧' }));
        }
    },

    /**
     * Obtiene todos los productos de IronTrail
     * Intenta conectar al backend, si falla usa MOCK.
     */
    getAllProducts: async (): Promise<IronProduct[]> => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            const data: any = response.data;
            
            if (data && data.data && data.data.length > 0) {
                return data.data.map(mapBackendProduct);
            } else {
                console.warn('Backend returned no IronTrail products. Using MOCK data.');
                return MOCK_PRODUCTS;
            }
        } catch (error) {
            console.error('IronTrail Backend Error:', error);
            // Fallback silencioso a Mock para la demo
            return MOCK_PRODUCTS;
        }
    },

    /**
     * Obtiene productos por categoría
     */
    getProductsByCategory: async (category: string): Promise<IronProduct[]> => {
        try {
            // Si la categoría es 'TODOS', traer todos
            if (category === 'TODOS' || category === 'all') {
                return ironService.getAllProducts();
            }
            
            // Intentar filtrar desde el backend
            const categoryKey = Object.entries(CATEGORY_LABELS)
                .find(([_, label]) => label === category.toUpperCase())?.[0] || category.toLowerCase();
            
            const response = await axios.get(`${API_URL}/products`, { 
                params: { category: categoryKey } 
            });
            const data: any = response.data;
            
            if (data && data.data && data.data.length > 0) {
                return data.data.map(mapBackendProduct);
            }
        } catch (error) {
            console.warn('Backend filter failed, filtering locally');
        }
        
        // Fallback: filtrar localmente desde todos los productos
        const all = await ironService.getAllProducts();
        return all.filter(p => p.category.toUpperCase().includes(category.toUpperCase()));
    },

    /**
     * Obtiene un producto por ID
     */
    getProductById: async (id: string): Promise<IronProduct | undefined> => {
        try {
            // Intentar buscar en el backend real si es un ID de mongo válido (24 chars)
            if (id.length === 24) {
               const response = await axios.get(`${API_URL}/products/${id}`);
               const data = response.data as any;
               if (data && data.data) {
                    return mapBackendProduct(data.data);
               }
            }
        } catch (e) {
            console.warn('Backend fetch failed, using mock');
        }
        
        // Fallback a Mock
        return MOCK_PRODUCTS.find(p => p._id === id);
    },

    /**
     * Busca productos por texto
     */
    searchProducts: async (searchTerm: string): Promise<IronProduct[]> => {
        try {
            const response = await axios.get(`${API_URL}/products`, { 
                params: { search: searchTerm } 
            });
            const data: any = response.data;
            
            if (data && data.data) {
                return data.data.map(mapBackendProduct);
            }
        } catch (error) {
            console.warn('Backend search failed');
        }
        
        // Fallback: buscar localmente
        const all = await ironService.getAllProducts();
        return all.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
};
