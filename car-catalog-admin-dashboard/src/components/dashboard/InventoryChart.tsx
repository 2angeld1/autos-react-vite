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
  title?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const InventoryChart: React.FC<InventoryChartProps> = ({ data, loading, title }) => {
  if (loading) {
    return <div className="h-80 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <p className="text-gray-400 font-medium">Sin datos de inventario.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -left-16 -top-16 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{title || 'Top por Marca'}</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Distribución de inventario</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
            {data.length} Marcas
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                fill="#8884d8"
                paddingAngle={8}
                dataKey="count"
                nameKey="_id"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer shadow-xl"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(75, 85, 99, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}
                labelStyle={{ display: 'none' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;
