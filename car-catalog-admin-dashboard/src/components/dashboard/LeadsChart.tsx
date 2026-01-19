import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface DataPoint {
  _id: string; // "2024-01"
  count: number;
}

interface LeadsChartProps {
  data: DataPoint[];
  loading?: boolean;
}

const LeadsChart: React.FC<LeadsChartProps> = ({ data, loading }) => {
  // Transform data for chart if necessary
  const chartData = data.map(item => ({
    name: format(new Date(item._id), 'MMM yyyy'),
    leads: item.count
  }));

  if (loading) {
    return <div className="h-64 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-lg" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-gray-400">No hay datos suficientes para mostrar la gráfica.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolución de Leads</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
            <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
            <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorLeads)" 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadsChart;
