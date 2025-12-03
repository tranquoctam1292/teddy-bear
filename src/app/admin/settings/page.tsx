'use client';

// Admin Settings Page
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Package,
  ShoppingCart,
  Mail,
  Settings as SettingsIcon,
  Shield,
  Palette,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin/ui/card';

export default function AdminSettingsPage() {
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

  const settingsCategories = [
    {
      title: 'Navigation',
      description: 'Quản lý menu điều hướng của website',
      icon: Navigation,
      href: '/admin/settings/navigation',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Sản phẩm',
      description: 'Cài đặt danh mục, tags, và thuộc tính sản phẩm',
      icon: Package,
      href: '/admin/settings/products',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Đơn hàng',
      description: 'Cấu hình trạng thái đơn hàng và thông báo',
      icon: ShoppingCart,
      href: '/admin/settings/orders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Email & Thông báo',
      description: 'Cài đặt email templates và thông báo',
      icon: Mail,
      href: '/admin/settings/notifications',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Bảo mật',
      description: 'Quản lý quyền truy cập và bảo mật',
      icon: Shield,
      href: '/admin/settings/security',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Giao diện',
      description: 'Tùy chỉnh theme và màu sắc',
      icon: Palette,
      href: '/admin/settings/appearance',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'SEO',
      description: 'Quản lý và tối ưu hóa SEO',
      icon: Search,
      href: '/admin/seo',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-sm text-gray-600 mt-1">
          Quản lý cấu hình hệ thống
        </p>
      </div>

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

