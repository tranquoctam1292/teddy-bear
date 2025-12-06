// Global 404 Not Found Page
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Log 404 error to API
    const log404Error = async () => {
      try {
        const url = pathname || window.location.pathname;
        const referer = document.referrer || undefined;
        const userAgent = navigator.userAgent || undefined;

        await fetch('/api/admin/seo/404', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            referer,
            userAgent,
          }),
        });
      } catch (error) {
        // Silently fail - don't break the 404 page if logging fails
        console.error('Failed to log 404 error:', error);
      }
    };

    log404Error();
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Trang không tìm thấy
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-pink-600 border-2 border-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}








