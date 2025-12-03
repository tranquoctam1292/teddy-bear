'use client';

// Admin Sidebar Navigation Component
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface NavItem {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Sản phẩm',
    route: '/admin/products',
    icon: Package,
  },
  {
    label: 'Đơn hàng',
    route: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Bài viết',
    route: '/admin/posts',
    icon: BookOpen,
  },
  {
    label: 'Tin nhắn',
    route: '/admin/contacts',
    icon: Mail,
  },
  {
    label: 'SEO',
    route: '/admin/seo',
    icon: Search,
  },
  {
    label: 'Cài đặt',
    route: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const isActive = (route: string) => {
    if (route === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname?.startsWith(route);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 flex flex-col z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">The Emotional House</p>
            </div>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);

            return (
              <Link
                key={item.route}
                href={item.route}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="mb-3 px-4 py-2">
            <p className="text-xs font-medium text-gray-900">
              {session?.user?.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>
    </>
  );
}


