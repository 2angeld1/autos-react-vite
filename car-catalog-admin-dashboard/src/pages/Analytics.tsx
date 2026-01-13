import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Car,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  Users,
  Tag,
  Package,
  Percent,
  Loader2
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Breadcrumb } from '@/components/layout';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { analyticsService, AnalyticsData } from '@/services/analytics';
import toast from 'react-hot-toast';

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color
}: {
  title: string;
    value: string | number; 
    icon: React.ReactNode; 
  color: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Chart Bar Component (Simple visual representation)
const ChartBar = ({ data, color }: { data: Array<{ name: string; count: number }>; color: string }) => {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate" title={item.name}>
            {item.name}
          </div>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${(item.count / maxValue) * 100}%`, minWidth: '40px' }}
            >
              <span className="text-xs text-white font-medium">{item.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ action, item, time, user }: { action: string; item: string; time: string; user: string }) => {
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatTime(time)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user}</p>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isRefresh = false) => {
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
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    fetchAnalytics(true);
    toast.success('Analytics data refreshed!');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.success('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const overview = analyticsData?.overview;
  const charts = analyticsData?.charts;
  const recentActivity = analyticsData?.recentActivity || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Analytics' },
          ]}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <BarChart3 className="h-7 w-7" />
            </div>
            Analytics
          </h1>
          <p className="text-gray-500 mt-1">Overview of your VeloDrive platform</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Total Cars"
          value={formatNumber(overview?.totalCars || 0)}
          icon={<Car className="h-6 w-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Users"
          value={formatNumber(overview?.totalUsers || 0)}
          icon={<Users className="h-6 w-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Brands"
          value={formatNumber(overview?.totalBrands || 0)}
          icon={<Tag className="h-6 w-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Categories"
          value={formatNumber(overview?.totalCategories || 0)}
          icon={<PieChart className="h-6 w-6 text-pink-600" />}
          color="bg-pink-100"
        />
        <StatCard
          title="Accessories"
          value={formatNumber(overview?.totalAccessories || 0)}
          icon={<Package className="h-6 w-6 text-amber-600" />}
          color="bg-amber-100"
        />
        <StatCard
          title="Active Promos"
          value={formatNumber(overview?.activePromotions || 0)}
          icon={<Percent className="h-6 w-6 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Inventory Value</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(overview?.inventoryValue || 0)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-200" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overview?.totalStock || 0)} units</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{overview?.lowStockItems || 0}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Promo Redemptions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overview?.promotionRedemptions || 0)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cars by Fuel Type */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Cars by Fuel Type</h3>
          </div>
          {charts?.carsByFuelType && charts.carsByFuelType.length > 0 ? (
            <ChartBar data={charts.carsByFuelType} color="bg-blue-500" />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Cars by Make */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Top 10 Makes</h3>
          </div>
          {charts?.carsByMake && charts.carsByMake.length > 0 ? (
            <ChartBar data={charts.carsByMake} color="bg-indigo-500" />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Price Distribution */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Price Distribution</h3>
          </div>
          {charts?.priceRanges && charts.priceRanges.length > 0 ? (
            <ChartBar 
              data={charts.priceRanges.map(p => ({ name: p.range, count: p.count }))}
              color="bg-green-500" 
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Cars by Year */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Cars by Year</h3>
          </div>
          {charts?.carsByYear && charts.carsByYear.length > 0 ? (
            <ChartBar
              data={charts.carsByYear.map(y => ({ name: y.year.toString(), count: y.count }))}
              color="bg-purple-500"
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                action={activity.action}
                item={activity.item}
                time={activity.time}
                user={activity.user}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
