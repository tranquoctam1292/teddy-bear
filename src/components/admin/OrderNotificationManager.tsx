'use client';

// Order Notification Manager Component
import { useState } from 'react';
import { Bell, BellOff, Mail, Users } from 'lucide-react';
import type { OrderNotification } from '@/lib/schemas/order-settings';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface OrderNotificationManagerProps {
  notifications: OrderNotification[];
  onUpdate: (notification: OrderNotification) => Promise<void>;
  isLoading?: boolean;
}

const EVENT_LABELS: Record<OrderNotification['event'], string> = {
  order_created: 'Đơn hàng mới',
  order_confirmed: 'Đơn hàng đã xác nhận',
  order_shipped: 'Đơn hàng đang giao',
  order_delivered: 'Đơn hàng đã giao',
  order_cancelled: 'Đơn hàng đã hủy',
};

export default function OrderNotificationManager({
  notifications,
  onUpdate,
  isLoading = false,
}: OrderNotificationManagerProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggle = async (notification: OrderNotification, field: 'enabled' | 'sendToCustomer' | 'sendToAdmin') => {
    setUpdatingId(notification.id);
    try {
      await onUpdate({
        ...notification,
        [field]: !notification[field],
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Thông báo đơn hàng</h3>
        <p className="text-sm text-gray-600 mt-1">
          Cấu hình các thông báo khi có đơn hàng mới hoặc thay đổi trạng thái
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {EVENT_LABELS[notification.event]}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={notification.enabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggle(notification, 'enabled')}
                    disabled={isLoading || updatingId === notification.id}
                  >
                    {notification.enabled ? (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Bật
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4 mr-2" />
                        Tắt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {notification.enabled && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Gửi email cho khách hàng
                      </span>
                    </div>
                    <Button
                      variant={notification.sendToCustomer ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(notification, 'sendToCustomer')}
                      disabled={isLoading || updatingId === notification.id}
                    >
                      {notification.sendToCustomer ? 'Bật' : 'Tắt'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Gửi email cho admin
                      </span>
                    </div>
                    <Button
                      variant={notification.sendToAdmin ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(notification, 'sendToAdmin')}
                      disabled={isLoading || updatingId === notification.id}
                    >
                      {notification.sendToAdmin ? 'Bật' : 'Tắt'}
                    </Button>
                  </div>

                  {notification.adminEmails.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-1">Admin emails:</p>
                      <div className="flex flex-wrap gap-2">
                        {notification.adminEmails.map((email, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}




