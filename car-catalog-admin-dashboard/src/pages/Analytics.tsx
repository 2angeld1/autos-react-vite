import React from 'react';
import {
  BarChart3,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/common/Button';
import { Breadcrumb } from '@/components/layout';
import { useAnalytics } from '@/hooks/pages/useAnalytics';
import { fadeIn, slideUp, scaleIn } from '@/animations/variants';
import OverviewStats from '@/components/analytics/OverviewStats';
import ChartsSection from '@/components/analytics/ChartsSection';
import RecentActivitySection from '@/components/analytics/RecentActivitySection';

const Analytics: React.FC = () => {
  const { state, actions } = useAnalytics();

  const {
    loading,
    refreshing,
    overview,
    charts,
    recentActivity,
  } = state;

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Analytics' },
          ]}
        />
      </motion.div>

      <motion.div variants={slideUp} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <motion.div variants={scaleIn} className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <BarChart3 className="h-7 w-7" />
            </motion.div>
            Analytics
          </h1>
          <p className="text-gray-500 mt-1">Overview of your VeloDrive platform</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={actions.handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<Download className="h-4 w-4" />}
            onClick={actions.handleExport}
          >
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <OverviewStats overview={overview} />

      {/* Charts Section */}
      <ChartsSection charts={charts} />

      {/* Recent Activity */}
      <RecentActivitySection recentActivity={recentActivity} />
    </motion.div>
  );
};

export default Analytics;
