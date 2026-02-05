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
    return <div className="h-80 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700/50">
        <p className="text-gray-400 font-medium">No hay datos suficientes para mostrar la gráfica.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Evolución de Leads</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Actividad comercial mensual</p>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
            +12% vs mes anterior
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.2} />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
                fontFamily="Inter, sans-serif"
                fontWeight={600}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="Inter, sans-serif"
                fontWeight={600}
              />
              <Tooltip 
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(75, 85, 99, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="leads" 
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLeads)" 
                animationDuration={2000}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeadsChart;
