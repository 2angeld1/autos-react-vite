import api from './config';

export interface Promotion {
  _id: string;
  name: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  startDate: string;
  endDate: string;
  image?: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
}

export const promotionsService = {
  // Get active promotions (public)
  getActive: async () => {
    const response = await api.get<{ success: boolean; data: Promotion[] }>('/promotions/active');
    return response.data.data;
  },

  // Validate a code
  validate: async (code: string, purchaseAmount: number) => {
    const response = await api.post('/promotions/validate', { code, purchaseAmount });
    return response.data;
  }
};
