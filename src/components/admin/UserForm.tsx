'use client';

// User Form Component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';
import type { AdminUser } from '@/lib/schemas/security-settings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const userSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  name: z.string().min(1, 'Tên là bắt buộc'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').optional(),
  role: z.enum(['admin', 'super_admin', 'editor', 'viewer']),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: AdminUser;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          email: user.email,
          name: user.name,
          password: undefined, // Don't prefill password
          role: user.role,
          permissions: user.permissions || [],
          isActive: user.isActive,
        }
      : {
          email: '',
          name: '',
          password: '',
          role: 'editor',
          permissions: [],
          isActive: true,
        },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{user ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="user@example.com"
              disabled={isLoading || !!user}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Tên người dùng"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu {!user && <span className="text-red-500">*</span>}
            </label>
            <Input
              type="password"
              {...register('password')}
              placeholder={user ? 'Để trống nếu không đổi' : 'Mật khẩu'}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
            {user && (
              <p className="text-xs text-gray-500 mt-1">
                Để trống nếu không muốn thay đổi mật khẩu
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              disabled={isLoading}
            >
              <option value="viewer">Viewer (Chỉ xem)</option>
              <option value="editor">Editor (Chỉnh sửa)</option>
              <option value="admin">Admin (Quản trị)</option>
              <option value="super_admin">Super Admin (Quản trị cao cấp)</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
            )}
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
              Tài khoản đang hoạt động
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








