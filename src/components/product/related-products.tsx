'use client';

/**
 * Related Products Component
 * Hiển thị sản phẩm liên quan dạng Grid
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/schemas/product';
import type { Product as ProductType } from '@/types';

interface RelatedProductsProps {
  product: Product;
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const relatedProductIds = product.relatedProducts || [];

  useEffect(() => {
    async function fetchRelatedProducts() {
      if (relatedProductIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all products and filter by IDs
        // Note: In production, consider creating an API endpoint to fetch by IDs
        const response = await fetch(`/api/products?limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            const filtered = (data.data.products as ProductType[]).filter((p) =>
              relatedProductIds.includes(p.id)
            );
            setRelatedProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [relatedProductIds]);

  if (relatedProductIds.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="aspect-square w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
}

