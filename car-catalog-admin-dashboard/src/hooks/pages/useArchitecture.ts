import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { architectureService, ArchitectureProject, ArchitectureProjectInput, ArchitectureCategoryOption } from '@/services/architecture';
import toast from 'react-hot-toast';

export const useArchitecture = () => {
    const [searchParams] = useSearchParams();
    const queryCategory = searchParams.get('category') || 'all';
    const queryGroup = searchParams.get('group') || null;

    const [products, setProducts] = useState<ArchitectureProject[]>([]);
    const [categories, setCategories] = useState<ArchitectureCategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(queryCategory);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(queryGroup);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ArchitectureProject | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sincronizar con cambios en la URL (ej: clics en el sidebar)
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || 'all');
        setSelectedGroup(searchParams.get('group') || null);
    }, [searchParams]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await architectureService.getCategories();
            setCategories(data);
        } catch { toast.error('Error al cargar categorías'); }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await architectureService.getProducts({
                group: selectedGroup || undefined,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                search: searchTerm || undefined,
                page: pagination.page,
                limit: pagination.limit,
            });
            setProducts(response.data);
            setPagination(prev => ({ ...prev, total: response.pagination.total, totalPages: response.pagination.totalPages }));
        } catch { toast.error('Error al cargar proyectos'); }
        finally { setLoading(false); }
    }, [selectedGroup, selectedCategory, searchTerm, pagination.page, pagination.limit]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleAddProduct = () => { setEditingProduct(undefined); setIsModalOpen(true); };
    const handleEditProduct = (product: ArchitectureProject) => { setEditingProduct(product); setIsModalOpen(true); };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('¿Eliminar este proyecto arquitectónico?')) return;
        try { await architectureService.deleteProduct(id); toast.success('Proyecto eliminado'); fetchProducts(); }
        catch { toast.error('Error al eliminar'); }
    };

    const handleSubmit = async (formData: ArchitectureProjectInput) => {
        try {
            setIsSubmitting(true);
            if (editingProduct) {
                await architectureService.updateProduct(editingProduct._id, formData);
                toast.success('Proyecto actualizado exitosamente');
            } else {
                await architectureService.createProduct(formData);
                toast.success('Proyecto creado exitosamente');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch { toast.error('Error al guardar el proyecto'); }
        finally { setIsSubmitting(false); }
    };

    const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, page }));

    const categoryOptions = useMemo(() => [{ value: 'all', label: 'Todos', icon: 'LayoutGrid' }, ...categories], [categories]);
    const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);

    const stats = useMemo(() => ({
        totalProjects: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
        activeProjects: products.filter(p => p.isAvailable).length,
        priceAvg: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
    }), [products]);

    return {
        state: { products, categories, categoryOptions, loading, searchTerm, selectedCategory, selectedGroup, isModalOpen, editingProduct, isSubmitting, filteredProducts, stats, pagination },
        actions: { setSearchTerm, setSelectedCategory, setSelectedGroup, handleAddProduct, handleEditProduct, handleDeleteProduct, handleSubmit, handlePageChange, setIsModalOpen, refetch: fetchProducts },
    };
};
