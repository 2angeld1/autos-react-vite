import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataPoint {
  _id: string; 
  count: number;
  [key: string]: any; // Recharts compatibility
}

interface InventoryChartProps {
  data: DataPoint[];
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const InventoryChart: React.FC<InventoryChartProps> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-64 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-lg" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-gray-400">Sin datos de inventario.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top Marcas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="count"
              nameKey="_id"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                 contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryChart;
