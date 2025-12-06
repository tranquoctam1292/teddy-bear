'use client';

/**
 * Collection & Combo Section
 * Kết hợp Collection, Related Products và Combo Products
 */

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ProductFormData } from '@/lib/schemas/product';
import RelatedProductsSelector from './related-products-selector';
import ComboProductsBuilder from './combo-products-builder';

export default function CollectionComboSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ sưu tập & Combo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collection */}
        <div className="space-y-2">
          <Label htmlFor="collection">Bộ sưu tập</Label>
          <Input
            id="collection"
            {...register('collection')}
            placeholder="VD: Teddy Classic, Valentine 2025, Premium Collection"
          />
          <p className="text-xs text-gray-500">
            Nhập tên bộ sưu tập để nhóm sản phẩm lại với nhau
          </p>
          {errors.collection && (
            <p className="text-sm text-red-600">{errors.collection.message}</p>
          )}
        </div>

        {/* Related Products */}
        <div className="space-y-3">
          <RelatedProductsSelector />
        </div>

        {/* Combo Products */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <ComboProductsBuilder />
        </div>
      </CardContent>
    </Card>
  );
}




