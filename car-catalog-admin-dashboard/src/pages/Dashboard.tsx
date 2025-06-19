import React from 'react';
import { 
  Car, 
  Users, 
  Image, // Cambiado de 'Images' a 'Image'
  TrendingUp 
} from 'lucide-react';
import { useGet } from '@/hooks/useApi';
import { DashboardStats } from '@/types';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Breadcrumb } from '@/components/layout';

// Mock data for activities
const mockActivities = [
  {
    id: '1',
    type: 'car_added' as const,
    title: 'New car added',
    description: 'Tesla Model 3 2023 has been added to the catalog',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    user: 'Admin User',
  },
  {
    id: '2',
    type: 'user_registered' as const,
    title: 'New user registration',
    description: 'John Doe registered a new account',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    type: 'image_uploaded' as const,
    title: 'Images uploaded',
    description: '5 new car images have been uploaded',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    user: 'Admin User',
  },
  {
    id: '4',
    type: 'settings_changed' as const,
    title: 'Settings updated',
    description: 'API configuration has been updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user: 'Admin User',
  },
];

const Dashboard: React.FC = () => {
  const { 
    data: stats, 
    loading: statsLoading, 
    error: statsError 
  } = useGet<DashboardStats>('/admin/stats', { immediate: true });

  const breadcrumbItems = [
    { label: 'Dashboard', current: true },
  ];

  if (statsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading dashboard
        </h3>
        <p className="text-gray-500">{statsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the Car Catalog Admin Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cars"
          value={stats?.totalCars || 0}
          icon={Car}
          color="blue"
          loading={statsLoading}
          change={{
            value: 12,
            type: 'increase',
            period: 'last month',
          }}
        />
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="green"
          loading={statsLoading}
          change={{
            value: 8,
            type: 'increase',
            period: 'last month',
          }}
        />
        <StatsCard
          title="Active Cars"
          value={stats?.activeCars || 0}
          icon={Car}
          color="purple"
          loading={statsLoading}
          change={{
            value: 5,
            type: 'increase',
            period: 'last week',
          }}
        />
        <StatsCard
          title="Images"
          value="1,247"
          icon={Image} // Corregido aquí también
          color="yellow"
          loading={statsLoading}
          change={{
            value: 3,
            type: 'decrease',
            period: 'last week',
          }}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cars */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Cars</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center">Recent cars will appear here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity 
            activities={mockActivities} 
            loading={statsLoading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Add New Car</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Add New User</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Upload Images</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;