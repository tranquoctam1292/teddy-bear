'use client';

import { Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function ProductsAnalyticsPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-7 w-7" />
          Phân tích Sản phẩm
        </h1>
        <p className="text-gray-600 mt-1">
          Hiệu suất bán hàng theo sản phẩm
        </p>
      </div>

      <div className="bg-white rounded-lg border p-12 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Product Performance</h3>
        <p className="text-gray-600 mb-6">
          Xem top products trong Analytics Dashboard
        </p>
        <Button onClick={() => window.location.href = '/admin/analytics'}>
          Xem Analytics Tổng quan
        </Button>
      </div>
    </div>
  );
}


