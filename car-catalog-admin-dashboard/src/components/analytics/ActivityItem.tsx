import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { slideUp } from '@/animations/variants';

interface ActivityItemProps {
  action: string;
  item: string;
  time: string;
  user: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, item, time, user }) => {
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div variants={slideUp} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatTime(time)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user}</p>
      </div>
    </motion.div>
  );
};

export default ActivityItem;
