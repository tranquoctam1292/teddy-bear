'use client';

// Charts component - Dynamically imported to reduce bundle size
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
  formatCurrency: (amount: number) => string;
}

export function RevenueChart({ data, formatCurrency }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).getDate().toString()}
        />
        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(date) => new Date(date).toLocaleDateString('vi-VN')}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#3B82F6" 
          strokeWidth={2}
          name="Doanh thu"
          dot={{ fill: '#3B82F6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface TrafficChartProps {
  data: Array<{ source: string; visitors: number; percentage: number }>;
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="visitors"
          nameKey="source"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={(entry: { source: string; percentage: number }) => `${entry.source}: ${entry.percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

