import React from 'react';
import { motion } from 'framer-motion';

interface ChartBarProps {
  data: Array<{ name: string; count: number }>;
  color: string;
}

const ChartBar: React.FC<ChartBarProps> = ({ data, color }) => {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          key={index}
          className="flex items-center gap-3"
        >
          <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate" title={item.name}>
            {item.name}
          </div>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.count / maxValue) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ minWidth: '40px' }}
            >
              <span className="text-xs text-white font-medium">{item.count}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChartBar;
