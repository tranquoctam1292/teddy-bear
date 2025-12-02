'use client';

// Admin Order Listing Page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Search,
  Package,
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { Order } from '@/lib/schemas/order';

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ORDER_STATUSES: { value: Order['orderStatus']; label: string; color: string; icon: any }[] = [
  { value: 'pending', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  { value: 'processing', label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
  { value: 'shipping', label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
];

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['orderStatus'] | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, currentPage, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error('Failed to fetch orders');

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      setUpdatingStatus(orderId);
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update order status');
      }

      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const getStatusInfo = (orderStatus: Order['orderStatus']) => {
    return ORDER_STATUSES.find((s) => s.value === orderStatus) || ORDER_STATUSES[0];
  };

  if (status === 'loading' || loading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <p className="text-sm text-gray-600 mt-1">
          Tổng cộng {pagination.total} đơn hàng
        </p>
      </div>

      {/* Main Content */}
      <div>
        {/* Filters */}
        <div className="mb-6 space-y-4 md:flex md:items-center md:gap-4 md:space-y-0">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn, email, tên khách hàng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Order['orderStatus'] | '');
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Chưa có đơn hàng nào</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusInfo = getStatusInfo(order.orderStatus);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.orderId}</div>
                          <div className="text-sm text-gray-500">
                            {order.paymentDetails.method.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm text-gray-500">{order.guestEmail}</div>
                          <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.length} sản phẩm
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items[0]?.name}
                            {order.items.length > 1 && ` +${order.items.length - 1} khác`}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <div className="relative">
                              <select
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    order.orderId,
                                    e.target.value as Order['orderStatus']
                                  )
                                }
                                disabled={updatingStatus === order.orderId}
                                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status.value} value={status.value}>
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {updatingStatus === order.orderId && (
                              <div className="ml-2 w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(currentPage - 1) * pagination.limit + 1} -{' '}
                {Math.min(currentPage * pagination.limit, pagination.total)} trong tổng số{' '}
                {pagination.total} đơn hàng
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Trang {currentPage} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

