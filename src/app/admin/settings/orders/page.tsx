'use client';

// Admin Orders Settings Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import OrderStatusManager from '@/components/admin/OrderStatusManager';
import OrderStatusForm from '@/components/admin/OrderStatusForm';
import OrderNotificationManager from '@/components/admin/OrderNotificationManager';
import PaymentMethodManager from '@/components/admin/PaymentMethodManager';
import PaymentMethodForm from '@/components/admin/PaymentMethodForm';
import type { OrderStatus } from '@/lib/schemas/order-settings';
import type { OrderNotification } from '@/lib/schemas/order-settings';
import type { PaymentMethod } from '@/lib/schemas/order-settings';

export default function AdminOrdersSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Order Statuses state
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<OrderStatus | undefined>();
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Order Notifications state
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | undefined>();
  const [isSavingPaymentMethod, setIsSavingPaymentMethod] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStatuses();
      fetchNotifications();
      fetchPaymentMethods();
    }
  }, [status]);

  const fetchStatuses = async () => {
    try {
      setStatusesLoading(true);
      const response = await fetch('/api/admin/settings/order-statuses');
      if (!response.ok) throw new Error('Failed to fetch order statuses');
      const data = await response.json();
      setStatuses(data.statuses || []);
    } catch (error) {
      console.error('Error fetching order statuses:', error);
    } finally {
      setStatusesLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await fetch('/api/admin/settings/order-notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setPaymentMethodsLoading(true);
      const response = await fetch('/api/admin/settings/payment-methods');
      if (!response.ok) throw new Error('Failed to fetch payment methods');
      const data = await response.json();
      setPaymentMethods(data.methods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  // Status handlers
  const handleCreateStatus = () => {
    setEditingStatus(undefined);
    setShowStatusForm(true);
  };

  const handleEditStatus = (status: OrderStatus) => {
    setEditingStatus(status);
    setShowStatusForm(true);
  };

  const handleSaveStatus = async (data: any) => {
    try {
      setIsSavingStatus(true);
      const url = editingStatus
        ? `/api/admin/settings/order-statuses/${editingStatus.id}`
        : '/api/admin/settings/order-statuses';
      const method = editingStatus ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save order status');
      }

      setShowStatusForm(false);
      setEditingStatus(undefined);
      await fetchStatuses();
    } catch (error) {
      console.error('Error saving order status:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu trạng thái');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDeleteStatus = async (status: OrderStatus) => {
    try {
      const response = await fetch(`/api/admin/settings/order-statuses/${status.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete order status');
      }

      await fetchStatuses();
    } catch (error) {
      console.error('Error deleting order status:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa trạng thái');
      throw error;
    }
  };

  // Notification handlers
  const handleUpdateNotification = async (notification: OrderNotification) => {
    try {
      const response = await fetch('/api/admin/settings/order-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update notification');
      }

      await fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật thông báo');
    }
  };

  // Payment Method handlers
  const handleCreatePaymentMethod = () => {
    setEditingPaymentMethod(undefined);
    setShowPaymentMethodForm(true);
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingPaymentMethod(method);
    setShowPaymentMethodForm(true);
  };

  const handleSavePaymentMethod = async (data: any) => {
    try {
      setIsSavingPaymentMethod(true);
      const url = editingPaymentMethod
        ? `/api/admin/settings/payment-methods/${editingPaymentMethod.id}`
        : '/api/admin/settings/payment-methods';
      const method = editingPaymentMethod ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save payment method');
      }

      setShowPaymentMethodForm(false);
      setEditingPaymentMethod(undefined);
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu phương thức thanh toán');
    } finally {
      setIsSavingPaymentMethod(false);
    }
  };

  const handleDeletePaymentMethod = async (method: PaymentMethod) => {
    try {
      const response = await fetch(`/api/admin/settings/payment-methods/${method.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete payment method');
      }

      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phương thức thanh toán');
      throw error;
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
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt Đơn hàng</h1>
            <p className="text-sm text-gray-600 mt-1">
              Cấu hình trạng thái đơn hàng và thông báo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Order Statuses Section */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
            <CardDescription>
              Quản lý các trạng thái đơn hàng: chờ xử lý, đã xác nhận, đang giao hàng, hoàn thành, hủy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showStatusForm ? (
              <OrderStatusForm
                status={editingStatus}
                allStatuses={statuses}
                onSubmit={handleSaveStatus}
                onCancel={() => {
                  setShowStatusForm(false);
                  setEditingStatus(undefined);
                }}
                isLoading={isSavingStatus}
              />
            ) : (
              <OrderStatusManager
                statuses={statuses}
                onCreate={handleCreateStatus}
                onEdit={handleEditStatus}
                onDelete={handleDeleteStatus}
                isLoading={statusesLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Order Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Thông báo đơn hàng</CardTitle>
            <CardDescription>
              Cấu hình các thông báo khi có đơn hàng mới, đơn hàng thay đổi trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderNotificationManager
              notifications={notifications}
              onUpdate={handleUpdateNotification}
              isLoading={notificationsLoading}
            />
          </CardContent>
        </Card>

        {/* Payment Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu hình thanh toán</CardTitle>
            <CardDescription>
              Quản lý các phương thức thanh toán và cấu hình liên quan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showPaymentMethodForm ? (
              <PaymentMethodForm
                method={editingPaymentMethod}
                onSubmit={handleSavePaymentMethod}
                onCancel={() => {
                  setShowPaymentMethodForm(false);
                  setEditingPaymentMethod(undefined);
                }}
                isLoading={isSavingPaymentMethod}
              />
            ) : (
              <PaymentMethodManager
                methods={paymentMethods}
                onCreate={handleCreatePaymentMethod}
                onEdit={handleEditPaymentMethod}
                onDelete={handleDeletePaymentMethod}
                isLoading={paymentMethodsLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

