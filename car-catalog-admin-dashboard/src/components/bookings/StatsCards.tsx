import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, CalendarCheck } from 'lucide-react';
import { staggerContainer, scaleIn } from '@/animations/variants';

interface StatsCardsProps {
  stats: {
    todayCount: number;
    pendingCount: number;
    confirmedCount: number;
    totalCount: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Today's Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.todayCount}</p>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">{stats.confirmedCount}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={scaleIn} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCount}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <CalendarCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCards;
