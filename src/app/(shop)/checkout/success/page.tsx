'use client';

// Trang thành công sau khi đặt hàng
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã đặt hàng tại The Emotional House
          </p>
          <p className="text-gray-500">
            Mã đơn hàng: <span className="font-semibold text-pink-600">{orderId}</span>
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-pink-600" />
              <div>
                <p className="font-medium text-gray-900">Trạng thái đơn hàng</p>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Email xác nhận</p>
                <p className="text-sm text-gray-600">
                  Đã gửi đến email của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-pink-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Bước tiếp theo</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li>1. Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút</li>
            <li>2. Đơn hàng sẽ được đóng gói và giao trong 1-3 ngày</li>
            <li>3. Bạn sẽ nhận được thông báo khi đơn hàng được giao</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Auto redirect notice */}
        {countdown > 0 && (
          <p className="text-sm text-gray-500 mt-6">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </p>
        )}
      </div>
    </div>
  );
}


