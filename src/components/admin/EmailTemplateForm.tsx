'use client';

// Email Template Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { EmailTemplate } from '@/lib/schemas/notification-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Tên template là bắt buộc'),
  subject: z.string().min(1, 'Subject là bắt buộc'),
  body: z.string().min(1, 'Nội dung email là bắt buộc'),
  variables: z.array(z.string()).optional(),
  category: z.enum(['order', 'customer', 'system', 'marketing']),
  isActive: z.boolean(),
});

type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onSubmit: (data: EmailTemplateFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmailTemplateForm({
  template,
  onSubmit,
  onCancel,
  isLoading = false,
}: EmailTemplateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: template
      ? {
          name: template.name,
          subject: template.subject,
          body: template.body,
          variables: template.variables,
          category: template.category,
          isActive: template.isActive,
        }
      : {
          name: '',
          subject: '',
          body: '',
          variables: [],
          category: 'order',
          isActive: true,
        },
  });

  const body = watch('body');
  const subject = watch('subject');

  // Extract variables from subject and body
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map((match) => match.replace(/[{}]/g, '')))];
  };

  const availableVariables = [
    ...extractVariables(subject || ''),
    ...extractVariables(body || ''),
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{template ? 'Chỉnh sửa template' : 'Tạo template mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên template <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Ví dụ: Xác nhận đơn hàng"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={isLoading}
            >
              <option value="order">Đơn hàng</option>
              <option value="customer">Khách hàng</option>
              <option value="system">Hệ thống</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('subject')}
              placeholder="Ví dụ: Xác nhận đơn hàng {{orderNumber}}"
              disabled={isLoading}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Sử dụng {`{{variableName}}`} để chèn biến
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung email (HTML) <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('body')}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
              placeholder="<html><body><h1>Xin chào {{customerName}}</h1>...</body></html>"
              disabled={isLoading}
            />
            {errors.body && (
              <p className="text-sm text-red-600 mt-1">{errors.body.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Sử dụng HTML và {`{{variableName}}`} để chèn biến
            </p>
          </div>

          {availableVariables.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Biến có sẵn trong template:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map((varName) => (
                  <span
                    key={varName}
                    className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                  >
                    {`{{${varName}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Template đang hoạt động
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


