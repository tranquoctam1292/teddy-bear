'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/schemas/product';
import type { LinkedProduct } from '@/lib/schemas/post';

interface GiftGuideData {
  occasions?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  deliveryOptions?: string[];
}

interface GiftGuideViewProps {
  templateData?: {
    giftGuide?: GiftGuideData;
  };
  linkedProducts?: LinkedProduct[];
  className?: string;
}

export function GiftGuideView({
  templateData,
  linkedProducts = [],
  className,
}: GiftGuideViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const giftGuideData = templateData?.giftGuide || {};
  const occasions = giftGuideData.occasions || [];
  const priceRange = giftGuideData.priceRange || {};
  const deliveryOptions = giftGuideData.deliveryOptions || [];

  // Fetch products from linkedProducts
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const productPromises = linkedProducts.map(async (linkedProduct) => {
          try {
            // Try as slug first (most common case)
            const slugResponse = await fetch(`/api/products?slug=${linkedProduct.productId}`);
            if (slugResponse.ok) {
              const slugData = await slugResponse.json();
              if (slugData.success && slugData.data?.product) {
                return { product: slugData.data.product, linkedProduct };
              }
            }
            // If slug fails, productId might be an ID - we'd need a different endpoint
            return null;
          } catch (error) {
            console.error(`Error fetching product ${linkedProduct.productId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(productPromises);
        const fetchedProducts = results
          .filter((r): r is { product: Product; linkedProduct: LinkedProduct } => r !== null)
          .map((r) => r.product);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (linkedProducts.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [linkedProducts]);

  if (loading) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-8 animate-pulse', className)}>
        <div className="h-32 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Occasion Banner */}
      {occasions.length > 0 && (
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 text-white text-center shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8" />
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Gợi ý Quà Tặng {occasions.join(' & ')}
          </h2>
          {priceRange.min && priceRange.max && (
            <p className="text-pink-100 text-lg">
              Khoảng giá: {new Intl.NumberFormat('vi-VN').format(priceRange.min)} ₫ -{' '}
              {new Intl.NumberFormat('vi-VN').format(priceRange.max)} ₫
            </p>
          )}
          {deliveryOptions.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {deliveryOptions.map((option, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm"
                >
                  ✓ {option}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Sản phẩm gợi ý ({products.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const linkedProduct = linkedProducts.find(
                (lp) => lp.productId === product.id || lp.productId === product.slug
              );
              const imageUrl = product.images?.[0] || product.featuredImage || '/placeholder-product.jpg';
              const price = product.minPrice || product.basePrice || 0;
              const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Custom Message Badge */}
                      {linkedProduct?.customMessage && (
                        <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {linkedProduct.customMessage}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-pink-600 font-bold text-lg mb-4">{formattedPrice} ₫</p>
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Xem ngay
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có sản phẩm gợi ý</p>
        </div>
      )}
    </div>
  );
}

