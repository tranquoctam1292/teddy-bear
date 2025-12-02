'use client';

// Giỏ hàng với CartItem và UpsellServices
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartItem from '@/components/cart/CartItem';
import UpsellServices from '@/components/cart/UpsellServices';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    clearCart,
    getSubtotal,
    getUpsellTotal,
    getShippingFee,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const upsellTotal = getUpsellTotal();
  const shippingFee = getShippingFee();
  const total = getTotalPrice();
  const totalItems = getTotalItems();

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
            <p className="text-gray-600">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Tiếp tục mua sắm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">
            Bạn có {totalItems} {totalItems === 1 ? 'sản phẩm' : 'sản phẩm'} trong giỏ hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items & Upsell Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Sản phẩm ({items.length})
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa tất cả
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                ))}
              </div>
            </div>

            {/* Upsell Services */}
            <UpsellServices />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {upsellTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dịch vụ bổ sung</span>
                    <span>{formatCurrency(upsellTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-pink-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-pink-600 text-white text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 transition-colors mb-4"
              >
                Thanh toán
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block w-full text-center text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium"
              >
                ← Tiếp tục mua sắm
              </Link>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
