// Product Card Component - Enhanced with Variants, Cart & QuickView
// Client Component with variant selection, cart integration, and quick view modal
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Heart, Baby, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HomepageProduct } from '@/lib/mock-data';
import type { Product, Variant } from '@/types';
import { formatPriceRange } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import QuickViewModal from '@/components/product/QuickViewModal';
import SizeDisplay from '@/components/product/SizeDisplay';
import ColorDisplay from '@/components/product/ColorDisplay';

interface ProductCardProps {
  product: HomepageProduct;
  showQuickView?: boolean;
  showWishlist?: boolean;
}

/**
 * Convert HomepageProduct to Product type for QuickViewModal
 */
function convertToProduct(homepageProduct: HomepageProduct): Product {
  return {
    id: homepageProduct.id,
    name: homepageProduct.name,
    slug: homepageProduct.slug,
    description: homepageProduct.material || '',
    category: homepageProduct.category || '',
    tags: homepageProduct.tags || [],
    basePrice: homepageProduct.basePrice || homepageProduct.price,
    maxPrice: homepageProduct.maxPrice,
    images: homepageProduct.images || [homepageProduct.image],
    variants: homepageProduct.variants || [
      {
        id: `${homepageProduct.id}-default`,
        size: homepageProduct.size || 'M',
        price: homepageProduct.price,
        stock: 10,
      },
    ],
    isHot: homepageProduct.badge === 'hot',
  };
}

/**
 * Calculate discount percentage
 */
function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function ProductCard({
  product,
  showQuickView = true,
  showWishlist = true,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Convert to Product type for QuickViewModal
  const productForModal = useMemo(() => convertToProduct(product), [product]);

  // Get variants or create default
  const variants = product.variants || [
    {
      id: `${product.id}-default`,
      size: product.size || 'M',
      price: product.price,
      stock: 10,
    },
  ];

  // Find current variant based on selected size and color
  const currentVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) {
      return variants[0] || null;
    }

    if (selectedSize && selectedColor) {
      const variant = variants.find(
        (v) =>
          v.size === selectedSize && (v.colorCode === selectedColor || v.color === selectedColor)
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
  const priceDisplay = currentVariant
    ? formatCurrency(currentVariant.price)
    : product.maxPrice && product.maxPrice > product.basePrice!
    ? formatPriceRange(product.basePrice || product.price, product.maxPrice)
    : formatCurrency(product.basePrice || product.price);

  // Image display based on selected variant
  const displayImage = currentVariant?.image || product.images?.[0] || product.image;

  // Extract unique sizes from variants
  const availableSizes = Array.from(new Set(variants.map((v) => v.size))).sort((a, b) => {
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
        .map((v) => [v.colorCode || v.color || 'default', { name: v.color, code: v.colorCode }])
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
        const sizeVariant = variants.find((v) => v.size === size);
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
      const variant = variants.find(
        (v) => v.size === selectedSize && (v.colorCode === colorKey || v.color === colorKey)
      );
      if (!variant) {
        const colorVariant = variants.find((v) => v.colorCode === colorKey || v.color === colorKey);
        if (colorVariant) {
          setSelectedSize(colorVariant.size);
        }
      }
    }
  };

  const hasDiscount =
    product.originalPrice && product.originalPrice > (currentVariant?.price || product.price);
  const discountPercent =
    hasDiscount && product.originalPrice
      ? calculateDiscount(currentVariant?.price || product.price, product.originalPrice)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (variants.length === 0) return;

    setIsAdding(true);

    // Use selected variant or first available variant
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
      image: variantToAdd.image || displayImage,
    });

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Integrate with wishlist store
  };

  return (
    <>
      <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square overflow-hidden bg-gray-100"
        >
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />

          {/* Badge */}
          {product.badge && (
            <div
              className={cn(
                'absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white',
                product.badge === 'hot' && 'bg-red-500',
                product.badge === 'new' && 'bg-green-500',
                product.badge === 'sale' && 'bg-pink-600'
              )}
            >
              {product.badge === 'hot' && '🔥 Hot'}
              {product.badge === 'new' && '✨ Mới'}
              {product.badge === 'sale' && '💥 Sale'}
            </div>
          )}

          {/* Discount Tag */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Age Recommendation Badge */}
          {product.ageRecommendation && (
            <div
              className={cn(
                'absolute bottom-3 left-3 z-10 items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-md',
                product.ageRecommendation === '0-3' && 'bg-blue-500',
                product.ageRecommendation === '3-6' && 'bg-green-500',
                product.ageRecommendation === '6+' && 'bg-purple-500',
                product.ageRecommendation === 'all' && 'bg-pink-600'
              )}
            >
              {product.ageRecommendation === '0-3' && (
                <>
                  <Baby className="w-3 h-3" />
                  <span>0-3 tuổi</span>
                </>
              )}
              {product.ageRecommendation === '3-6' && (
                <>
                  <Baby className="w-3 h-3" />
                  <span>3-6 tuổi</span>
                </>
              )}
              {product.ageRecommendation === '6+' && (
                <>
                  <Users className="w-3 h-3" />
                  <span>6+ tuổi</span>
                </>
              )}
              {product.ageRecommendation === 'all' && (
                <>
                  <Users className="w-3 h-3" />
                  <span>Mọi lứa tuổi</span>
                </>
              )}
            </div>
          )}

          {/* Quick Actions Overlay (Hover) - Desktop only */}
          <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 z-20">
            {showQuickView && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-gray-900"
                onClick={handleQuickView}
                aria-label="Xem nhanh"
              >
                <Eye className="w-4 h-4 mr-1" />
                Xem nhanh
              </Button>
            )}
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
          {showWishlist && (
            <button
              onClick={handleWishlist}
              className={cn(
                'hidden md:block absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 hover:bg-white transition-all',
                'opacity-0 group-hover:opacity-100',
                isWishlisted && 'text-red-500'
              )}
              aria-label={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-red-500 text-red-500')} />
            </button>
          )}
        </Link>

        {/* Product Info */}
        <div className="p-3 md:p-4 space-y-2">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base min-h-[2.5rem] md:min-h-[3rem] group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>

          {/* Material Info */}
          {product.material && (
            <p className="text-xs text-gray-500 line-clamp-1" title={product.material}>
              {product.material}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  )}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{priceDisplay}</span>
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
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
      </div>

      {/* Quick View Modal - Desktop */}
      {showQuickView && (
        <QuickViewModal
          product={productForModal}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
