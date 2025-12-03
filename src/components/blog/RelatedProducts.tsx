'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types';

interface RelatedProductsProps {
  tags?: string[];
  category?: string;
  excludeProductId?: string;
  limit?: number;
}

export default function RelatedProducts({
  tags = [],
  category,
  excludeProductId,
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (category) {
          params.append('category', category);
        }
        if (tags.length > 0) {
          params.append('tags', tags.join(','));
        }
        params.append('limit', limit.toString());
        if (excludeProductId) {
          params.append('exclude', excludeProductId);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.products) {
            setProducts(data.data.products.slice(0, limit));
          }
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [tags, category, excludeProductId, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center text-gray-600">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200 mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sản phẩm gợi ý
        </h2>
        <p className="text-gray-600">
          Những sản phẩm có thể bạn sẽ thích
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}


