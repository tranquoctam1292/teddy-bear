'use client';

// Sticky Buy Button cho mobile - Cực kỳ thuận tiện cho giới trẻ
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { Product, Variant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MobileBuyButtonProps {
  product: Product;
  selectedVariant: Variant | null;
  quantity: number;
}

export default function MobileBuyButton({
  product,
  selectedVariant,
  quantity,
}: MobileBuyButtonProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image || product.images[0] || '',
    });

    // Navigate to checkout after short delay
    setTimeout(() => {
      router.push('/checkout');
      setIsAdding(false);
    }, 300);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image || product.images[0] || '',
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  if (!selectedVariant) {
    return null;
  }

  const totalPrice = selectedVariant.price * quantity;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-pink-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Price Display */}
          <div className="flex-1">
            <p className="text-xs text-gray-500">Tổng cộng</p>
            <p className="text-xl font-bold text-pink-600">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding || selectedVariant.stock === 0}
              className="px-4 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-lg font-semibold hover:bg-pink-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>

            {/* Buy Now - Nổi bật */}
            <button
              onClick={handleBuyNow}
              disabled={isAdding || selectedVariant.stock === 0}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-lg font-bold text-base hover:from-pink-700 hover:to-pink-800 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Mua ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




