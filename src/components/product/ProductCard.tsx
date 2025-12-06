'use client';

// Thẻ sản phẩm ngoài danh sách với nút "Mua ngay" trên mobile
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatCurrency, formatPriceRange } from '@/lib/utils';
import { Heart, Star, ShoppingCart, Eye, Baby, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickViewModal from './QuickViewModal';
import SizeDisplay from './SizeDisplay';
import ColorDisplay from './ColorDisplay';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Ensure variants and images are arrays
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const images = Array.isArray(product.images) ? product.images : [];

  // Find variant based on selected size and color
  const currentVariant = useMemo(() => {
    if (variants.length === 0) return null;

    if (!selectedSize && !selectedColor) {
      return variants[0] || null;
    }

    if (selectedSize && selectedColor) {
      const variant = variants.find(
        (v) => v.size === selectedSize && (v.colorCode === selectedColor || v.color === selectedColor)
      );
      if (variant) return variant;
    }

    if (selectedSize) {
      const variant = variants.find((v) => v.size === selectedSize);
      if (variant) return variant;
    }

    if (selectedColor) {
      const variant = variants.find(
        (v) => v.colorCode === selectedColor || v.color === selectedColor
      );
      if (variant) return variant;
    }

    return variants[0] || null;
  }, [selectedSize, selectedColor, variants]);

  // Price display based on selected variant
  const currentPrice = currentVariant?.price ?? product.basePrice;
  const priceDisplay =
    product.maxPrice && product.maxPrice > product.basePrice
      ? formatPriceRange(product.basePrice, product.maxPrice)
      : formatCurrency(currentPrice);

  const originalPrice = (product as any).originalPrice as number | undefined;
  const hasDiscount = originalPrice !== undefined && originalPrice > currentPrice;
  const discountPercent =
    hasDiscount && originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // Image display based on selected variant
  const displayImage = currentVariant?.image || images[0] || '';

  // Extract unique sizes from variants
  const availableSizes = Array.from(
    new Set(variants.map((v) => v.size))
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
      variants
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
      const variant = variants.find(
        (v) => v.size === size && (v.colorCode === selectedColor || v.color === selectedColor)
      );
      if (!variant) {
        // If no variant with this size and color, find any variant with this size
        const sizeVariant = variants.find((v) => v.size === size);
        if (sizeVariant && (sizeVariant.colorCode || sizeVariant.color)) {
          setSelectedColor(sizeVariant.colorCode || sizeVariant.color || null);
        } else {
          setSelectedColor(null);
        }
      }
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (variants.length === 0) return;

    setIsAdding(true);

    const variantToAdd = currentVariant || variants[0];
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
      image: variantToAdd.image || images[0] || '',
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  const handleColorSelect = (color: { name?: string; code?: string }) => {
    const colorKey = color.code || color.name || null;
    setSelectedColor(colorKey);
    // Try to keep the same size if possible
    if (selectedSize) {
      const variant = variants.find(
        (v) => v.size === selectedSize && (v.colorCode === colorKey || v.color === colorKey)
      );
      if (!variant) {
        // If no variant with this size and color, find any variant with this color
        const colorVariant = variants.find(
          (v) => v.colorCode === colorKey || v.color === colorKey
        );
        if (colorVariant) {
          setSelectedSize(colorVariant.size);
        }
      }
    }
  };

  return (
    <article className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-gray-100"
        aria-label={`Xem chi tiết ${product.name}`}
      >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />

          {/* Badge - Support hot/new/sale from product data */}
          {product.isHot && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-500">
              🔥 Hot
            </div>
          )}
          {(product as any).badge === 'new' && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500">
              ✨ Mới
            </div>
          )}
          {(product as any).badge === 'sale' && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white bg-pink-600">
              💥 Sale
            </div>
          )}

          {/* Discount Tag */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Age Recommendation Badge */}
          {((product as any).ageRecommendation || (product as any).ageRange) && (
            <div
              className={cn(
                'absolute bottom-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-md',
                ((product as any).ageRecommendation === '0-3' || (product as any).ageRange === '0-3') && 'bg-blue-500',
                ((product as any).ageRecommendation === '3-6' || (product as any).ageRange === '3-6') && 'bg-green-500',
                ((product as any).ageRecommendation === '6+' || (product as any).ageRange === '6+') && 'bg-purple-500',
                ((product as any).ageRecommendation === 'all' || (product as any).ageRange === 'all') && 'bg-pink-600'
              )}
            >
              <Baby className="w-3 h-3" />
              <span>
                {(product as any).ageRecommendation === '0-3' || (product as any).ageRange === '0-3'
                  ? '0-3 tuổi'
                  : (product as any).ageRecommendation === '3-6' || (product as any).ageRange === '3-6'
                  ? '3-6 tuổi'
                  : (product as any).ageRecommendation === '6+' || (product as any).ageRange === '6+'
                  ? '6+ tuổi'
                  : (product as any).ageRecommendation === 'all' || (product as any).ageRange === 'all'
                  ? 'Mọi lứa tuổi'
                  : (product as any).ageRange || (product as any).ageRecommendation}
              </span>
            </div>
          )}

          {/* Quick Actions Overlay (Hover) - Desktop only */}
          <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 z-20">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              aria-label="Xem nhanh"
            >
              <Eye className="w-4 h-4 mr-1" />
              Xem nhanh
            </Button>
            <Button
              size="sm"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={handleAddToCart}
              disabled={isAdding || variants.length === 0}
              aria-label="Thêm vào giỏ"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </Button>
          </div>

          {/* Wishlist Button - Hidden on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Add to wishlist
            }}
            className={cn(
              'hidden md:block absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 hover:bg-white transition-all',
              'opacity-0 group-hover:opacity-100'
            )}
            aria-label="Thêm vào yêu thích"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </Link>

        {/* Product Info */}
        <div className="p-3 md:p-4 space-y-2">
          {/* Product Name */}
          <h2 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base min-h-[2.5rem] md:min-h-[3rem] group-hover:text-pink-600 transition-colors">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h2>

          {/* Material Info */}
          {(product as any).material && (
            <p className="text-xs text-gray-500 line-clamp-1" title={(product as any).material}>
              {(product as any).material}
            </p>
          )}

          {/* Rating */}
          {(product as any).rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor((product as any).rating!)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-1">({(product as any).rating})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{priceDisplay}</span>
            {hasDiscount && originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Variant Selectors */}
          {variants.length > 0 && (
            <div className="space-y-2 pt-2" onClick={(e) => e.stopPropagation()}>
              {/* Available Sizes */}
              {availableSizes.length > 0 && (
                <SizeDisplay
                  sizes={availableSizes}
                  maxDisplay={4}
                  selectedSize={selectedSize || undefined}
                  onSizeSelect={handleSizeSelect}
                />
              )}

              {/* Available Colors */}
              {availableColors.length > 0 && (
                <ColorDisplay
                  colors={availableColors}
                  maxDisplay={3}
                  size="sm"
                  selectedColor={selectedColor || undefined}
                  onColorSelect={handleColorSelect}
                />
              )}
            </div>
          )}

          {/* Không hiển thị nút hành động ở cuối thẻ trên desktop/mobile */}
        </div>

      {/* Mobile: giữ UI gọn, chỉ click vào card để vào chi tiết; overlay chỉ hiển thị trên desktop */}

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </article>
  );
}
