import { useState, useEffect, useCallback, useMemo } from 'react';
import { inventoryService, Accessory } from '@/services/inventory';
import toast from 'react-hot-toast';

export const useAccessories = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAccessories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAccessories();
      if (response.success) {
        setAccessories(response.data);
      }
    } catch (error) {
      console.error('Error fetching accessories:', error);
      toast.error('Failed to load accessories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleAddAccessory = () => {
    setEditingAccessory(undefined);
    setIsModalOpen(true);
  };

  const handleEditAccessory = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setIsModalOpen(true);
  };

  const handleDeleteAccessory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this accessory?')) return;
    try {
      const response = await inventoryService.deleteAccessory(id);
      if (response.success) {
        toast.success('Accessory deleted successfully');
        fetchAccessories();
      }
    } catch (error) {
      toast.error('Failed to delete accessory');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingAccessory) {
        await inventoryService.updateAccessory(editingAccessory._id, formData);
        toast.success('Accessory updated successfully');
      } else {
        await inventoryService.createAccessory(formData);
        toast.success('Accessory created successfully');
      }
      setIsModalOpen(false);
      fetchAccessories();
    } catch (error) {
      console.error('Error saving accessory:', error);
      toast.error('Failed to save accessory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = useMemo(() => 
    ['All', ...new Set(accessories.map(a => a.category))],
    [accessories]
  );

  const filteredAccessories = useMemo(() => accessories.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || acc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [accessories, searchTerm, selectedCategory]);

  const stats = useMemo(() => {
    const totalValue = filteredAccessories.reduce((sum, acc) => sum + (acc.price * acc.stock), 0);
    const lowStockCount = filteredAccessories.filter(acc => acc.stock > 0 && acc.stock < 10).length;
    const outOfStockCount = filteredAccessories.filter(acc => acc.stock === 0).length;
    
    return {
      totalValue,
      lowStockCount,
      outOfStockCount
    };
  }, [filteredAccessories]);

  return {
    state: {
      accessories,
      loading,
      searchTerm,
      selectedCategory,
      isModalOpen,
      editingAccessory,
      isSubmitting,
      filteredAccessories,
      stats,
      categories,
    },
    actions: {
      setSearchTerm,
      setSelectedCategory,
      handleAddAccessory,
      handleEditAccessory,
      handleDeleteAccessory,
      handleSubmit,
      setIsModalOpen
    }
  };
};
