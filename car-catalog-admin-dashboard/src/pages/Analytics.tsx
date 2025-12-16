import React, { useState } from 'react';
import {
  TrendingUp,
  Car,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  Clock
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Breadcrumb } from '@/components/layout';
import { formatNumber, formatCurrency } from '@/utils/formatters';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalSales: number;
    totalViews: number;
    conversionRate: number;
    revenueChange: number;
    salesChange: number;
    viewsChange: number;
    conversionChange: number;
  };
  salesByMonth: { month: string; sales: number; revenue: number }[];
  topMakes: { make: string; count: number; percentage: number }[];
  fuelTypeDistribution: { type: string; count: number; percentage: number }[];
  priceRanges: { range: string; count: number }[];
  recentActivity: { action: string; item: string; time: string; user: string }[];
}

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ title, value, change, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : trend === 'down' ? (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                ) : null}
                <span className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        color === 'blue' ? 'bg-blue-500' :
        color === 'green' ? 'bg-green-500' :
        color === 'purple' ? 'bg-purple-500' :
        'bg-orange-500'
      }`} />
    </Card>
  );
};

// Chart Bar Component (Simple visual representation)
const ChartBar: React.FC<{
  data: { label: string; value: number; percentage: number }[];
  color: string;
}> = ({ data, color }) => (
  <div className="space-y-3">
    {data.map((item, index) => (
      <div key={index} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">{item.label}</span>
          <span className="text-gray-500">{item.value} ({item.percentage}%)</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${item.percentage}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

// Activity Item Component
const ActivityItem: React.FC<{
  action: string;
  item: string;
  time: string;
  user: string;
}> = ({ action, item, time, user }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 bg-gray-100 rounded-full">
      <Activity className="h-4 w-4 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-900">
        <span className="font-medium">{user}</span> {action}{' '}
        <span className="font-medium text-primary-600">{item}</span>
      </p>
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
        <Clock className="h-3 w-3" />
        {time}
      </p>
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Simulated data - In production, this would come from the API
  const [analyticsData] = useState<AnalyticsData>({
    overview: {
      totalRevenue: 2450000,
      totalSales: 127,
      totalViews: 45230,
      conversionRate: 3.2,
      revenueChange: 12.5,
      salesChange: 8.3,
      viewsChange: 23.1,
      conversionChange: -2.1,
    },
    salesByMonth: [
      { month: 'Ene', sales: 12, revenue: 180000 },
      { month: 'Feb', sales: 15, revenue: 225000 },
      { month: 'Mar', sales: 18, revenue: 320000 },
      { month: 'Abr', sales: 14, revenue: 210000 },
      { month: 'May', sales: 22, revenue: 385000 },
      { month: 'Jun', sales: 25, revenue: 450000 },
    ],
    topMakes: [
      { make: 'Toyota', count: 45, percentage: 35 },
      { make: 'Honda', count: 32, percentage: 25 },
      { make: 'Ford', count: 26, percentage: 20 },
      { make: 'Chevrolet', count: 15, percentage: 12 },
      { make: 'BMW', count: 9, percentage: 8 },
    ],
    fuelTypeDistribution: [
      { type: 'Gasolina', count: 78, percentage: 62 },
      { type: 'Híbrido', count: 28, percentage: 22 },
      { type: 'Eléctrico', count: 12, percentage: 9 },
      { type: 'Diésel', count: 9, percentage: 7 },
    ],
    priceRanges: [
      { range: '$0 - $15,000', count: 23 },
      { range: '$15,000 - $30,000', count: 45 },
      { range: '$30,000 - $50,000', count: 38 },
      { range: '$50,000+', count: 21 },
    ],
    recentActivity: [
      { action: 'added a new car', item: '2024 Toyota Camry', time: '2 minutes ago', user: 'Admin' },
      { action: 'updated price for', item: '2023 Honda Civic', time: '15 minutes ago', user: 'Admin' },
      { action: 'marked as sold', item: '2022 Ford Mustang', time: '1 hour ago', user: 'Admin' },
      { action: 'uploaded images for', item: '2024 BMW X5', time: '2 hours ago', user: 'Admin' },
      { action: 'created new category', item: 'Electric Vehicles', time: '3 hours ago', user: 'Admin' },
    ],
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics data...');
  };

  const breadcrumbItems = [
    { label: 'Analytics', current: true },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your business performance and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            icon={<RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
            disabled={refreshing}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.overview.totalRevenue)}
          change={analyticsData.overview.revenueChange}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Sales"
          value={formatNumber(analyticsData.overview.totalSales)}
          change={analyticsData.overview.salesChange}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Views"
          value={formatNumber(analyticsData.overview.totalViews)}
          change={analyticsData.overview.viewsChange}
          trend="up"
          icon={<Eye className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analyticsData.overview.conversionRate}%`}
          change={analyticsData.overview.conversionChange}
          trend="down"
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Month */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Monthly Sales</h3>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.salesByMonth.map((item, index) => {
                const maxSales = Math.max(...analyticsData.salesByMonth.map(d => d.sales));
                const heightPercent = (item.sales / maxSales) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-600 mb-1">{item.sales}</span>
                      <div 
                        className="w-full bg-primary-500 rounded-t-lg transition-all duration-500 hover:bg-primary-600"
                        style={{ height: `${heightPercent * 2}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Top Makes */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Makes</h3>
              </div>
            </div>
            <ChartBar
              data={analyticsData.topMakes.map(m => ({
                label: m.make,
                value: m.count,
                percentage: m.percentage,
              }))}
              color="bg-primary-500"
            />
          </div>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fuel Type Distribution */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fuel Types</h3>
            </div>
            <ChartBar
              data={analyticsData.fuelTypeDistribution.map(f => ({
                label: f.type,
                value: f.count,
                percentage: f.percentage,
              }))}
              color="bg-green-500"
            />
          </div>
        </Card>

        {/* Price Distribution */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Price Ranges</h3>
            </div>
            <div className="space-y-4">
              {analyticsData.priceRanges.map((range, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{range.range}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(range.count / Math.max(...analyticsData.priceRanges.map(p => p.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{range.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
            </div>
            <div className="space-y-1 max-h-[280px] overflow-y-auto">
              {analyticsData.recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Insights</h3>
              <p className="text-primary-100 mt-1">
                Your best-selling car this month is the <strong>2024 Toyota Camry</strong> with 12 sales.
                Consider stocking more Japanese vehicles to meet demand.
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-primary-200" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
