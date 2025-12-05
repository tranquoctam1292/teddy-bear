'use client';

// Payment Method Manager Component
import { useState } from 'react';
import { Plus, Edit2, Trash2, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import type { PaymentMethod } from '@/lib/schemas/order-settings';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PaymentMethodManagerProps {
  methods: PaymentMethod[];
  onCreate: () => void;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (method: PaymentMethod) => void;
  isLoading?: boolean;
}

export default function PaymentMethodManager({
  methods,
  onCreate,
  onEdit,
  onDelete,
  isLoading = false,
}: PaymentMethodManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (method: PaymentMethod) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phương thức thanh toán "${method.name}"?`)) {
      return;
    }

    setDeletingId(method.id);
    try {
      await onDelete(method);
    } finally {
      setDeletingId(null);
    }
  };

  const sortedMethods = [...methods].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h3>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý các phương thức thanh toán và cấu hình ({methods.length} phương thức)
          </p>
        </div>
        <Button onClick={onCreate} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương thức
        </Button>
      </div>

      {sortedMethods.length > 0 ? (
        <div className="space-y-3">
          {sortedMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">{method.name}</h5>
                        {method.enabled ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Đang bật
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                            <XCircle className="w-3 h-3" />
                            Đang tắt
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Slug: {method.slug}</span>
                        <span>•</span>
                        <span>
                          Phí: {method.fee.type === 'fixed' ? 'Cố định' : 'Phần trăm'} -{' '}
                          {method.fee.value}
                          {method.fee.type === 'percentage' ? '%' : 'đ'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(method)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method)}
                      disabled={isLoading || deletingId === method.id}
                    >
                      {deletingId === method.id ? (
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
            <p className="text-gray-500 mb-4">Chưa có phương thức thanh toán nào</p>
            <Button onClick={onCreate} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo phương thức đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}





