'use client';

// Thẻ sản phẩm ngoài danh sách với nút "Mua ngay" trên mobile
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { formatCurrency, formatPriceRange } from '@/lib/utils';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import QuickViewModal from './QuickViewModal';
import SizeDisplay from './SizeDisplay';
import ColorDisplay from './ColorDisplay';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Find variant based on selected size and color
  const currentVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) {
      return product.variants[0] || null;
    }

    if (selectedSize && selectedColor) {
      const variant = product.variants.find(
        (v) => v.size === selectedSize && (v.colorCode === selectedColor || v.color === selectedColor)
      );
      if (variant) return variant;
    }

    if (selectedSize) {
      const variant = product.variants.find((v) => v.size === selectedSize);
      if (variant) return variant;
    }

    if (selectedColor) {
      const variant = product.variants.find(
        (v) => v.colorCode === selectedColor || v.color === selectedColor
      );
      if (variant) return variant;
    }

    return product.variants[0] || null;
  }, [selectedSize, selectedColor, product.variants]);

  // Price display based on selected variant
  const priceDisplay = currentVariant
    ? formatCurrency(currentVariant.price)
    : product.maxPrice && product.maxPrice > product.basePrice
    ? formatPriceRange(product.basePrice, product.maxPrice)
    : formatCurrency(product.basePrice);

  // Image display based on selected variant
  const displayImage = currentVariant?.image || product.images[0] || '';

  // Extract unique sizes from variants
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size))
  ).sort((a, b) => {
    // Sort by numeric value if possible
    const aNum = parseFloat(a.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(b.replace(/[^0-9.]/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.localeCompare(b);
  });

  // Extract unique colors from variants
  const availableColors = Array.from(
    new Map(
      product.variants
        .filter((v) => v.color || v.colorCode)
        .map((v) => [
          v.colorCode || v.color || 'default',
          { name: v.color, code: v.colorCode },
        ])
    ).values()
  );

  // Handlers for size and color selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Try to keep the same color if possible
    if (selectedColor) {
      const variant = product.variants.find(
        (v) => v.size === size && (v.colorCode === selectedColor || v.color === selectedColor)
      );
      if (!variant) {
        // If no variant with this size and color, find any variant with this size
        const sizeVariant = product.variants.find((v) => v.size === size);
        if (sizeVariant && (sizeVariant.colorCode || sizeVariant.color)) {
          setSelectedColor(sizeVariant.colorCode || sizeVariant.color || null);
        } else {
          setSelectedColor(null);
        }
      }
    }
  };

  const handleColorSelect = (color: { name?: string; code?: string }) => {
    const colorKey = color.code || color.name || null;
    setSelectedColor(colorKey);
    // Try to keep the same size if possible
    if (selectedSize) {
      const variant = product.variants.find(
        (v) => v.size === selectedSize && (v.colorCode === colorKey || v.color === colorKey)
      );
      if (!variant) {
        // If no variant with this size and color, find any variant with this color
        const colorVariant = product.variants.find(
          (v) => v.colorCode === colorKey || v.color === colorKey
        );
        if (colorVariant) {
          setSelectedSize(colorVariant.size);
        }
      }
    }
  };

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants.length === 0) return;

    setIsAdding(true);
    
    // Use selected variant or first available variant
    const variantToAdd = currentVariant || product.variants[0];
    
    if (!variantToAdd) return;
    
    addItem({
      productId: product.id,
      variantId: variantToAdd.id,
      name: product.name,
      size: variantToAdd.size,
      price: variantToAdd.price,
      quantity: 1,
      image: variantToAdd.image || product.images[0] || '',
    });

    // Navigate to cart after short delay
    setTimeout(() => {
      router.push('/cart');
      setIsAdding(false);
    }, 300);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Hot Badge */}
        {product.isHot && (
          <div className="absolute top-3 left-3 z-10 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Hot
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Add to wishlist
          }}
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🐻</span>
            </div>
          )}

          {/* Quick View Overlay - Desktop only */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 flex items-center gap-2 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              Xem nhanh
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <p className="text-xs text-pink-600 font-medium uppercase">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-all">
            {product.name}
          </h3>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-cream-100 text-brown-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-lg font-bold text-pink-600">{priceDisplay}</span>
          </div>

          {/* Available Sizes */}
          {availableSizes.length > 0 && (
            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
              <SizeDisplay 
                sizes={availableSizes} 
                maxDisplay={4}
                selectedSize={selectedSize || undefined}
                onSizeSelect={handleSizeSelect}
              />
            </div>
          )}

          {/* Available Colors */}
          {availableColors.length > 0 && (
            <div className="pt-1.5" onClick={(e) => e.stopPropagation()}>
              <ColorDisplay 
                colors={availableColors} 
                maxDisplay={3} 
                size="sm"
                selectedColor={selectedColor || undefined}
                onColorSelect={handleColorSelect}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Mobile Quick Buy Button - Sticky on mobile */}
      <div className="lg:hidden border-t border-gray-100 p-3 bg-white flex gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsQuickViewOpen(true);
          }}
          className="flex-1 bg-white border-2 border-pink-600 text-pink-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Xem nhanh
        </button>
        <button
          onClick={handleQuickBuy}
          disabled={isAdding || product.variants.length === 0}
          className="flex-1 bg-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdding ? 'Đang thêm...' : 'Mua ngay'}
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
}
