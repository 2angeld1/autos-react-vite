import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
    noSymbol?: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  color = 'blue',
  loading = false,
}) => {
  const colorSchemes = {
    blue: {
      bg: 'bg-blue-50/50 dark:bg-blue-900/10',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/20',
      gradient: 'from-blue-500 to-indigo-600'
    },
    green: {
      bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/20',
      gradient: 'from-emerald-500 to-teal-600'
    },
    yellow: {
      bg: 'bg-amber-50/50 dark:bg-amber-900/10',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/20',
      gradient: 'from-amber-400 to-orange-500'
    },
    red: {
      bg: 'bg-rose-50/50 dark:bg-rose-900/10',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/20',
      gradient: 'from-rose-500 to-red-600'
    },
    purple: {
      bg: 'bg-violet-50/50 dark:bg-violet-900/10',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-100 dark:border-violet-900/20',
      gradient: 'from-violet-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-50/50 dark:bg-orange-900/10',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-100 dark:border-orange-900/20',
      gradient: 'from-orange-500 to-red-500'
    }
  };

  const scheme = colorSchemes[color === 'yellow' ? 'yellow' : color] || colorSchemes.blue;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-5">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className={clsx(
        "relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border p-5 transition-all duration-300",
        scheme.border
      )}
    >
      {/* Decorative Gradient Background (Glassmorphism look) */}
      <div className={clsx("absolute -right-6 -top-6 w-24 h-24 blur-3xl opacity-20 bg-gradient-to-br", scheme.gradient)} />

      <div className="relative z-10">
        <div className="flex items-center space-x-4">
          <div className={clsx('p-3 rounded-xl shadow-inner', scheme.iconBg)}>
            <Icon className={clsx('h-6 w-6', scheme.text)} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
              {title}
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
              {value}
            </p>
          </div>
        </div>

        {change && (
          <div className="mt-4 flex items-center space-x-2">
            <div className={clsx(
              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
              change.type === 'increase' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}>
              {change.noSymbol ? '' : (change.type === 'increase' ? '↑' : '↓')}
              {Math.abs(change.value)}
              {change.noSymbol ? '' : '%'}
            </div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              {change.period}
            </span>
          </div>
        )}
      </div>

      {/* Subtle border bottom intensity */}
      <div className={clsx("absolute bottom-0 left-0 h-1 w-full opacity-30 bg-gradient-to-r", scheme.gradient)} />
    </motion.div>
  );
};

export default StatsCard;