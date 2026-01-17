import { useState, useEffect, useCallback, useMemo } from 'react';
import { inventoryService, Category } from '@/services/inventory';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All its subcategories will become top-level or orphaned. Continue?')) return;
    try {
      const response = await inventoryService.deleteCategory(id);
      if (response.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await inventoryService.updateCategory(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await inventoryService.createCategory(formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = useMemo(() => categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [categories, searchTerm]);

  // Group categories by parent
  const mainCategories = useMemo(() => filteredCategories.filter(c => !c.parentCategory), [filteredCategories]);
  
  const getSubcategories = useCallback((parentId: string) =>
    categories.filter(c => {
      const pId = typeof c.parentCategory === 'string'
        ? c.parentCategory
        : c.parentCategory?._id;
      return pId === parentId;
    }), [categories]);

  return {
    state: {
      categories,
      loading,
      searchTerm,
      expandedCategories,
      isModalOpen,
      editingCategory,
      isSubmitting,
      mainCategories,
    },
    actions: {
      setSearchTerm,
      toggleExpand,
      handleAddCategory,
      handleEditCategory,
      handleDeleteCategory,
      handleSubmit,
      setIsModalOpen,
      getSubcategories
    }
  };
};
