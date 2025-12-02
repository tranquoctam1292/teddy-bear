'use client';

// Header component với dynamic navigation
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, Heart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import MobileMenu from './MobileMenu';
import DynamicNavigation from './DynamicNavigation';
import type { NavigationMenuItem } from '@/lib/schemas/navigation';

// Fallback navigation if API fails
const fallbackNavigation: NavigationMenuItem[] = [
  { id: 'nav-home', label: 'Trang chủ', url: '/', type: 'internal_page', order: 1 },
  { id: 'nav-products', label: 'Sản phẩm', url: '/products', type: 'internal_page', order: 2 },
  { id: 'nav-blog', label: 'Góc của Gấu', url: '/blog', type: 'internal_page', order: 3 },
  { id: 'nav-about', label: 'Về chúng tôi', url: '/about', type: 'internal_page', order: 4 },
  { id: 'nav-store', label: 'Cửa hàng', url: '/store', type: 'internal_page', order: 5 },
];

export default function HeaderWithMenu() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationMenuItem[]>(fallbackNavigation);
  const pathname = usePathname();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Fetch dynamic menu
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/navigation?location=main_header');
        if (response.ok) {
          const data = await response.json();
          if (data.menu && data.menu.items) {
            setNavigationItems(data.menu.items);
          }
        }
      } catch (error) {
        console.error('Error fetching navigation menu:', error);
        // Use fallback navigation
      }
    };

    fetchMenu();
  }, []);

  // Convert NavigationMenuItem to simple format for MobileMenu
  const simpleNavigation = navigationItems.map((item) => ({
    name: item.label,
    href: item.url,
  }));

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-xl font-bold">🐻</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">The Emotional House</h1>
                <p className="text-xs text-gray-500">Gấu bông cao cấp</p>
              </div>
            </Link>

            {/* Desktop Navigation - Dynamic */}
            <div className="hidden lg:block">
              <DynamicNavigation items={navigationItems} />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {isSearchOpen && (
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={simpleNavigation}
        pathname={pathname}
        cartItemCount={cartItemCount}
      />
    </>
  );
}


