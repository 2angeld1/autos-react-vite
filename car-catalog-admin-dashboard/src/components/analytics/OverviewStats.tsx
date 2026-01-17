import React from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Tag, PieChart, Package, Percent, DollarSign } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/utils/formatters';
import { staggerContainer, scaleIn } from '@/animations/variants';
import StatCard from './StatCard';

interface OverviewStatsProps {
  overview: any;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ overview }) => {
  return (
    <>
      <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
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
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div variants={scaleIn} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Inventory Value</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(overview?.inventoryValue || 0)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-200" />
          </div>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overview?.totalStock || 0)} units</p>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{overview?.lowStockItems || 0}</p>
        </motion.div>

        <motion.div variants={scaleIn} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <p className="text-sm text-gray-500 dark:text-gray-400">Promo Redemptions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(overview?.promotionRedemptions || 0)}</p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default OverviewStats;
