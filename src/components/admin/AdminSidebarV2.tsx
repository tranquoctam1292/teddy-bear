'use client';

// WordPress-Style Admin Sidebar with Hover Flyout & Click-to-Pin
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { LogOut, Menu, X } from 'lucide-react';
import { ADMIN_MENU } from '@/lib/admin-menu-config';
import { useMockBadgeCounts } from '@/hooks/useBadgeCounts';
import MenuItem from './menu/MenuItem';

export default function AdminSidebarV2() {
  const { data: session } = useSession();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [pinnedItem, setPinnedItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const badgeCounts = useMockBadgeCounts();

  // Update menu badges dynamically
  const menuWithBadges = ADMIN_MENU.map(item => {
    if (item.id === 'messages') return { ...item, badge: badgeCounts.messages };
    if (item.id === 'comments') return { ...item, badge: badgeCounts.comments };
    if (item.id === 'appearance') return { ...item, badge: badgeCounts.appearance };
    if (item.id === 'orders') {
      return {
        ...item,
        submenu: item.submenu?.map(sub => 
          sub.label === 'Đơn mới' ? { ...sub, badge: badgeCounts.orders } : sub
        ),
      };
    }
    return item;
  });

  const handleMouseEnter = (itemId: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set hover with small delay (100ms)
    hoverTimeoutRef.current = setTimeout(() => {
      if (pinnedItem !== itemId) {
        setHoveredItem(itemId);
      }
    }, 100);
  };

  const handleMouseLeave = () => {
    // Clear timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Hide flyout with delay (300ms)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
  };

  const handleClick = (itemId: string) => {
    if (pinnedItem === itemId) {
      setPinnedItem(null);
    } else {
      setPinnedItem(itemId);
      setHoveredItem(null);
    }
  };

  // Sidebar content
  const sidebarContent = (
    <>
      {/* Header */}
      <header className="p-6 border-b border-gray-700">
        <Link href="/admin/dashboard" className="block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <p className="font-semibold text-white">Admin</p>
              <p className="text-xs text-gray-400">The Emotional House</p>
            </div>
          </div>
        </Link>
      </header>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">
        {menuWithBadges.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isHovered={hoveredItem === item.id}
            isPinned={pinnedItem === item.id}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(item.id)}
          />
        ))}
      </nav>

      {/* User Section */}
      <footer className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {session?.user?.email?.[0].toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-gray-400 truncate">
              {session?.user?.email || 'Not logged in'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </footer>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-800 text-white flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm">The Emotional House</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Admin
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 overlay-fade"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gray-800 text-white flex flex-col mobile-sidebar shadow-2xl">
            {/* Close button */}
            <header className="p-4 border-b border-gray-700 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </header>
            
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

