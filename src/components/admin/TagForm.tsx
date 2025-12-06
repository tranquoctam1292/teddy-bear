'use client';

// Tag Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { ProductTag } from '@/lib/schemas/product-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const tagSchema = z.object({
  name: z.string().min(1, 'Tên tag là bắt buộc'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Màu sắc phải là mã hex hợp lệ').optional().or(z.literal('')),
  description: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  tag?: ProductTag;
  onSubmit: (data: TagFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TagForm({
  tag,
  onSubmit,
  onCancel,
  isLoading = false,
}: TagFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag
      ? {
          name: tag.name,
          color: tag.color || '#6b7280',
          description: tag.description || '',
        }
      : {
          name: '',
          color: '#6b7280',
          description: '',
        },
  });

  const color = watch('color') || '#6b7280';

  const handleFormSubmit = async (data: TagFormData) => {
    await onSubmit({
      ...data,
      color: data.color || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{tag ? 'Chỉnh sửa tag' : 'Tạo tag mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tag <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Best Seller"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc
            </label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                {...register('color')}
                className="w-16 h-10 cursor-pointer"
                disabled={isLoading}
              />
              <Input
                {...register('color')}
                placeholder="#6b7280"
                disabled={isLoading}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>
            )}
            {color && (
              <div className="mt-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  Preview
                </span>
              </div>
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
              placeholder="Mô tả về tag này..."
              disabled={isLoading}
            />
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








