'use client';

import { Tag } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';

export default function ProductTagsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="h-7 w-7" />
          Thẻ Sản phẩm
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý tags cho sản phẩm
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Product Tags
        </h3>
        <p className="text-gray-600 mb-6">
          Quản lý tags qua Settings → Products
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/admin/settings/products'}>
          Đến Settings
        </Button>
      </div>
    </div>
  );
}

