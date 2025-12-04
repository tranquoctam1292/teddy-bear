'use client';

import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function ProductReviewsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Star className="h-7 w-7" />
          Đánh giá Sản phẩm
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý reviews và ratings từ khách hàng
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Product Reviews
        </h3>
        <p className="text-gray-600 mb-6">
          Tính năng sẽ được thêm trong phiên bản tiếp theo. Hiện tại reviews được quản lý qua Comments.
        </p>
        <Button variant="secondary" onClick={() => window.location.href = '/admin/comments'}>
          Xem Comments
        </Button>
      </div>
    </div>
  );
}


