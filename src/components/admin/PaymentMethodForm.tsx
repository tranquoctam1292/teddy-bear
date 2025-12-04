'use client';

// Payment Method Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { PaymentMethod } from '@/lib/schemas/order-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { generateSlug } from '@/lib/utils/slug';

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Tên phương thức là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  enabled: z.boolean(),
  config: z.record(z.any()).optional(),
  fee: z.object({
    type: z.enum(['fixed', 'percentage']),
    value: z.number().min(0),
  }),
  order: z.number().min(0),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  method?: PaymentMethod;
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PaymentMethodForm({
  method,
  onSubmit,
  onCancel,
  isLoading = false,
}: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: method
      ? {
          name: method.name,
          slug: method.slug,
          enabled: method.enabled,
          config: method.config || {},
          fee: method.fee,
          order: method.order,
        }
      : {
          name: '',
          slug: '',
          enabled: false,
          config: {},
          fee: { type: 'fixed', value: 0 },
          order: 0,
        },
  });

  const feeType = watch('fee.type');
  const methodName = watch('name');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {method ? 'Chỉnh sửa phương thức thanh toán' : 'Tạo phương thức thanh toán mới'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên phương thức <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: MoMo, VietQR, COD"
              disabled={isLoading}
              onChange={(e) => {
                register('name').onChange(e);
                if (!method) {
                  // Auto-generate slug for new methods
                  const slug = generateSlug(e.target.value);
                  setValue('slug', slug);
                }
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('slug')}
              placeholder="momo, vietqr, cod"
              disabled={isLoading}
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại phí
              </label>
              <select
                {...register('fee.type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                disabled={isLoading}
              >
                <option value="fixed">Cố định (VND)</option>
                <option value="percentage">Phần trăm (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị phí
              </label>
              <Input
                type="number"
                {...register('fee.value', { valueAsNumber: true })}
                placeholder={feeType === 'percentage' ? '0-100' : '0'}
                disabled={isLoading}
              />
              {errors.fee?.value && (
                <p className="text-sm text-red-600 mt-1">{errors.fee.value.message}</p>
              )}
            </div>
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

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cấu hình (JSON)</h4>
            <textarea
              {...register('config', {
                setValueAs: (value) => {
                  if (typeof value === 'string') {
                    try {
                      return JSON.parse(value);
                    } catch {
                      return {};
                    }
                  }
                  return value || {};
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
              rows={6}
              placeholder='{"partnerCode": "...", "accessKey": "...", "secretKey": "..."}'
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nhập cấu hình dưới dạng JSON. Ví dụ: MoMo cần partnerCode, accessKey, secretKey
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              {...register('enabled')}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={isLoading}
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Phương thức đang hoạt động
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
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

