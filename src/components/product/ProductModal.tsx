'use client';

// Product Modal Component cho Mobile
// Hiển thị đầy đủ thông tin sản phẩm khi click vào product card trên mobile
import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Eye, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/store/useCartStore';
import type { Product, Variant } from '@/types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Get variants or create default
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const images = Array.isArray(product.images) ? product.images : [];

  // Set default variant on open
  useEffect(() => {
    if (isOpen && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [isOpen, variants, selectedVariant]);

  // Price display
  const priceDisplay = selectedVariant
    ? formatCurrency(selectedVariant.price)
    : product.maxPrice && product.maxPrice > product.basePrice
    ? `${formatCurrency(product.basePrice)} - ${formatCurrency(product.maxPrice)}`
    : formatCurrency(product.basePrice);

  // Image display
  const displayImage = selectedVariant?.image || images[0] || '';

  // Handle add to cart
  const handleAddToCart = async () => {
    if (variants.length === 0) return;

    setIsAdding(true);

    const variantToAdd = selectedVariant || variants[0];

    if (!variantToAdd) {
      setIsAdding(false);
      return;
    }

    addItem({
      productId: product.id,
      variantId: variantToAdd.id,
      name: product.name,
      size: variantToAdd.size,
      price: variantToAdd.price,
      quantity: 1,
      image: variantToAdd.image || displayImage,
    });

    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 500);
  };

  // Handle contact (Zalo or Phone)
  const handleContact = () => {
    // Zalo: zalo.me/phone hoặc mở Zalo app
    const phone = '1900123456'; // Get from Footer or config
    window.open(`https://zalo.me/${phone}`, '_blank');
  };

  // Truncate description for mobile
  const truncatedDescription = product.description
    ? product.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : 'Chưa có mô tả';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto p-0 md:hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-lg font-semibold line-clamp-2">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl">🧸</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-pink-600">{priceDisplay}</span>
            {product.maxPrice && product.maxPrice > product.basePrice && (
              <span className="text-sm text-gray-500">
                (Từ {formatCurrency(product.basePrice)})
              </span>
            )}
          </div>

          {/* Variant Selector (if has variants) */}
          {variants.length > 1 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Kích thước:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-pink-600 bg-pink-50 text-pink-600 font-semibold'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Mô tả sản phẩm:</p>
            <p className="text-sm text-gray-600 leading-relaxed">{truncatedDescription}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            {/* Add to Cart */}
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              onClick={handleAddToCart}
              disabled={isAdding || variants.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </Button>

            {/* View Details */}
            <Button
              variant="outline"
              className="w-full border-pink-600 text-pink-600 hover:bg-pink-50"
              asChild
            >
              <Link href={`/products/${product.slug}`} onClick={onClose}>
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Link>
            </Button>

            {/* Contact */}
            <Button
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50"
              onClick={handleContact}
            >
              <Phone className="w-4 h-4 mr-2" />
              Liên hệ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

