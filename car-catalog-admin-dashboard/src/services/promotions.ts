import { api } from './api';

export interface Promotion {
  _id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'scheduled' | 'paused';
  applicableTo?: string;
  description?: string;
  image?: string;
  isValid?: boolean;
  remainingUses?: number | string;
}

export interface PromotionStats {
  total: number;
  active: number;
  scheduled: number;
  expired: number;
  topUsed: Array<{ name: string; code: string; usedCount: number }>;
}

export const promotionService = {
  // Get all promotions
  getPromotions: async (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/promotions?${params.toString()}`);
    return response.data;
  },

  // Get single promotion
  getPromotion: async (id: string) => {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/promotions/stats');
    return response.data;
  },

  // Create promotion
  createPromotion: async (data: FormData | Partial<Promotion>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post('/promotions', data, { headers });
    return response.data;
  },

  // Update promotion
  updatePromotion: async (id: string, data: FormData | Partial<Promotion>) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.put(`/promotions/${id}`, data, { headers });
    return response.data;
  },

  // Delete promotion
  deletePromotion: async (id: string) => {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  },

  // Toggle status (pause/activate)
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/promotions/${id}/toggle`);
    return response.data;
  },

  // Validate code (for checkout)
  validateCode: async (code: string, purchaseAmount: number) => {
    const response = await api.post('/promotions/validate', { code, purchaseAmount });
    return response.data;
  }
};
