'use client';

/**
 * Related Products Selector
 * Component cho phép search và chọn sản phẩm liên quan
 */

import { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { ProductFormData } from '@/lib/schemas/product';
import type { Product } from '@/lib/schemas/product';

interface ProductListItem {
  id: string;
  name: string;
  images: string[];
  minPrice: number;
  category: string;
}

export default function RelatedProductsSelector() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const relatedProducts = watch('relatedProducts') || [];
  const currentProductId = watch('id'); // Để exclude product hiện tại

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductListItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Fetch selected products details
  useEffect(() => {
    async function fetchSelectedProducts() {
      if (relatedProducts.length === 0) {
        setSelectedProducts([]);
        return;
      }

      try {
        // Fetch all products and filter by IDs
        // Note: In production, consider creating an API endpoint to fetch by IDs
        const response = await fetch(`/api/admin/products?limit=1000`);
        if (response.ok) {
          const data = await response.json();
          const filtered = (data.products || []).filter((p: ProductListItem) =>
            relatedProducts.includes(p.id)
          );
          setSelectedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching selected products:', error);
        // Set empty array on error to prevent UI issues
        setSelectedProducts([]);
      }
    }

    fetchSelectedProducts();
  }, [relatedProducts]);

  // Search products
  const searchProducts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/admin/products?search=${encodeURIComponent(query)}&limit=10`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter out current product and already selected products
          const filtered = (data.products || []).filter(
            (p: ProductListItem) =>
              p.id !== currentProductId && !relatedProducts.includes(p.id)
          );
          setSearchResults(filtered);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [currentProductId, relatedProducts]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Add product to related
  const addProduct = (product: ProductListItem) => {
    if (!relatedProducts.includes(product.id)) {
      const newRelated = [...relatedProducts, product.id];
      setValue('relatedProducts', newRelated);
      setSelectedProducts([...selectedProducts, product]);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  // Remove product from related
  const removeProduct = (productId: string) => {
    const newRelated = relatedProducts.filter((id) => id !== productId);
    setValue('relatedProducts', newRelated);
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="space-y-3">
      <Label>Sản phẩm liên quan</Label>
      <p className="text-sm text-gray-500">
        Chọn các sản phẩm liên quan để hiển thị trên trang chi tiết
      </p>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
          className="pl-10"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
          {searchResults.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addProduct(product)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              {product.images && product.images.length > 0 && (
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Đã chọn ({selectedProducts.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <Badge
                key={product.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1.5"
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative w-6 h-6 rounded overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm">{product.name}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  className="ml-1 hover:text-red-600"
                  aria-label={`Xóa ${product.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {errors.relatedProducts && (
        <p className="text-sm text-red-600">{errors.relatedProducts.message}</p>
      )}
    </div>
  );
}

