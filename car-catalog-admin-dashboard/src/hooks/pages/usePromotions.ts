import { useState, useEffect, useCallback, useMemo } from 'react';
import { promotionService, Promotion } from '@/services/promotions';
import toast from 'react-hot-toast';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotions();
      if (response.success) {
        setPromotions(response.data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleAddPromotion = () => {
    setEditingPromotion(undefined);
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleDeletePromotion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    try {
      const response = await promotionService.deletePromotion(id);
      if (response.success) {
        toast.success('Promotion deleted successfully');
        fetchPromotions();
      }
    } catch (error) {
      toast.error('Failed to delete promotion');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await promotionService.toggleStatus(id);
      if (response.success) {
        toast.success('Status updated');
        fetchPromotions();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingPromotion) {
        await promotionService.updatePromotion(editingPromotion._id, formData);
        toast.success('Promotion updated successfully');
      } else {
        await promotionService.createPromotion(formData);
        toast.success('Promotion created successfully');
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('Failed to save promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const filteredPromotions = useMemo(() => promotions.filter(promo => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [promotions, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const activeCount = promotions.filter(p => p.status === 'active').length;
    const totalUsed = promotions.reduce((sum, p) => sum + p.usedCount, 0);
    const totalSavings = promotions.reduce((sum, p) => {
      const avgDiscount = p.type === 'percentage' ? ((p.maxDiscount || 0) / 2) : p.value;
      return sum + (avgDiscount * p.usedCount);
    }, 0);

    return { activeCount, totalUsed, totalSavings };
  }, [promotions]);

  return {
    state: {
      promotions,
      loading,
      searchTerm,
      statusFilter,
      isModalOpen,
      editingPromotion,
      isSubmitting,
      filteredPromotions,
      stats,
    },
    actions: {
      setSearchTerm,
      setStatusFilter,
      handleAddPromotion,
      handleEditPromotion,
      handleDeletePromotion,
      handleToggleStatus,
      handleSubmit,
      copyCode,
      setIsModalOpen
    }
  };
};
