import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, DollarSign, TrendingUp } from 'lucide-react';
import Card from '@/components/common/Card';
import { staggerContainer, slideUp } from '@/animations/variants';
import ChartBar from './ChartBar';

interface ChartsSectionProps {
  charts: any;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ charts }) => {
  return (
    <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <motion.div variants={slideUp}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Cars by Fuel Type</h3>
          </div>
          {charts?.carsByFuelType && charts.carsByFuelType.length > 0 ? (
            <ChartBar data={charts.carsByFuelType} color="bg-blue-500" />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Top 10 Makes</h3>
          </div>
          {charts?.carsByMake && charts.carsByMake.length > 0 ? (
            <ChartBar data={charts.carsByMake} color="bg-indigo-500" />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Price Distribution</h3>
          </div>
          {charts?.priceRanges && charts.priceRanges.length > 0 ? (
            <ChartBar
              data={charts.priceRanges.map((p: any) => ({ name: p.range, count: p.count }))}
              color="bg-green-500"
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </motion.div>

      <motion.div variants={slideUp}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Cars by Year</h3>
          </div>
          {charts?.carsByYear && charts.carsByYear.length > 0 ? (
            <ChartBar
              data={charts.carsByYear.map((y: any) => ({ name: y.year.toString(), count: y.count }))}
              color="bg-purple-500"
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ChartsSection;
