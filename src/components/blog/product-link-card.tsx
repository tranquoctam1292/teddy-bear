'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/schemas/product';

interface ProductLinkCardProps {
  productId: string;
  displayType?: 'card' | 'spotlight' | 'cta';
  customMessage?: string;
  className?: string;
}

export function ProductLinkCard({
  productId,
  displayType = 'card',
  customMessage,
  className,
}: ProductLinkCardProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        // Try as slug first (most common case)
        const slugResponse = await fetch(`/api/products?slug=${productId}`);
        if (slugResponse.ok) {
          const slugData = await slugResponse.json();
          if (slugData.success && slugData.data?.product) {
            setProduct(slugData.data.product);
            return;
          }
        }
        // If slug fails, productId might be an ID - we'd need a different endpoint
        // For now, we'll just log the error
        console.warn(`Product not found: ${productId}`);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-4 animate-pulse', className)}>
        <div className="h-32 bg-gray-200 rounded mb-3" />
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const imageUrl = product.images?.[0] || product.featuredImage || '/placeholder-product.jpg';
  const price = product.minPrice || product.basePrice || 0;
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

  if (displayType === 'cta') {
    return (
      <div className={cn('bg-pink-50 border-2 border-pink-200 rounded-lg p-4', className)}>
        {customMessage && (
          <p className="text-sm text-pink-800 mb-3 font-medium">{customMessage}</p>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="flex items-center gap-3 group"
        >
          {imageUrl && (
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
              {product.name}
            </h4>
            <p className="text-pink-600 font-bold text-lg">{formattedPrice} ₫</p>
          </div>
          <Button size="sm" className="flex-shrink-0">
            Xem ngay
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    );
  }

  if (displayType === 'spotlight') {
    return (
      <div className={cn('bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-md', className)}>
        {customMessage && (
          <p className="text-sm text-pink-800 mb-4 font-medium">{customMessage}</p>
        )}
        <Link href={`/products/${product.slug}`} className="block group">
          {imageUrl && (
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-white">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          )}
          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
            {product.name}
          </h4>
          <p className="text-pink-600 font-bold text-xl mb-4">{formattedPrice} ₫</p>
          <Button className="w-full" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Mua ngay
          </Button>
        </Link>
      </div>
    );
  }

  // Default: card
  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow', className)}>
      {customMessage && (
        <div className="bg-pink-50 px-4 py-2 border-b border-gray-200">
          <p className="text-sm text-pink-800 font-medium">{customMessage}</p>
        </div>
      )}
      <Link href={`/products/${product.slug}`} className="block group">
        {imageUrl && (
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h4>
          <p className="text-pink-600 font-bold text-lg mb-3">{formattedPrice} ₫</p>
          <Button className="w-full" size="sm" variant="outline">
            Xem chi tiết
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Link>
    </div>
  );
}

