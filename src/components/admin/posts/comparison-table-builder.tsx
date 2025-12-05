'use client';

/**
 * Comparison Table Builder Component
 * 
 * Xây dựng bảng so sánh sản phẩm
 * Lưu dữ liệu vào field comparisonTable
 */

import { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Plus, Search, Package } from 'lucide-react';
import Image from 'next/image';
import type { PostFormData } from '@/lib/schemas/post';
import type { ComparisonTable } from '@/lib/schemas/post';
import { searchMockProducts, getMockProductsByIds, type MockProduct } from '@/lib/data/mock-products';

// Use MockProduct type from mock-products
type ProductListItem = MockProduct;

interface ComparisonFeature {
  name: string;
  values: Record<string, string | number | boolean>;
}

export default function ComparisonTableBuilder() {
  const { watch, setValue } = useFormContext<PostFormData>();
  const comparisonTable: ComparisonTable | undefined = watch('comparisonTable');

  // Product selection state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useState<NodeJS.Timeout | null>(null);

  // Selected products details
  const [selectedProductsDetails, setSelectedProductsDetails] = useState<ProductListItem[]>([]);

  // Features state
  const [features, setFeatures] = useState<ComparisonFeature[]>(
    comparisonTable?.features || []
  );

  // Fetch selected products details (using mock data)
  useEffect(() => {
    const productIds = comparisonTable?.products || [];
    if (productIds.length === 0) {
      setSelectedProductsDetails([]);
      return;
    }

    const products = getMockProductsByIds(productIds);
    setSelectedProductsDetails(products);
  }, [comparisonTable?.products]);

  // Search products (using mock data)
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
      const currentProductIds = comparisonTable?.products || [];
      const filtered = results.filter((p) => !currentProductIds.includes(p.id));
      
      setSearchResults(filtered);
      setShowResults(true);
      setIsSearching(false);
    }, 300); // Simulate network delay
  }, [comparisonTable?.products]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  // Add product to comparison
  const handleAddProduct = (product: ProductListItem) => {
    const currentProducts = comparisonTable?.products || [];
    if (currentProducts.length >= 5) {
      alert('Tối đa 5 sản phẩm để so sánh');
      return;
    }

    const newProducts = [...currentProducts, product.id];
    updateComparisonTable({ products: newProducts });

    // Initialize feature values for new product
    const newFeatures = features.map((feature) => ({
      ...feature,
      values: {
        ...feature.values,
        [product.id]: '',
      },
    }));
    setFeatures(newFeatures);
    updateComparisonTable({ features: newFeatures });

    setSearchQuery('');
    setShowResults(false);
  };

  // Remove product from comparison
  const handleRemoveProduct = (productId: string) => {
    const currentProducts = comparisonTable?.products || [];
    const newProducts = currentProducts.filter((id) => id !== productId);

    // Remove product from feature values
    const newFeatures = features.map((feature) => {
      const { [productId]: removed, ...rest } = feature.values;
      return {
        ...feature,
        values: rest,
      };
    });

    setFeatures(newFeatures);
    updateComparisonTable({
      products: newProducts,
      features: newFeatures,
    });
  };

  // Add feature row
  const handleAddFeature = () => {
    const productIds = comparisonTable?.products || [];
    const newFeature: ComparisonFeature = {
      name: '',
      values: productIds.reduce((acc, id) => ({ ...acc, [id]: '' }), {}),
    };
    const newFeatures = [...features, newFeature];
    setFeatures(newFeatures);
    updateComparisonTable({ features: newFeatures });
  };

  // Remove feature row
  const handleRemoveFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    updateComparisonTable({ features: newFeatures });
  };

  // Update feature name
  const handleUpdateFeatureName = (index: number, name: string) => {
    const newFeatures = [...features];
    newFeatures[index].name = name;
    setFeatures(newFeatures);
    updateComparisonTable({ features: newFeatures });
  };

  // Update feature value
  const handleUpdateFeatureValue = (
    featureIndex: number,
    productId: string,
    value: string
  ) => {
    const newFeatures = [...features];
    newFeatures[featureIndex].values[productId] = value;
    setFeatures(newFeatures);
    updateComparisonTable({ features: newFeatures });
  };

  // Update comparison table
  const updateComparisonTable = (updates: Partial<ComparisonTable>) => {
    const current = comparisonTable || {
      products: [],
      features: [],
    };
    const newComparisonTable: ComparisonTable = {
      ...current,
      ...updates,
    };
    setValue('comparisonTable', newComparisonTable, { shouldDirty: true });
  };

  const productIds = comparisonTable?.products || [];

  return (
    <div className="space-y-4">
      {/* Product Selection */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Sản phẩm so sánh <span className="text-gray-500 text-xs">(Tối đa 5)</span>
        </Label>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm để thêm vào so sánh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            className="pl-8 text-sm"
            disabled={productIds.length >= 5}
          />

          {/* Search Results */}
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

        {/* Selected Products */}
        {selectedProductsDetails.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedProductsDetails.map((product) => (
              <Card key={product.id} className="p-2">
                <CardContent className="p-0 flex items-center gap-2">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={32}
                      height={32}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="h-6 w-6 p-0"
                    aria-label="Xóa sản phẩm"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {productIds.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Chưa có sản phẩm nào. Tìm kiếm và thêm ít nhất 2 sản phẩm để so sánh.
          </p>
        )}
      </div>

      {/* Features Table */}
      {productIds.length >= 2 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">
              Tính năng so sánh
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              className="text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Thêm tính năng
            </Button>
          </div>

          {features.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500 border border-dashed rounded-lg">
              <p>Chưa có tính năng nào</p>
              <p className="text-xs mt-1">Nhấn "Thêm tính năng" để bắt đầu</p>
            </div>
          ) : (
            <div className="space-y-2">
              {features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="p-3 border rounded-lg bg-gray-50 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Tên tính năng (VD: Kích thước, Giá, Chất liệu...)"
                      value={feature.name}
                      onChange={(e) =>
                        handleUpdateFeatureName(featureIndex, e.target.value)
                      }
                      className="flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(featureIndex)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="Xóa tính năng"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Feature Values for each product */}
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProductsDetails.map((product) => (
                      <div key={product.id} className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          {product.name}
                        </Label>
                        <Input
                          type="text"
                          placeholder="Giá trị..."
                          value={feature.values[product.id] || ''}
                          onChange={(e) =>
                            handleUpdateFeatureValue(
                              featureIndex,
                              product.id,
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>💡 Lưu ý:</strong> Cần ít nhất 2 sản phẩm để tạo bảng so sánh. Bảng so sánh sẽ
          được hiển thị tự động trong bài viết khi publish.
        </p>
      </div>
    </div>
  );
}

