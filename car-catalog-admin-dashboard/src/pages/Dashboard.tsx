import React from 'react';
import { Car, Users, Image as ImageIcon, TrendingUp, FileText, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGet } from '@/hooks/useApi';
// import { DashboardStats } from '@/services'; 
import StatsCard from '@/components/dashboard/StatsCard';
import { LeadsChart, InventoryChart, RecentActivity } from '@/components/dashboard';
import { formatCurrency } from '@/utils/formatters';
import { Breadcrumb } from '@/components/layout';
import { useTranslation } from 'react-i18next';
import { fadeIn, slideUp, staggerContainer } from '@/animations/variants';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  const { 
    data: statsResponse, 
    loading: statsLoading, 
    error: statsError 
  } = useGet<any>('/admin/stats', { immediate: true });

  const stats = statsResponse?.data || statsResponse;

  const breadcrumbItems = [
    { label: t('nav.dashboard'), current: true },
  ];

  const activities = React.useMemo(() => {
    if (!stats) return [];

    const carActivities = (stats.recentCars || []).map((c: any) => ({
      id: c.id || c._id || `car-${c.id}`,
      type: 'car_added' as const,
      title: `${c.make} ${c.model}`, // Acortado para sidebar
      description: c.price ? formatCurrency(c.price) : '',
      timestamp: new Date(c.createdAt),
      user: undefined,
    }));

    const userActivities = (stats.recentUsers || []).map((u: any) => ({
      id: u.id || u._id,
      type: 'user_registered' as const,
      title: u.name,
      description: '', // Ocultar email para ahorrar espacio en sidebar
      timestamp: new Date(u.createdAt),
      user: u.name,
    }));

    // Mostrar más actividades ya que tiene scroll propio
    return [...carActivities, ...userActivities]
      .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20); 
  }, [stats]);

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <Breadcrumb items={breadcrumbItems} />

      <motion.div variants={slideUp}>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600">
          Esta es la actividad reciente de tu catálogo hoy.
        </p>
      </motion.div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (Main Content) - Col 9/12 */}
        <div className="lg:col-span-9 space-y-6">

          {/* KPI Cards */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" // Gap reducido
          >
            <StatsCard
              title="Total Ventas"
              value={stats?.totalSales ? formatCurrency(stats.totalSales) : '$0'}
              icon={TrendingUp}
              color="green"
              loading={statsLoading}
              change={{ value: stats?.salesCount || 0, type: 'increase', period: 'Autos vendidos' } as any}
            />
            <StatsCard
              title="Monto Pendiente"
              value={stats?.pendingAmount ? formatCurrency(stats.pendingAmount) : '$0'}
              icon={DollarSign}
              color="orange"
              loading={statsLoading}
              change={{ value: stats?.pendingCount || 0, type: 'increase', period: 'En negociación', noSymbol: true } as any}
            />
            <StatsCard
              title="Valor Inventario"
              value={stats?.inventoryValue ? formatCurrency(stats.inventoryValue) : '$0'}
              icon={Car}
              color="blue"
              loading={statsLoading}
              change={{ value: stats?.activeCars || 0, type: 'increase', period: 'Disponibles', noSymbol: true } as any}
            />
            <StatsCard
              title={t('dashboard.totalUsers')}
              value={stats?.totalUsers || 0}
              icon={Users}
              color="purple"
              loading={statsLoading}
              change={{ value: stats?.activeUsers || 0, type: 'increase', period: 'Activos', noSymbol: true } as any}
            />
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={slideUp}>
              <LeadsChart data={stats?.charts?.quotesByMonth || []} loading={statsLoading} />
            </motion.div>

            <motion.div variants={slideUp}>
              <InventoryChart data={stats?.charts?.carsByMake || []} loading={statsLoading} />
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Botones simplificados para que quepan mejor */}
              <QuickActionButton icon={Car} label={t('cars.addCar')} />
              <QuickActionButton icon={FieTextButtonIcon} label="Ver Cotizaciones" />
              <QuickActionButton icon={ImageIcon} label={t('images.upload')} />
              <QuickActionButton icon={TrendingUp} label={t('nav.analytics')} />
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar Activity) - Col 3/12 */}
        <div className="lg:col-span-3 sticky top-6">
          <motion.div 
            variants={slideUp}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[645px]"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Actividad</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              <RecentActivity activities={activities} loading={statsLoading} compact={true} />
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

// Helper components
const FieTextButtonIcon = () => <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />;

const QuickActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-center w-full group">
    {typeof Icon === 'function' ? <Icon /> : <Icon className="h-6 w-6 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 mx-auto mb-2 transition-colors" />}
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 block">{label}</span>
  </motion.button>
);

export default Dashboard;