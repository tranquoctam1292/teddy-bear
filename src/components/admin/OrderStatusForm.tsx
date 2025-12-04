'use client';

// Order Status Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { OrderStatus } from '@/lib/schemas/order-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const statusSchema = z.object({
  name: z.string().min(1, 'Tên trạng thái là bắt buộc'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Màu sắc phải là mã hex hợp lệ'),
  icon: z.string().optional(),
  order: z.number().min(0),
  isDefault: z.boolean(),
  canTransitionTo: z.array(z.string()),
  sendNotification: z.boolean(),
});

type StatusFormData = z.infer<typeof statusSchema>;

interface OrderStatusFormProps {
  status?: OrderStatus;
  allStatuses?: OrderStatus[]; // For transition selection
  onSubmit: (data: StatusFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function OrderStatusForm({
  status,
  allStatuses = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: OrderStatusFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: status
      ? {
          name: status.name,
          color: status.color,
          icon: status.icon || '',
          order: status.order,
          isDefault: status.isDefault,
          canTransitionTo: status.canTransitionTo || [],
          sendNotification: status.sendNotification,
        }
      : {
          name: '',
          color: '#6b7280',
          icon: '',
          order: 0,
          isDefault: false,
          canTransitionTo: [],
          sendNotification: true,
        },
  });

  const color = watch('color') || '#6b7280';
  const canTransitionTo = watch('canTransitionTo') || [];

  const toggleTransition = (statusId: string) => {
    const current = canTransitionTo;
    if (current.includes(statusId)) {
      setValue(
        'canTransitionTo',
        current.filter((id) => id !== statusId)
      );
    } else {
      setValue('canTransitionTo', [...current, statusId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{status ? 'Chỉnh sửa trạng thái' : 'Tạo trạng thái mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên trạng thái <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Chờ xử lý"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc <span className="text-red-500">*</span>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (tùy chọn)
              </label>
              <Input
                {...register('icon')}
                placeholder="Icon name hoặc URL"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thứ tự
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
          </div>

          {allStatuses.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Có thể chuyển đến các trạng thái:
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                {allStatuses
                  .filter((s) => s.id !== status?.id)
                  .map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={canTransitionTo.includes(s.id)}
                        onChange={() => toggleTransition(s.id)}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-700">{s.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isDefault')}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">
                Đặt làm trạng thái mặc định
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('sendNotification')}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">
                Tự động gửi email khi chuyển sang trạng thái này
              </span>
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



