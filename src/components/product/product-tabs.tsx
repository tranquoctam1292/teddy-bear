'use client';

/**
 * Product Tabs
 * Tabbed content để hiển thị thông tin sản phẩm
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductSpecsTable from './product-specs-table';
import type { Product } from '@/lib/schemas/product';

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full mt-8">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Mô tả</TabsTrigger>
        <TabsTrigger value="specs">Chi tiết</TabsTrigger>
        <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        <TabsTrigger value="care">Bảo hành & Hướng dẫn</TabsTrigger>
      </TabsList>

      {/* Tab: Mô tả */}
      <TabsContent value="description" className="mt-6">
        <div
          className="prose prose-pink max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </TabsContent>

      {/* Tab: Chi tiết */}
      <TabsContent value="specs" className="mt-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <ProductSpecsTable product={product} />
        </div>
      </TabsContent>

      {/* Tab: Đánh giá */}
      <TabsContent value="reviews" className="mt-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Tính năng đánh giá đang được phát triển
          </p>
          <p className="text-sm text-gray-500">
            Sẽ sớm có mặt trong phiên bản tiếp theo
          </p>
        </div>
      </TabsContent>

      {/* Tab: Bảo hành & Hướng dẫn */}
      <TabsContent value="care" className="mt-6 space-y-6">
        {product.careInstructions && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Hướng dẫn bảo quản
            </h3>
            <div
              className="prose prose-pink max-w-none bg-pink-50 rounded-lg p-4"
              dangerouslySetInnerHTML={{ __html: product.careInstructions }}
            />
          </div>
        )}

        {product.safetyInfo && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Thông tin an toàn
            </h3>
            <div
              className="prose prose-pink max-w-none bg-blue-50 rounded-lg p-4"
              dangerouslySetInnerHTML={{ __html: product.safetyInfo }}
            />
          </div>
        )}

        {product.warranty && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Chính sách bảo hành
            </h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-gray-700">{product.warranty}</p>
            </div>
          </div>
        )}

        {!product.careInstructions && !product.safetyInfo && !product.warranty && (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có thông tin bảo hành và hướng dẫn</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}




