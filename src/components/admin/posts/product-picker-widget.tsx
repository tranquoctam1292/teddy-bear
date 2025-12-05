'use client';

/**
 * Product Picker Widget
 * 
 * Cho phép search và chọn sản phẩm để liên kết vào bài viết
 * Cập nhật field linkedProducts trong Form Context
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Package, Plus } from 'lucide-react';
import type { LinkedProduct } from '@/lib/schemas/post';
import type { PostFormData } from '@/lib/schemas/post';
import { searchMockProducts, getMockProductsByIds, type MockProduct } from '@/lib/data/mock-products';

// Use MockProduct type from mock-products
type ProductListItem = MockProduct;

interface ProductPickerWidgetProps {
  className?: string;
}

export default function ProductPickerWidget({ className }: ProductPickerWidgetProps) {
  const { watch, setValue } = useFormContext<PostFormData>();
  const linkedProducts = watch('linkedProducts') || [];

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Selected products details (for display)
  const [selectedProductsDetails, setSelectedProductsDetails] = useState<ProductListItem[]>([]);

  // Fetch selected products details (using mock data)
  useEffect(() => {
    if (linkedProducts.length === 0) {
      setSelectedProductsDetails([]);
      return;
    }

    const productIds = linkedProducts.map((lp) => lp.productId);
    const products = getMockProductsByIds(productIds);
    setSelectedProductsDetails(products);
  }, [linkedProducts]);

  // Search products with debounce (using mock data)
  const searchProducts = useCallback((query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = searchMockProducts(query, 20);
      // Filter out already selected products
      const selectedIds = linkedProducts.map((lp) => lp.productId);
      const filtered = results.filter((p) => !selectedIds.includes(p.id));
      
      setSearchResults(filtered);
      setShowResults(true);
      setIsSearching(false);
    }, 300); // Simulate network delay
  }, [linkedProducts]);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchProducts]);

  // Add product to linked products
  const handleAddProduct = (product: ProductListItem) => {
    const newLinkedProduct: LinkedProduct = {
      productId: product.id,
      position: 'inline',
      displayType: 'card',
    };

    const updated = [...linkedProducts, newLinkedProduct];
    setValue('linkedProducts', updated, { shouldDirty: true });
    setSearchQuery('');
    setShowResults(false);
  };

  // Remove product from linked products
  const handleRemoveProduct = (productId: string) => {
    const updated = linkedProducts.filter((lp) => lp.productId !== productId);
    setValue('linkedProducts', updated, { shouldDirty: true });
  };

  // Update linked product settings
  const handleUpdateProduct = (productId: string, field: 'position' | 'displayType', value: string) => {
    const updated = linkedProducts.map((lp) =>
      lp.productId === productId ? { ...lp, [field]: value } : lp
    );
    setValue('linkedProducts', updated, { shouldDirty: true });
  };

  // Update custom message
  const handleUpdateMessage = (productId: string, message: string) => {
    const updated = linkedProducts.map((lp) =>
      lp.productId === productId ? { ...lp, customMessage: message } : lp
    );
    setValue('linkedProducts', updated, { shouldDirty: true });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Package className="w-4 h-4" />
          Sản phẩm liên kết
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            className="pl-8 text-sm"
          />

          {/* Search Results Dropdown */}
          {showResults && (searchResults.length > 0 || isSearching) && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-hidden">
              <ScrollArea className="max-h-60">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Không tìm thấy sản phẩm
                  </div>
                ) : (
                  <div className="py-1">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleAddProduct(product)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {product.name}
                          </div>
                          {product.minPrice && (
                            <div className="text-xs text-gray-500">
                              {product.minPrice.toLocaleString('vi-VN')} ₫
                            </div>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-blue-600" />
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Selected Products List */}
        {selectedProductsDetails.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-700">
              Đã chọn ({selectedProductsDetails.length})
            </div>
            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {selectedProductsDetails.map((product) => {
                  const linkedProduct = linkedProducts.find(
                    (lp) => lp.productId === product.id
                  );
                  if (!linkedProduct) return null;

                  return (
                    <div
                      key={product.id}
                      className="p-3 border rounded-lg bg-gray-50 space-y-2"
                    >
                      {/* Product Info */}
                      <div className="flex items-start gap-3">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {product.name}
                          </div>
                          {product.minPrice && (
                            <div className="text-xs text-gray-500">
                              {product.minPrice.toLocaleString('vi-VN')} ₫
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                          className="flex-shrink-0"
                          aria-label="Xóa sản phẩm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Settings */}
                      <div className="space-y-2 pt-2 border-t">
                        {/* Position */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Vị trí hiển thị
                          </label>
                          <Select
                            value={linkedProduct.position}
                            onValueChange={(value) =>
                              handleUpdateProduct(
                                product.id,
                                'position',
                                value
                              )
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inline">Trong nội dung</SelectItem>
                              <SelectItem value="sidebar">Sidebar</SelectItem>
                              <SelectItem value="bottom">Cuối bài</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Display Type */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Kiểu hiển thị
                          </label>
                          <Select
                            value={linkedProduct.displayType}
                            onValueChange={(value) =>
                              handleUpdateProduct(
                                product.id,
                                'displayType',
                                value
                              )
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="spotlight">Spotlight</SelectItem>
                              <SelectItem value="cta">Call-to-Action</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Custom Message */}
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">
                            Tin nhắn tùy chỉnh (tùy chọn)
                          </label>
                          <Input
                            type="text"
                            placeholder="VD: Sản phẩm được đề xuất"
                            value={linkedProduct.customMessage || ''}
                            onChange={(e) =>
                              handleUpdateMessage(product.id, e.target.value)
                            }
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Empty State */}
        {selectedProductsDetails.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500">
            <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Chưa có sản phẩm nào được liên kết</p>
            <p className="text-xs mt-1">Tìm kiếm và thêm sản phẩm ở trên</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

