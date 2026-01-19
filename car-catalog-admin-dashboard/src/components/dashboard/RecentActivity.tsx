import React from 'react';
import { Car, User, Image, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { useTranslation } from 'react-i18next';

export interface Activity {
  id: string;
  type: 'car_added' | 'user_registered' | 'image_uploaded' | 'settings_changed';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

export interface RecentActivityProps {
  activities?: Activity[];
  loading?: boolean;
  compact?: boolean; // Nueva prop
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [],
  loading = false,
  compact = false
}) => {
  const { t } = useTranslation();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'car_added': return Car;
      case 'user_registered': return User;
      case 'image_uploaded': return Image;
      case 'settings_changed': return Settings;
      default: return Car;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'car_added': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'user_registered': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'image_uploaded': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'settings_changed': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`${compact ? '' : 'bg-white dark:bg-gray-800 rounded-lg shadow'}`}>
        {!compact && (
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('dashboard.recentActivity')}</h3>
          </div>
        )}
        <div className={`${compact ? '' : 'p-6'}`}>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'h-full' : 'bg-white dark:bg-gray-800 rounded-lg shadow'}`}>
      {!compact && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('dashboard.recentActivity')}</h3>
        </div>
      )}
      <div className={`${compact ? '' : 'p-6'}`}>
        {activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t('dashboard.noActivity')}</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors -mx-2">
                  <div className={`p-2 rounded-full ${colorClasses} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;