'use client';

// System Notification Manager Component
import { useState } from 'react';
import { Bell, BellOff, Mail, Smartphone, Monitor } from 'lucide-react';
import type { SystemNotification } from '@/lib/schemas/notification-settings';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface SystemNotificationManagerProps {
  notifications: SystemNotification[];
  onUpdate: (notification: SystemNotification) => Promise<void>;
  isLoading?: boolean;
}

const EVENT_LABELS: Record<string, string> = {
  new_order: 'Đơn hàng mới',
  low_stock: 'Hàng tồn kho thấp',
  new_contact: 'Liên hệ mới',
  payment_received: 'Thanh toán nhận được',
  order_cancelled: 'Đơn hàng bị hủy',
  user_registered: 'Người dùng đăng ký',
};

export default function SystemNotificationManager({
  notifications,
  onUpdate,
  isLoading = false,
}: SystemNotificationManagerProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggle = async (
    notification: SystemNotification,
    field: 'enabled' | 'channels.email' | 'channels.inApp' | 'channels.push'
  ) => {
    setUpdatingId(notification.id);
    try {
      if (field === 'enabled') {
        await onUpdate({
          ...notification,
          enabled: !notification.enabled,
        });
      } else {
        const channelKey = field.split('.')[1] as 'email' | 'inApp' | 'push';
        await onUpdate({
          ...notification,
          channels: {
            ...notification.channels,
            [channelKey]: !notification.channels[channelKey],
          },
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Thông báo hệ thống</h3>
        <p className="text-sm text-gray-600 mt-1">
          Cấu hình các thông báo trong hệ thống admin
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {EVENT_LABELS[notification.event] || notification.event}
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
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <Button
                      variant={notification.channels.email ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(notification, 'channels.email')}
                      disabled={isLoading || updatingId === notification.id}
                    >
                      {notification.channels.email ? 'Bật' : 'Tắt'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">In-app</span>
                    </div>
                    <Button
                      variant={notification.channels.inApp ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(notification, 'channels.inApp')}
                      disabled={isLoading || updatingId === notification.id}
                    >
                      {notification.channels.inApp ? 'Bật' : 'Tắt'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Push</span>
                    </div>
                    <Button
                      variant={notification.channels.push ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggle(notification, 'channels.push')}
                      disabled={isLoading || updatingId === notification.id}
                    >
                      {notification.channels.push ? 'Bật' : 'Tắt'}
                    </Button>
                  </div>

                  {notification.recipients.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-1">Recipients:</p>
                      <div className="flex flex-wrap gap-2">
                        {notification.recipients.map((email, idx) => (
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



