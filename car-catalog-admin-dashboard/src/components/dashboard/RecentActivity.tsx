import React from 'react';
import { Car, User, Image, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'car_added' | 'user_registered' | 'image_uploaded' | 'settings_changed';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [],
  loading = false 
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'car_added':
        return Car;
      case 'user_registered':
        return User;
      case 'image_uploaded':
        return Image;
      case 'settings_changed':
        return Settings;
      default:
        return Car;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'car_added':
        return 'text-blue-600 bg-blue-50';
      case 'user_registered':
        return 'text-green-600 bg-green-50';
      case 'image_uploaded':
        return 'text-purple-600 bg-purple-50';
      case 'settings_changed':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${colorClasses}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      {activity.user && ` • by ${activity.user}`}
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