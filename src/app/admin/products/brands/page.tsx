'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';

export default function ProductBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-7 w-7" />
              Thương hiệu Sản phẩm
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các thương hiệu/brands sản phẩm
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm thương hiệu
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Brands Management
        </h3>
        <p className="text-gray-600 mb-6">
          Tính năng đang được phát triển. Tạm thời quản lý brands qua Settings → Products
        </p>
        <Button variant="secondary" onClick={() => window.location.href = '/admin/settings/products'}>
          Đến Settings
        </Button>
      </div>
    </div>
  );
}

