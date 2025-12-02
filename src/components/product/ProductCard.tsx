'use client';

// Thẻ sản phẩm ngoài danh sách với nút "Mua ngay" trên mobile
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { formatCurrency, formatPriceRange } from '@/lib/utils';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const priceDisplay =
    product.maxPrice && product.maxPrice > product.basePrice
      ? formatPriceRange(product.basePrice, product.maxPrice)
      : formatCurrency(product.basePrice);

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants.length === 0) return;

    setIsAdding(true);
    
    // Get first available variant
    const firstVariant = product.variants[0];
    
    addItem({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      size: firstVariant.size,
      price: firstVariant.price,
      quantity: 1,
      image: firstVariant.image || product.images[0] || '',
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
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
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
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <p className="text-xs text-pink-600 font-medium uppercase">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
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
            {product.variants.length > 1 && (
              <span className="text-xs text-gray-500">
                ({product.variants.length} kích thước)
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile Quick Buy Button - Sticky on mobile */}
      <div className="lg:hidden border-t border-gray-100 p-3 bg-white">
        <button
          onClick={handleQuickBuy}
          disabled={isAdding || product.variants.length === 0}
          className="w-full bg-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {isAdding ? 'Đang thêm...' : 'Mua ngay'}
        </button>
      </div>
    </div>
  );
}
