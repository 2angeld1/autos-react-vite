import { useState, useEffect, useCallback, useMemo } from 'react';
import { irontrailService, IronTrailProduct, IronTrailProductInput, IronTrailCategoryOption } from '@/services/irontrail';
import toast from 'react-hot-toast';

export const useIronTrail = () => {
    const [products, setProducts] = useState<IronTrailProduct[]>([]);
    const [categories, setCategories] = useState<IronTrailCategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IronTrailProduct | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories from backend (enum)
    const fetchCategories = useCallback(async () => {
        try {
            const data = await irontrailService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        }
    }, []);

    // Fetch products with filters
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await irontrailService.getProducts({
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchTerm || undefined,
                page: pagination.page,
                limit: pagination.limit,
            });
            setProducts(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
                totalPages: response.pagination.totalPages,
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load IronTrail products');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, searchTerm, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handlers
    const handleAddProduct = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: IronTrailProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await irontrailService.deleteProduct(id);
            toast.success('Producto eliminado exitosamente');
            fetchProducts();
        } catch (error) {
            toast.error('Error al eliminar el producto');
        }
    };

    const handleSubmit = async (formData: IronTrailProductInput) => {
        try {
            setIsSubmitting(true);
            if (editingProduct) {
                await irontrailService.updateProduct(editingProduct._id, formData);
                toast.success('Producto actualizado exitosamente');
            } else {
                await irontrailService.createProduct(formData);
                toast.success('Producto creado exitosamente');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error al guardar el producto');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    // Category labels for display (including "All" option)
    const categoryOptions = useMemo(() => [
        { value: 'all', label: 'Todos', icon: '🔮' },
        ...categories
    ], [categories]);

    // Filtered products (client-side filtering for instant results)
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [products, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
        const outOfStockCount = products.filter(p => p.stock === 0).length;
        const activeCount = products.filter(p => p.isAvailable).length;

        return {
            totalValue,
            lowStockCount,
            outOfStockCount,
            activeCount,
            totalProducts: products.length,
        };
    }, [products]);

    return {
        state: {
            products,
            categories,
            categoryOptions,
            loading,
            searchTerm,
            selectedCategory,
            isModalOpen,
            editingProduct,
            isSubmitting,
            filteredProducts,
            stats,
            pagination,
        },
        actions: {
            setSearchTerm,
            setSelectedCategory,
            handleAddProduct,
            handleEditProduct,
            handleDeleteProduct,
            handleSubmit,
            handlePageChange,
            setIsModalOpen,
            refetch: fetchProducts,
        }
    };
};
