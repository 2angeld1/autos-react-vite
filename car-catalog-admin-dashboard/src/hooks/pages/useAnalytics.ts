import { useState, useEffect, useCallback, useMemo } from 'react';
import { analyticsService, AnalyticsData } from '@/services/analytics';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await analyticsService.getAnalytics();
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics(true);
    toast.success('Analytics data refreshed!');
  };

  const handleExport = () => {
    toast.success('Export feature coming soon!');
  };

  const overview = useMemo(() => analyticsData?.overview, [analyticsData]);
  const charts = useMemo(() => analyticsData?.charts, [analyticsData]);
  const recentActivity = useMemo(() => analyticsData?.recentActivity || [], [analyticsData]);

  return {
    state: {
      analyticsData,
      loading,
      refreshing,
      overview,
      charts,
      recentActivity,
    },
    actions: {
      handleRefresh,
      handleExport,
      refreshAnalytics: fetchAnalytics,
    },
  };
};
