'use client';

/**
 * Combo Products Builder
 * Component để build combo/set sản phẩm với discount
 */

import { useState, useEffect, useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search, Loader2, Trash2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { ProductFormData } from '@/lib/schemas/product';

interface ProductListItem {
  id: string;
  name: string;
  images: string[];
  minPrice: number;
  category: string;
}

interface ComboProductItem {
  productId: string;
  productName: string;
  discount?: number;
}

export default function ComboProductsBuilder() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'comboProducts',
  });

  const currentProductId = watch('id');
  const bundleDiscount = watch('bundleDiscount') || 0;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedProductForIndex, setSelectedProductForIndex] = useState<number | null>(null);

  const comboProducts = watch('comboProducts') || [];

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
          const selectedIds = comboProducts.map((item: ComboProductItem) => item.productId);
          const filtered = (data.products || []).filter(
            (p: ProductListItem) =>
              p.id !== currentProductId && !selectedIds.includes(p.id)
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
    [currentProductId, comboProducts]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedProductForIndex !== null) {
        searchProducts(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts, selectedProductForIndex]);

  // Add new combo item
  const addComboItem = () => {
    append({
      productId: '',
      productName: '',
      discount: undefined,
    });
  };

  // Select product for combo item
  const selectProductForCombo = (index: number, product: ProductListItem) => {
    setValue(`comboProducts.${index}.productId`, product.id);
    setValue(`comboProducts.${index}.productName`, product.name);
    setSearchQuery('');
    setShowResults(false);
    setSelectedProductForIndex(null);
  };

  // Start search for specific combo item
  const startSearchForItem = (index: number) => {
    setSelectedProductForIndex(index);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Combo/Set sản phẩm</Label>
          <p className="text-sm text-gray-500">
            Tạo combo sản phẩm với giảm giá riêng cho từng item
          </p>
        </div>
        <Button type="button" onClick={addComboItem} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bundle Discount */}
      <div className="space-y-2">
        <Label htmlFor="bundleDiscount">Giảm giá chung cho combo (%)</Label>
        <div className="relative max-w-xs">
          <Input
            id="bundleDiscount"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="0"
            value={bundleDiscount || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : undefined;
              setValue('bundleDiscount', value);
            }}
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            %
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Giảm giá này sẽ áp dụng cho toàn bộ combo khi khách mua tất cả items
        </p>
        {errors.bundleDiscount && (
          <p className="text-sm text-red-600">{errors.bundleDiscount.message}</p>
        )}
      </div>

      {/* Combo Items */}
      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const comboItem = watch(`comboProducts.${index}`) as ComboProductItem;
            const isSearchingForThis = selectedProductForIndex === index;

            return (
              <Card key={field.id} className="border-gray-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Sản phẩm #{index + 1}
                      </Label>
                      {fields.length > 0 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    {/* Product Selector */}
                    {comboItem?.productId ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{comboItem.productName}</p>
                          <p className="text-xs text-gray-500 truncate">ID: {comboItem.productId}</p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            setValue(`comboProducts.${index}.productId`, '');
                            setValue(`comboProducts.${index}.productName`, '');
                            setValue(`comboProducts.${index}.discount`, undefined);
                          }}
                          variant="ghost"
                          size="sm"
                          aria-label={`Xóa sản phẩm ${comboItem.productName}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={isSearchingForThis ? searchQuery : ''}
                            onChange={(e) => {
                              if (isSearchingForThis) {
                                setSearchQuery(e.target.value);
                              }
                            }}
                            onFocus={() => startSearchForItem(index)}
                            className="pl-10"
                          />
                          {isSearching && isSearchingForThis && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                          )}
                        </div>

                        {/* Search Results */}
                        {showResults &&
                          isSearchingForThis &&
                          searchResults.length > 0 && (
                            <div className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                              {searchResults.map((product) => (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => selectProductForCombo(index, product)}
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
                      </div>
                    )}

                    {/* Discount for this item */}
                    {comboItem?.productId && (
                      <div className="space-y-2">
                        <Label className="text-xs">Giảm giá riêng cho sản phẩm này (%)</Label>
                        <div className="relative max-w-xs">
                          <Controller
                            name={`comboProducts.${index}.discount`}
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                placeholder="0"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                  field.onChange(value);
                                }}
                                className="pr-12"
                              />
                            )}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            %
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Giảm giá riêng cho item này (tùy chọn)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Chưa có sản phẩm nào trong combo</p>
          <Button type="button" onClick={addComboItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm đầu tiên
          </Button>
        </div>
      )}

      {errors.comboProducts && (
        <p className="text-sm text-red-600">{errors.comboProducts.message}</p>
      )}
    </div>
  );
}

