// Product Card Component (Simple version for homepage)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';

interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
  rating?: number;
  stock?: number;
  description?: string;
  category?: string;
  tags?: string[];
  variants?: Array<{
    id: string;
    size: string;
    price: number;
    stock: number;
    image?: string;
  }>;
  basePrice?: number;
  maxPrice?: number;
}

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showPrice = true,
  showRating = true,
  showAddToCart = true,
}: ProductCardProps) {
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <>
      <Card
        className="group overflow-hidden transition-all hover:shadow-lg"
      >
        <Link href={`/products/${product.slug}`} className="block">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl">
                🧸
              </div>
            )}

            {/* Discount Badge - Hidden on mobile */}
            {hasDiscount && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                -{Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-3 md:p-4">
          {/* Product Name */}
          <h3 className="font-semibold line-clamp-2 text-sm md:text-base group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {showRating && product.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < product.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.rating})
              </span>
            </div>
          )}

          {/* Price */}
          {showPrice && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-primary">
                {displayPrice.toLocaleString('vi-VN')}đ
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

