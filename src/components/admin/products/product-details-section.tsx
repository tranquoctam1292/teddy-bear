'use client';

/**
 * Product Details Section
 * Form section để nhập thông tin chi tiết sản phẩm
 */

import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { ProductFormData } from '@/lib/schemas/product';

export default function ProductDetailsSection() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const dimensions = watch('dimensions');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Material */}
        <div className="space-y-2">
          <Label htmlFor="material">Chất liệu</Label>
          <Input
            id="material"
            {...register('material')}
            placeholder="VD: Bông gòn cao cấp, vải lông mềm"
          />
          {errors.material && (
            <p className="text-sm text-red-600">{errors.material.message}</p>
          )}
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>Kích thước thực tế (cm)</Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="dimensions.length" className="text-xs text-gray-600">
                Chiều dài
              </Label>
              <Input
                id="dimensions.length"
                type="number"
                min="0"
                step="0.1"
                placeholder="80"
                {...register('dimensions.length', {
                  valueAsNumber: true,
                })}
              />
              {errors.dimensions?.length && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.dimensions.length.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="dimensions.width" className="text-xs text-gray-600">
                Chiều rộng
              </Label>
              <Input
                id="dimensions.width"
                type="number"
                min="0"
                step="0.1"
                placeholder="50"
                {...register('dimensions.width', {
                  valueAsNumber: true,
                })}
              />
              {errors.dimensions?.width && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.dimensions.width.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="dimensions.height" className="text-xs text-gray-600">
                Chiều cao
              </Label>
              <Input
                id="dimensions.height"
                type="number"
                min="0"
                step="0.1"
                placeholder="60"
                {...register('dimensions.height', {
                  valueAsNumber: true,
                })}
              />
              {errors.dimensions?.height && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.dimensions.height.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Trọng lượng (gram)</Label>
          <div className="relative">
            <Input
              id="weight"
              type="number"
              min="0"
              step="1"
              placeholder="500"
              {...register('weight', {
                valueAsNumber: true,
              })}
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              gram
            </span>
          </div>
          {errors.weight && (
            <p className="text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>

        {/* Age Range */}
        <div className="space-y-2">
          <Label htmlFor="ageRange">Độ tuổi phù hợp</Label>
          <Input
            id="ageRange"
            {...register('ageRange')}
            placeholder="VD: 3+, 0-12 tháng, Tất cả lứa tuổi"
          />
          {errors.ageRange && (
            <p className="text-sm text-red-600">{errors.ageRange.message}</p>
          )}
        </div>

        {/* Care Instructions */}
        <div className="space-y-2">
          <Label htmlFor="careInstructions">Hướng dẫn bảo quản</Label>
          <Controller
            name="careInstructions"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                content={field.value || ''}
                onChange={field.onChange}
                placeholder="VD: Giặt tay, không dùng chất tẩy, phơi khô tự nhiên..."
                minHeight="200px"
              />
            )}
          />
          {errors.careInstructions && (
            <p className="text-sm text-red-600">
              {errors.careInstructions.message}
            </p>
          )}
        </div>

        {/* Safety Info */}
        <div className="space-y-2">
          <Label htmlFor="safetyInfo">Thông tin an toàn</Label>
          <Controller
            name="safetyInfo"
            control={control}
            render={({ field }) => (
              <Textarea
                id="safetyInfo"
                {...field}
                rows={4}
                placeholder="VD: An toàn cho trẻ em, không chứa chất độc hại, đã được kiểm định..."
              />
            )}
          />
          {errors.safetyInfo && (
            <p className="text-sm text-red-600">{errors.safetyInfo.message}</p>
          )}
        </div>

        {/* Warranty */}
        <div className="space-y-2">
          <Label htmlFor="warranty">Bảo hành</Label>
          <Input
            id="warranty"
            {...register('warranty')}
            placeholder="VD: 6 tháng, 1 năm, Không bảo hành"
          />
          {errors.warranty && (
            <p className="text-sm text-red-600">{errors.warranty.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

