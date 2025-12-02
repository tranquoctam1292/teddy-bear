'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
    } else {
      updateQuantity(item.productId, item.variantId, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.productId, item.variantId);
      setIsRemoving(false);
    }, 200);
  };

  return (
    <div
      className={`flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all ${
        isRemoving ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🐻</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="block hover:text-pink-600 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">Kích thước: {item.size}</p>
        
        {/* Price */}
        <p className="text-lg font-bold text-pink-600 mb-3">
          {formatCurrency(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-600 hover:bg-pink-50 rounded-lg transition-colors"
              aria-label="Save for later"
              title="Lưu để mua sau"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item"
              title="Xóa sản phẩm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <p className="text-sm text-gray-600 mt-2">
          Tổng: <span className="font-semibold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </p>
      </div>
    </div>
  );
}
