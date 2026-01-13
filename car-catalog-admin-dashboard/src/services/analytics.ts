import { api } from './api';

export interface AnalyticsOverview {
  totalCars: number;
  totalUsers: number;
  totalBrands: number;
  totalCategories: number;
  totalAccessories: number;
  totalPromotions: number;
  activePromotions: number;
  inventoryValue: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  promotionRedemptions: number;
}

export interface ChartData {
  carsByFuelType: Array<{ name: string; count: number }>;
  carsByMake: Array<{ name: string; count: number }>;
  carsByYear: Array<{ year: number; count: number }>;
  priceRanges: Array<{ range: string; count: number }>;
}

export interface RecentActivity {
  action: string;
  item: string;
  time: string;
  user: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  charts: ChartData;
  recentActivity: RecentActivity[];
}

export const analyticsService = {
  // Get comprehensive analytics data
  getAnalytics: async (): Promise<{ success: boolean; data: AnalyticsData }> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  // Get basic dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};
