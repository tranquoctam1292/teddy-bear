'use client';

// MobileMenu component với hamburger menu - Tối ưu cho giới trẻ dùng mobile
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingCart, Heart, User, Home, Package, BookOpen, Info, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';

interface NavigationItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  pathname: string | null;
  cartItemCount: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'Trang chủ': <Home className="w-5 h-5" />,
  'Sản phẩm': <Package className="w-5 h-5" />,
  'Góc của Gấu': <BookOpen className="w-5 h-5" />,
  'Về chúng tôi': <Info className="w-5 h-5" />,
  'Cửa hàng': <MapPin className="w-5 h-5" />,
};

export default function MobileMenu({
  isOpen,
  onClose,
  navigation,
  pathname,
  cartItemCount,
}: MobileMenuProps) {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleQuickCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
      onClose();
    } else {
      router.push('/products');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">🐻</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-6 py-4 transition-colors
                        ${
                          isActive
                            ? 'bg-pink-50 text-pink-700 border-r-4 border-pink-600 font-semibold'
                            : 'text-gray-700 hover:bg-pink-50'
                        }
                      `}
                    >
                      {iconMap[item.name]}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Actions Section */}
              <div className="border-t border-gray-200 p-4 space-y-2 bg-gray-50">
                <Link
                  href="/products?filter=hot"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Sản phẩm Hot 🔥</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-pink-50 transition-colors border border-gray-200"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium text-sm">Yêu thích</span>
                  </Link>

                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-pink-50 transition-colors border border-gray-200"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium text-sm">Tài khoản</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Actions - Cart & Checkout */}
              <div className="border-t border-gray-200 p-4 space-y-2 bg-white">
                {/* Cart Button */}
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold flex-1">Giỏ hàng</span>
                  {cartItemCount > 0 && (
                    <>
                      <span className="bg-white text-pink-600 text-xs font-bold rounded-full px-2.5 py-1">
                        {cartItemCount}
                      </span>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat('vi-VN').format(getTotalPrice())}đ
                      </span>
                    </>
                  )}
                </Link>

                {/* Quick Checkout Button - Nổi bật cho mobile */}
                {items.length > 0 && (
                  <button
                    onClick={handleQuickCheckout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg font-bold text-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Thanh toán ngay
                    <span className="text-pink-200 text-sm">
                      ({new Intl.NumberFormat('vi-VN').format(getTotalPrice())}đ)
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
