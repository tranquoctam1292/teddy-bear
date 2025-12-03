'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, Variant } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { X, ShoppingCart, Eye } from 'lucide-react';
import VariantSelector from './VariantSelector';
import { useCartStore } from '@/store/useCartStore';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] || null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [currentImage, setCurrentImage] = useState(
    selectedVariant?.image || product.images[0] || ''
  );

  // Reset selected variant when modal opens
  useEffect(() => {
    if (isOpen && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setCurrentImage(firstVariant.image || product.images[0] || '');
    }
  }, [isOpen, product]);

  // Update image when variant changes
  useEffect(() => {
    if (selectedVariant) {
      setCurrentImage(selectedVariant.image || product.images[0] || '');
    }
  }, [selectedVariant, product.images]);

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;

    setIsAdding(true);
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity: 1,
      image: selectedVariant.image || product.images[0] || '',
    });

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false);
      // Optionally close modal or show success message
      // onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[90vh]">
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl">🐻</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      currentImage === img
                        ? 'border-pink-500'
                        : 'border-transparent hover:border-pink-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-4">
            {/* Category */}
            <p className="text-sm text-pink-600 font-medium uppercase">
              {product.category}
            </p>

            {/* Product Name */}
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-cream-100 text-brown-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Variant Selector */}
            {product.variants.length > 0 ? (
              <div className="pt-4 border-t border-gray-200">
                <VariantSelector
                  product={product}
                  selectedVariantId={selectedVariant?.id}
                  onVariantChange={handleVariantChange}
                />
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-red-500 text-sm">Sản phẩm hiện không có sẵn</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddToCart}
                disabled={
                  isAdding ||
                  !selectedVariant ||
                  selectedVariant.stock === 0
                }
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding
                  ? 'Đang thêm...'
                  : selectedVariant?.stock === 0
                  ? 'Hết hàng'
                  : 'Thêm vào giỏ hàng'}
              </button>

              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="w-full bg-white border-2 border-pink-600 text-pink-600 py-3 px-6 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


