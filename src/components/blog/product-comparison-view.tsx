'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComparisonTable } from '@/lib/schemas/post';
import type { Product } from '@/lib/schemas/product';

interface ProductComparisonViewProps {
  comparisonData: ComparisonTable;
  className?: string;
}

interface ProductWithDetails extends Product {
  comparisonValue?: string | number | boolean;
}

export function ProductComparisonView({
  comparisonData,
  className,
}: ProductComparisonViewProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const productPromises = comparisonData.products.map(async (productId) => {
          try {
            // Try as slug first (most common case)
            const slugResponse = await fetch(`/api/products?slug=${productId}`);
            if (slugResponse.ok) {
              const slugData = await slugResponse.json();
              if (slugData.success && slugData.data?.product) {
                return slugData.data.product;
              }
            }
            // If slug fails, productId might be an ID - we'd need a different endpoint
            return null;
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (comparisonData.products.length > 0) {
      fetchProducts();
    }
  }, [comparisonData.products]);

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const showImages = comparisonData.displayOptions?.showImages !== false;
  const showPrices = comparisonData.displayOptions?.showPrices !== false;

  if (loading) {
    return (
      <div className={cn('bg-gray-50 rounded-lg p-8 animate-pulse', className)}>
        <div className="h-8 bg-gray-200 rounded mb-6 w-1/3" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Mobile: Card Stack View
  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">So sánh sản phẩm</h3>
        {products.map((product, productIndex) => {
          const imageUrl = product.images?.[0] || product.featuredImage || '/placeholder-product.jpg';
          const price = product.minPrice || product.basePrice || 0;
          const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

          return (
            <div
              key={product.id || productIndex}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Product Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  {showImages && imageUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                    {showPrices && (
                      <p className="text-pink-600 font-bold text-lg">{formattedPrice} ₫</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-4 space-y-3">
                {comparisonData.features.map((feature, featureIndex) => {
                  const value = feature.values[product.id || comparisonData.products[productIndex]];
                  const isLongContent = typeof value === 'string' && value.length > 100;
                  const isExpanded = expandedRows.has(featureIndex);

                  return (
                    <div key={featureIndex} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="text-sm font-semibold text-gray-700 mb-1">
                        {feature.name}
                      </div>
                      <div className="text-gray-900">
                        {isLongContent && !isExpanded ? (
                          <>
                            <span>{String(value).substring(0, 100)}...</span>
                            <button
                              onClick={() => toggleRow(featureIndex)}
                              className="text-pink-600 hover:text-pink-700 ml-2 text-sm font-medium"
                            >
                              Xem thêm
                              <ChevronDown className="w-4 h-4 inline ml-1" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{String(value)}</span>
                            {isLongContent && (
                              <button
                                onClick={() => toggleRow(featureIndex)}
                                className="text-pink-600 hover:text-pink-700 ml-2 text-sm font-medium"
                              >
                                Thu gọn
                                <ChevronUp className="w-4 h-4 inline ml-1" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 flex gap-2">
                <Button asChild variant="outline" className="flex-1" size="sm">
                  <Link href={`/products/${product.slug}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Link>
                </Button>
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Mua ngay
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: Table View
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                Tính năng
              </th>
              {products.map((product, index) => {
                const imageUrl = product.images?.[0] || product.featuredImage || '/placeholder-product.jpg';
                const price = product.minPrice || product.basePrice || 0;
                const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);

                return (
                  <th
                    key={product.id || index}
                    className="px-4 py-3 text-center min-w-[200px]"
                  >
                    <div className="space-y-2">
                      {showImages && imageUrl && (
                        <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-2">
                        {product.name}
                      </h4>
                      {showPrices && (
                        <p className="text-pink-600 font-bold">{formattedPrice} ₫</p>
                      )}
                      <div className="flex gap-2 justify-center">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/products/${product.slug}`}>
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Chi tiết
                          </Link>
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Mua
                        </Button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonData.features.map((feature, featureIndex) => {
              const isExpanded = expandedRows.has(featureIndex);
              const hasLongContent = comparisonData.features.some(
                (f) => Object.values(f.values).some((v) => typeof v === 'string' && v.length > 50)
              );

              return (
                <tr
                  key={featureIndex}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700 sticky left-0 bg-white z-10">
                    {feature.name}
                  </td>
                  {products.map((product, productIndex) => {
                    const value = feature.values[product.id || comparisonData.products[productIndex]];
                    const displayValue = String(value);
                    const isLong = displayValue.length > 50;

                    return (
                      <td
                        key={product.id || productIndex}
                        className="px-4 py-3 text-center text-sm text-gray-900"
                      >
                        {isLong && !isExpanded ? (
                          <div>
                            <span>{displayValue.substring(0, 50)}...</span>
                            <button
                              onClick={() => toggleRow(featureIndex)}
                              className="text-pink-600 hover:text-pink-700 ml-2 text-xs"
                            >
                              Xem thêm
                            </button>
                          </div>
                        ) : (
                          displayValue
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

