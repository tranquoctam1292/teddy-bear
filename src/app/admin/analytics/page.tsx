'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, ShoppingCart, DollarSign, Users, Download } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { AnalyticsDashboard } from '@/lib/types/analytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      });

      const response = await fetch(`/api/admin/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to load analytics');

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      alert('Không thể tải dữ liệu phân tích!');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const exportData = () => {
    alert('Export functionality - Will implement CSV/Excel export');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Tổng quan hiệu suất kinh doanh</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-500">đến</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Tổng doanh thu</p>
              <DollarSign className="h-8 w-8 text-blue-100" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {formatCurrency(data.salesStats.totalRevenue)}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+{data.salesStats.revenueChange.toFixed(1)}% so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Tổng đơn hàng</p>
              <ShoppingCart className="h-8 w-8 text-green-100" />
            </div>
            <p className="text-3xl font-bold mb-1">{data.salesStats.totalOrders}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+{data.salesStats.ordersChange.toFixed(1)}% so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">Giá trị TB đơn hàng</p>
              <DollarSign className="h-8 w-8 text-purple-100" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {formatCurrency(data.salesStats.averageOrderValue)}
            </p>
            <p className="text-sm text-purple-100">Average Order Value</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Tỷ lệ chuyển đổi</p>
              <Users className="h-8 w-8 text-orange-100" />
            </div>
            <p className="text-3xl font-bold mb-1">{data.salesStats.conversionRate}%</p>
            <p className="text-sm text-orange-100">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart with Recharts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Doanh thu 30 ngày gần nhất</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenueData}>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top sản phẩm bán chạy</h2>
          <div className="space-y-3">
            {data.topProducts.slice(0, 5).map((product, index) => (
              <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.salesCount} đã bán</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources with Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nguồn truy cập</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.trafficSources as any}
                dataKey="visitors"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: any) => `${entry.source}: ${entry.percentage}%`}
              >
                {data.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4 text-center">
            * Dữ liệu demo - cần tích hợp Google Analytics
          </p>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Phân tích khách hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{data.customerMetrics.newCustomers}</p>
            <p className="text-sm text-gray-600 mt-1">Khách hàng mới</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{data.customerMetrics.returningCustomers}</p>
            <p className="text-sm text-gray-600 mt-1">Khách quay lại</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(data.customerMetrics.averageLifetimeValue)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Customer LTV</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">{data.customerMetrics.retentionRate}%</p>
            <p className="text-sm text-gray-600 mt-1">Tỷ lệ giữ chân</p>
          </div>
        </div>
      </div>
    </div>
  );
}
