import { useState, useEffect, useCallback } from 'react';
import { inventoryService, Brand } from '@/services/inventory';
import toast from 'react-hot-toast';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getBrands();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleAddBrand = () => {
    setEditingBrand(undefined);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      const response = await inventoryService.deleteBrand(id);
      if (response.success) {
        toast.success('Brand deleted successfully');
        fetchBrands();
      }
    } catch (error) {
      toast.error('Failed to delete brand');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingBrand) {
        await inventoryService.updateBrand(editingBrand._id, formData);
        toast.success('Brand updated successfully');
      } else {
        await inventoryService.createBrand(formData);
        toast.success('Brand created successfully');
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error('Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || brand.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const featuredCount = brands.filter(b => b.featured).length;

  return {
    state: {
      brands,
      loading,
      searchTerm,
      selectedCountry,
      isModalOpen,
      editingBrand,
      isSubmitting,
      filteredBrands,
      featuredCount,
    },
    actions: {
      setSearchTerm,
      setSelectedCountry,
      setIsModalOpen,
      handleAddBrand,
      handleEditBrand,
      handleDeleteBrand,
      handleSubmit,
      refreshBrands: fetchBrands,
    },
  };
};
