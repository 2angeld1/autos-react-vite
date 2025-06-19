import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
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
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      change: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      change: 'text-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      change: 'text-yellow-600',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      change: 'text-red-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      change: 'text-purple-600',
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={clsx('p-3 rounded-lg', colorClasses[color].bg)}>
          <Icon className={clsx('h-6 w-6', colorClasses[color].icon)} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      
      {change && (
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <span
              className={clsx(
                'font-medium',
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
            <span className="text-gray-500 ml-1">from {change.period}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;