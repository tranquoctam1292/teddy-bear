'use client';

/**
 * Variant Form Enhanced
 * Nâng cấp variant form với image upload, weight, dimensions, isPopular
 */

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Plus, Trash2, ImageIcon, Upload, X } from 'lucide-react';
import { useState } from 'react';
import type { ProductFormData } from '@/lib/schemas/product';

export default function VariantFormEnhanced() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const variants = watch('variants') || [];

  // Handle variant image upload
  const handleVariantImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh phải nhỏ hơn 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setValue(`variants.${index}.image`, data.url);
      } else {
        alert('Tải ảnh lên thất bại');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Tải ảnh lên thất bại');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Biến thể sản phẩm</CardTitle>
          <Button
            type="button"
            onClick={() =>
              append({
                size: '',
                color: '',
                colorCode: '',
                price: 0,
                stock: 0,
                sku: '',
                image: '',
                weight: undefined,
                dimensions: undefined,
                isPopular: false,
              })
            }
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm biến thể
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => {
          const variant = variants[index];
          const variantImage = variant?.image;

          return (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Biến thể #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    Kích thước <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register(`variants.${index}.size`)}
                    placeholder="80cm"
                    className="text-sm"
                  />
                  {errors.variants?.[index]?.size && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.variants[index]?.size?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">Màu sắc</Label>
                  <Input
                    {...register(`variants.${index}.color`)}
                    placeholder="Nâu"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">Mã màu (Hex)</Label>
                  <Input
                    {...register(`variants.${index}.colorCode`)}
                    placeholder="#8B4513"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">SKU</Label>
                  <Input
                    {...register(`variants.${index}.sku`)}
                    placeholder="SKU-001"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register(`variants.${index}.price`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="250000"
                    className="text-sm"
                  />
                  {errors.variants?.[index]?.price && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.variants[index]?.price?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    Tồn kho <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="100"
                    className="text-sm"
                  />
                  {errors.variants?.[index]?.stock && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.variants[index]?.stock?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Variant Image */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Ảnh riêng cho variant
                </Label>
                {variantImage ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={variantImage} alt={`Variant ${index + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue(`variants.${index}.image`, '')}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                      aria-label="Xóa ảnh"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 text-center px-2">
                      Tải ảnh lên
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(index, e)}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500">
                  Ảnh riêng cho variant này (nếu khác với ảnh chung)
                </p>
              </div>

              {/* Weight & Dimensions */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    Trọng lượng (gram)
                  </Label>
                  <Input
                    {...register(`variants.${index}.weight`, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="500"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nếu khác với trọng lượng chung
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                    <Controller
                      name={`variants.${index}.isPopular`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                      )}
                    />
                    <span>Variant phổ biến</span>
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Đánh dấu variant này là phổ biến
                  </p>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <Label className="text-xs font-medium text-gray-700">
                  Kích thước variant (cm) - Nếu khác với kích thước chung
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">Chiều dài</Label>
                    <Input
                      {...register(`variants.${index}.dimensions.length`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="80"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Chiều rộng</Label>
                    <Input
                      {...register(`variants.${index}.dimensions.width`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="50"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Chiều cao</Label>
                    <Input
                      {...register(`variants.${index}.dimensions.height`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="60"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

