'use client';

// User Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, User, Shield } from 'lucide-react';
import type { AdminUser } from '@/lib/schemas/security-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface UserManagerProps {
  users: AdminUser[];
  onCreate: () => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  isLoading?: boolean;
}

const ROLE_LABELS: Record<AdminUser['role'], string> = {
  admin: 'Admin',
  super_admin: 'Super Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export default function UserManager({
  users,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: UserManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
      return;
    }

    setDeletingId(user.id);
    try {
      await onDelete(user);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý tài khoản admin và phân quyền ({users.length} người dùng)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{user.name}</h5>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {ROLE_LABELS[user.role]}
                        </span>
                        {user.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            Đã tắt
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{user.email}</span>
                        {user.lastLogin && (
                          <>
                            <span>•</span>
                            <span>
                              Đăng nhập lần cuối: {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      {user.permissions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.permissions.slice(0, 3).map((perm) => (
                            <span
                              key={perm}
                              className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                            >
                              {perm}
                            </span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{user.permissions.length - 3} khác
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user)}
                      disabled={isLoading || deletingId === user.id}
                    >
                      {deletingId === user.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Chưa có người dùng nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo người dùng đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


