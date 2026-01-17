import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import Card from '@/components/common/Card';
import { staggerContainer, slideUp } from '@/animations/variants';
import ActivityItem from './ActivityItem';

interface RecentActivitySectionProps {
  recentActivity: any[];
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ recentActivity }) => {
  return (
    <motion.div variants={slideUp}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <motion.div variants={staggerContainer} className="divide-y divide-gray-100">
            {recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                action={activity.action}
                item={activity.item}
                time={activity.time}
                user={activity.user}
              />
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </Card>
    </motion.div>
  );
};

export default RecentActivitySection;
