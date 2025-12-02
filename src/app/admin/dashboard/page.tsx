'use client';

// Admin Dashboard - Protected Route
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Settings,
  BarChart3,
  FileText,
  Mail
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  // Mock stats data
  const stats = [
    {
      name: 'Tổng sản phẩm',
      value: '24',
      icon: Package,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Đơn hàng hôm nay',
      value: '8',
      icon: ShoppingCart,
      change: '+5',
      changeType: 'positive',
    },
    {
      name: 'Doanh thu tháng',
      value: '12.5M',
      icon: DollarSign,
      change: '+23%',
      changeType: 'positive',
    },
    {
      name: 'Khách hàng mới',
      value: '142',
      icon: Users,
      change: '+18%',
      changeType: 'positive',
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Nguyễn Văn A', total: 450000, status: 'pending' },
    { id: 'ORD-002', customer: 'Trần Thị B', total: 320000, status: 'confirmed' },
    { id: 'ORD-003', customer: 'Lê Văn C', total: 580000, status: 'shipping' },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Chào mừng, {session?.user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/settings')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">so với tháng trước</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Đơn hàng gần đây</h2>
              <Link href="/admin/orders" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(order.total)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status === 'pending'
                        ? 'Chờ xử lý'
                        : order.status === 'confirmed'
                        ? 'Đã xác nhận'
                        : 'Đang giao hàng'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/products"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200"
                >
                  <Package className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Quản lý sản phẩm</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Quản lý đơn hàng</span>
                </Link>
                <Link
                  href="/admin/posts"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200"
                >
                  <FileText className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Quản lý bài viết</span>
                </Link>
                <Link
                  href="/admin/contacts"
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200"
                >
                  <Mail className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Tin nhắn liên hệ</span>
                </Link>
                <button
                  onClick={() => router.push('/admin/analytics')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left border border-gray-200"
                >
                  <BarChart3 className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-900">Phân tích & Báo cáo</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

