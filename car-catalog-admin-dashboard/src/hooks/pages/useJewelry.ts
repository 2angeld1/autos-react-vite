import { useState, useEffect, useCallback, useMemo } from 'react';
import { jewelryService, JewelryProduct, JewelryProductInput, JewelryCategoryOption } from '@/services/jewelry';
import toast from 'react-hot-toast';

export const useJewelry = () => {
    const [products, setProducts] = useState<JewelryProduct[]>([]);
    const [categories, setCategories] = useState<JewelryCategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<JewelryProduct | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await jewelryService.getCategories();
            setCategories(data);
        } catch { toast.error('Error al cargar categorías'); }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await jewelryService.getProducts({
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchTerm || undefined,
                page: pagination.page,
                limit: pagination.limit,
            });
            setProducts(response.data);
            setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }));
        } catch { toast.error('Error al cargar joyas'); }
        finally { setLoading(false); }
    }, [selectedCategory, searchTerm, pagination.page, pagination.limit]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleAddProduct = () => { setEditingProduct(undefined); setIsModalOpen(true); };
    const handleEditProduct = (product: JewelryProduct) => { setEditingProduct(product); setIsModalOpen(true); };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('¿Eliminar esta joya?')) return;
        try { await jewelryService.deleteProduct(id); toast.success('Joya eliminada'); fetchProducts(); }
        catch { toast.error('Error al eliminar'); }
    };

    const handleSubmit = async (formData: JewelryProductInput) => {
        try {
            setIsSubmitting(true);
            if (editingProduct) {
                await jewelryService.updateProduct(editingProduct._id, formData);
                toast.success('Joya actualizada exitosamente');
            } else {
                await jewelryService.createProduct(formData);
                toast.success('Joya creada exitosamente');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch { toast.error('Error al guardar la joya'); }
        finally { setIsSubmitting(false); }
    };

    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, page }));

    const categoryOptions = useMemo(() => [{ value: 'all', label: 'Todas', icon: '💎' }, ...categories], [categories]);
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
