'use client';

// Change Password Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu mới và xác nhận không khớp',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isLoading = false,
}: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    await onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-600" />
          <CardTitle>Đổi mật khẩu</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              {...register('currentPassword')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              {...register('newPassword')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Mật khẩu phải có ít nhất 8 ký tự
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}








