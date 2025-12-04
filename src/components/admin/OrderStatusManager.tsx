'use client';

// Order Status Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import type { OrderStatus } from '@/lib/schemas/order-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface OrderStatusManagerProps {
  statuses: OrderStatus[];
  onCreate: () => void;
  onEdit: (status: OrderStatus) => void;
  onDelete: (status: OrderStatus) => void;
  isLoading?: boolean;
}

export default function OrderStatusManager({
  statuses,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: OrderStatusManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (status: OrderStatus) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa trạng thái "${status.name}"?`)) {
      return;
    }

    setDeletingId(status.id);
    try {
      await onDelete(status);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý workflow trạng thái đơn hàng ({statuses.length} trạng thái)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm trạng thái
        </Button>
      </div>

      {sortedStatuses.length > 0 ? (
        <div className="space-y-3">
          {sortedStatuses.map((status) => (
            <Card key={status.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-900">{status.name}</h5>
                        {status.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Mặc định
                          </span>
                        )}
                        {status.sendNotification && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Gửi thông báo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Slug: {status.slug}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Thứ tự: {status.order}</span>
                        {status.canTransitionTo.length > 0 && (
                          <>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                              Có thể chuyển đến: {status.canTransitionTo.length} trạng thái
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(status)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(status)}
                      disabled={isLoading || deletingId === status.id || status.isDefault}
                      title={status.isDefault ? 'Không thể xóa trạng thái mặc định' : ''}
                    >
                      {deletingId === status.id ? (
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
            <p className="text-gray-500 mb-4">Chưa có trạng thái nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo trạng thái đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}




