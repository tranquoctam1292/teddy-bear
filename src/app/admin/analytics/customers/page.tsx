'use client';

import { Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function CustomersAnalyticsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-7 w-7" />
          Phân tích Khách hàng
        </h1>
        <p className="text-gray-600 mt-1">
          Insights về hành vi và giá trị khách hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Khách hàng mới</p>
          <p className="text-3xl font-bold text-blue-600">Coming Soon</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Khách quay lại</p>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Customer LTV</p>
          <p className="text-3xl font-bold text-purple-600">0₫</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Retention Rate</p>
          <p className="text-3xl font-bold text-orange-600">0%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Customer Analytics Chi tiết</h3>
        <p className="text-gray-600 mb-6">
          Sẽ bao gồm:
        </p>
        <ul className="text-left max-w-md mx-auto text-gray-600 space-y-2 mb-6">
          <li>• Phân khúc khách hàng</li>
          <li>• Geographic distribution</li>
          <li>• Purchase frequency</li>
          <li>• Customer lifetime value</li>
          <li>• Churn rate analysis</li>
        </ul>
        <Button variant="secondary" onClick={() => window.location.href = '/admin/analytics'}>
          Xem Analytics Tổng quan
        </Button>
      </div>
    </div>
  );
}

