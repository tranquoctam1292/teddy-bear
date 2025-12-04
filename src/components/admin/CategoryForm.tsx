'use client';

// Category Form Component
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { ProductCategory } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const categorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  icon: z.string().url('URL icon không hợp lệ').optional().or(z.literal('')),
  image: z.string().url('URL hình ảnh không hợp lệ').optional().or(z.literal('')),
  order: z.number().min(0, 'Thứ tự phải lớn hơn hoặc bằng 0'),
  isActive: z.boolean(),
  parentId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: ProductCategory;
  categories?: ProductCategory[]; // For parent selection
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CategoryForm({
  category,
  categories = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          description: category.description || '',
          icon: category.icon || '',
          image: category.image || '',
          order: category.order,
          isActive: category.isActive,
          parentId: category.parentId || '',
        }
      : {
          name: '',
          description: '',
          icon: '',
          image: '',
          order: 0,
          isActive: true,
          parentId: '',
        },
  });

  const isActive = watch('isActive');

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit({
      ...data,
      parentId: data.parentId || undefined,
      icon: data.icon || undefined,
      image: data.image || undefined,
    });
  };

  // Get max order if not editing
  useEffect(() => {
    if (!category && categories.length > 0) {
      const maxOrder = Math.max(...categories.map((c) => c.order), -1);
      setValue('order', maxOrder + 1);
    }
  }, [category, categories, setValue]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{category ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Gấu Teddy"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              rows={3}
              placeholder="Mô tả về danh mục này..."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Icon
              </label>
              <Input
                {...register('icon')}
                placeholder="/images/icons/teddy.svg"
                disabled={isLoading}
              />
              {errors.icon && (
                <p className="text-sm text-red-600 mt-1">{errors.icon.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Hình ảnh
              </label>
              <Input
                {...register('image')}
                placeholder="/images/categories/teddy.jpg"
                disabled={isLoading}
              />
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự hiển thị
              </label>
              <Input
                type="number"
                {...register('order', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.order && (
                <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục cha (tùy chọn)
              </label>
              <select
                {...register('parentId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={isLoading}
              >
                <option value="">Không có</option>
                {categories
                  .filter((c) => c.id !== category?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Danh mục đang hoạt động
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}




