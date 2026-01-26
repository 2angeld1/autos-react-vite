import { backendApi as api } from './backendApi';

export interface Promotion {
  _id: string;
  name: string;
  description?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  image?: string;
  minPurchase?: number;
}

export const activePromotionsQuery = async (): Promise<Promotion[]> => {
  const response = await api.get<{ success: boolean; data: Promotion[] }>('/promotions/active');
  return response.data.data;
};

export const promotionService = {
  getActivePromotions: activePromotionsQuery
};
