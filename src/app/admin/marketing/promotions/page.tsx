'use client';

import { Sparkles, Percent, Gift } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function PromotionsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-7 w-7" />
          Khuyến mãi
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý flash sales, bundle deals và promotions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-lg p-6 text-white">
          <Percent className="h-12 w-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Flash Sales</h3>
          <p className="text-sm opacity-90">Giảm giá trong thời gian giới hạn</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg p-6 text-white">
          <Gift className="h-12 w-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Bundle Deals</h3>
          <p className="text-sm opacity-90">Mua combo giá ưu đãi</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-lg p-6 text-white">
          <Sparkles className="h-12 w-12 mb-3" />
          <h3 className="text-xl font-bold mb-2">Loyalty Program</h3>
          <p className="text-sm opacity-90">Tích điểm thưởng khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-12 text-center">
        <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Promotions Management</h3>
        <p className="text-gray-600 mb-6">
          Tính năng đang phát triển. Hiện tại sử dụng Coupons để tạo khuyến mãi.
        </p>
        <Button onClick={() => window.location.href = '/admin/marketing/coupons'}>
          Quản lý Coupons
        </Button>
      </div>
    </div>
  );
}

