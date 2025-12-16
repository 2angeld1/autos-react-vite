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
import Table, { Column } from '@/components/common/Table';
import { formatCurrency } from '@/utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import { Breadcrumb } from '@/components/layout';
import { useTranslation } from 'react-i18next';

// Activities will be derived from backend stats (recentCars and recentUsers)

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { 
    data: stats, 
    loading: statsLoading, 
    error: statsError 
  } = useGet<DashboardStats>('/admin/stats', { immediate: true });

  const {
    data: carsResponse,
    loading: carsLoading,
    execute: fetchCars,
  } = useGet<any>('/cars');

  const {
    data: usersResponse,
    loading: usersLoading,
    execute: fetchUsers,
  } = useGet<any>('/users');

  const {
    data: filesStatsResponse,
    loading: filesLoading,
    execute: fetchFilesStats,
  } = useGet<any>('/files/stats');

  const breadcrumbItems = [
    { label: t('nav.dashboard'), current: true },
  ];

  const activities = React.useMemo(() => {
    if (!stats) return [];

    const carActivities = (stats.recentCars || []).map((c) => ({
      id: c.id || c._id || `car-${c.id}`,
      type: 'car_added' as const,
      title: `${c.make} ${c.model} ${c.year}`,
      description: c.price ? formatCurrency(c.price) : '',
      timestamp: new Date(c.createdAt),
      user: undefined,
    }));

    const userActivities = (stats.recentUsers || []).map((u) => ({
      id: u.id || u._id,
      type: 'user_registered' as const,
      title: u.name,
      description: u.email,
      timestamp: new Date(u.createdAt),
      user: u.name,
    }));

    return [...carActivities, ...userActivities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [stats]);

  // Normalize responses: some endpoints return { success, data }
  const recentCarsList = React.useMemo(() => {
    if (carsResponse) {
      const payload = (carsResponse as any).data || carsResponse;
      return Array.isArray(payload) ? payload : (payload?.data || []);
    }
    return stats?.recentCars || [];
  }, [carsResponse, stats]);

  const recentUsersList = React.useMemo(() => {
    if (usersResponse) {
      const payload = (usersResponse as any).data || usersResponse;
      return Array.isArray(payload) ? payload : (payload?.data || payload?.users || []);
    }
    return stats?.recentUsers || [];
  }, [usersResponse, stats]);

  // Fetch small lists on mount
  React.useEffect(() => {
    fetchCars('?limit=6&sort=-createdAt');
    fetchUsers('?limit=6');
    fetchFilesStats();
  }, [fetchCars, fetchUsers]);

  // Table columns
  const carColumns: Column<any>[] = React.useMemo(() => [
    { key: '_id', title: 'ID', width: '80px' },
    { key: 'make', title: t('cars.make') },
    { key: 'model', title: t('cars.model') },
    { key: 'year', title: t('cars.year'), width: '80px' },
    { key: 'price', title: t('cars.price'), render: (v: any) => (v ? formatCurrency(v) : '-') },
  ], [t]);

  const userColumns: Column<any>[] = React.useMemo(() => [
    { key: '_id', title: 'ID', width: '80px' },
    { key: 'name', title: t('users.name') },
    { key: 'email', title: t('users.email') },
    { key: 'role', title: t('users.role') },
    { key: 'createdAt', title: t('users.createdAt'), render: (v: any) => formatDistanceToNow(new Date(v), { addSuffix: true }) },
  ], [t]);

  if (statsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('errors.somethingWentWrong')}
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
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600">
          {t('dashboard.overview')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.totalCars')}
          value={stats?.totalCars || 0}
          icon={Car}
          color="blue"
          loading={filesLoading}
          change={{
            value: 12,
            type: 'increase',
            period: 'last month',
          }}
        />
        <StatsCard
          title={t('dashboard.totalUsers')}
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
          title={t('cars.available')}
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
          title={t('dashboard.totalImages')}
          value={filesStatsResponse?.data?.totalFiles || filesStatsResponse?.totalFiles || 0}
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
        {/* Recent Cars & Users tables */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.recentCars')}</h3>
            <Table
              columns={carColumns}
              data={recentCarsList}
              loading={carsLoading}
              rowKey={(r) => r._id || r.id}
              emptyText={t('common.noResults')}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.recentUsers')}</h3>
            <Table
              columns={userColumns}
              data={recentUsersList}
              loading={usersLoading}
              rowKey={(r) => r._id || r.id}
              emptyText={t('common.noResults')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
            <RecentActivity
              activities={activities}
              loading={statsLoading}
            />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.quickActions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">{t('cars.addCar')}</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">{t('users.addUser')}</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">{t('images.upload')}</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">{t('nav.analytics')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;