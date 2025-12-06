'use client';

import { DollarSign, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function SalesAnalyticsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-7 w-7" />
          Báo cáo Bán hàng
        </h1>
        <p className="text-gray-600 mt-1">
          Phân tích chi tiết doanh thu và bán hàng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Doanh thu tháng này</p>
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Coming Soon</p>
          <p className="text-sm text-green-600 mt-1">+0% vs tháng trước</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Đơn hàng</p>
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-blue-600 mt-1">+0% vs tháng trước</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Lợi nhuận</p>
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">Coming Soon</p>
          <p className="text-sm text-purple-600 mt-1">+0% vs tháng trước</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-12 text-center">
        <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Báo cáo Bán hàng Chi tiết</h3>
        <p className="text-gray-600 mb-6">
          Tính năng sẽ có trong phiên bản tiếp theo với:
        </p>
        <ul className="text-left max-w-md mx-auto text-gray-600 space-y-2 mb-6">
          <li>• Doanh thu theo sản phẩm/danh mục</li>
          <li>• Phân tích lợi nhuận</li>
          <li>• Báo cáo thuế</li>
          <li>• Sử dụng discount codes</li>
          <li>• Export Excel/PDF</li>
        </ul>
        <Button variant="secondary" onClick={() => window.location.href = '/admin/analytics'}>
          Xem Analytics Tổng quan
        </Button>
      </div>
    </div>
  );
}







