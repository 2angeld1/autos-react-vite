import { useState, useEffect, useCallback, useMemo } from 'react';
import { furnitureService, FurnitureProduct, FurnitureProductInput, FurnitureCategoryOption } from '@/services/furniture';
import toast from 'react-hot-toast';

export const useFurniture = () => {
    const [products, setProducts] = useState<FurnitureProduct[]>([]);
    const [categories, setCategories] = useState<FurnitureCategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<FurnitureProduct | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await furnitureService.getCategories();
            setCategories(data);
        } catch { toast.error('Error al cargar categorías'); }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await furnitureService.getProducts({
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchTerm || undefined,
                page: pagination.page,
                limit: pagination.limit,
            });
            setProducts(response.data);
            setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }));
        } catch { toast.error('Error al cargar muebles'); }
        finally { setLoading(false); }
    }, [selectedCategory, searchTerm, pagination.page, pagination.limit]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleAddProduct = () => { setEditingProduct(undefined); setIsModalOpen(true); };
    const handleEditProduct = (product: FurnitureProduct) => { setEditingProduct(product); setIsModalOpen(true); };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('¿Eliminar este mueble?')) return;
        try { await furnitureService.deleteProduct(id); toast.success('Mueble eliminado'); fetchProducts(); }
        catch { toast.error('Error al eliminar'); }
    };

    const handleSubmit = async (formData: FurnitureProductInput) => {
        try {
            setIsSubmitting(true);
            if (editingProduct) {
                await furnitureService.updateProduct(editingProduct._id, formData);
                toast.success('Mueble actualizado exitosamente');
            } else {
                await furnitureService.createProduct(formData);
                toast.success('Mueble creado exitosamente');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch { toast.error('Error al guardar el mueble'); }
        finally { setIsSubmitting(false); }
    };

    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, page }));

    const categoryOptions = useMemo(() => [{ value: 'all', label: 'Todos', icon: '🛋️' }, ...categories], [categories]);
    const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);

    const stats = useMemo(() => ({
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        lowStockCount: products.filter(p => p.stock > 0 && p.stock < 5).length,
        outOfStockCount: products.filter(p => p.stock === 0).length,
    }), [products]);

    return {
        state: { products, categories, categoryOptions, loading, searchTerm, selectedCategory, isModalOpen, editingProduct, isSubmitting, filteredProducts, stats, pagination },
        actions: { setSearchTerm, setSelectedCategory, handleAddProduct, handleEditProduct, handleDeleteProduct, handleSubmit, handlePageChange, setIsModalOpen, refetch: fetchProducts },
    };
};
