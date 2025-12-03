'use client';

// Admin Security Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import UserManager from '@/components/admin/UserManager';
import UserForm from '@/components/admin/UserForm';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import SecurityConfigForm from '@/components/admin/SecurityConfigForm';
import type { AdminUser } from '@/lib/schemas/security-settings';
import type { SecurityConfig } from '@/lib/schemas/security-settings';

export default function AdminSecuritySettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>();
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Security Config state
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | undefined>();
  const [securityLoading, setSecurityLoading] = useState(true);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Change Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUsers();
      fetchSecurityConfig();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('/api/admin/settings/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSecurityConfig = async () => {
    try {
      setSecurityLoading(true);
      const response = await fetch('/api/admin/settings/security');
      if (!response.ok) throw new Error('Failed to fetch security config');
      const data = await response.json();
      setSecurityConfig(data.config);
    } catch (error) {
      console.error('Error fetching security config:', error);
    } finally {
      setSecurityLoading(false);
    }
  };

  // User handlers
  const handleCreateUser = () => {
    setEditingUser(undefined);
    setShowUserForm(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleSaveUser = async (data: any) => {
    try {
      setIsSavingUser(true);
      const url = editingUser
        ? `/api/admin/settings/users/${editingUser.id}`
        : '/api/admin/settings/users';
      const method = editingUser ? 'PUT' : 'POST';

      // Don't send password if it's empty (for updates)
      if (editingUser && !data.password) {
        delete data.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save user');
      }

      setShowUserForm(false);
      setEditingUser(undefined);
      await fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu người dùng');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      const response = await fetch(`/api/admin/settings/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa người dùng');
      throw error;
    }
  };

  // Change Password handler
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      setIsChangingPassword(true);
      const response = await fetch('/api/admin/settings/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      alert('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Security Config handler
  const handleSaveSecurityConfig = async (data: any) => {
    try {
      setIsSavingSecurity(true);
      const response = await fetch('/api/admin/settings/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save security config');
      }

      await fetchSecurityConfig();
      alert('Cập nhật cấu hình bảo mật thành công!');
    } catch (error) {
      console.error('Error saving security config:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu cấu hình bảo mật');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bảo mật</h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý quyền truy cập và bảo mật
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* User Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý người dùng</CardTitle>
            <CardDescription>
              Quản lý tài khoản admin và phân quyền truy cập
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showUserForm ? (
              <UserForm
                user={editingUser}
                onSubmit={handleSaveUser}
                onCancel={() => {
                  setShowUserForm(false);
                  setEditingUser(undefined);
                }}
                isLoading={isSavingUser}
              />
            ) : (
              <UserManager
                users={users}
                onCreate={handleCreateUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                isLoading={usersLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Thay đổi mật khẩu admin hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              isLoading={isChangingPassword}
            />
          </CardContent>
        </Card>

        {/* Security Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình bảo mật</CardTitle>
            <CardDescription>
              Cài đặt rate limiting, CORS, và các biện pháp bảo mật khác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityConfigForm
              config={securityConfig}
              onSubmit={handleSaveSecurityConfig}
              isLoading={isSavingSecurity}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

