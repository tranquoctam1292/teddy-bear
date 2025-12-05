'use client';

/**
 * Combo Products Component
 * Hiển thị combo products với discount và nút "Thêm tất cả vào giỏ"
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useCartStore } from '@/store/useCartStore';
import { useToast } from '@/hooks/use-toast';
import type { Product, ComboProductItem } from '@/lib/schemas/product';

interface ComboProductsProps {
  product: Product;
}

interface ComboProductWithDetails extends ComboProductItem {
  product?: Product;
  variantId?: string;
}

export default function ComboProducts({ product }: ComboProductsProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [comboProducts, setComboProducts] = useState<ComboProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const comboItems = product.comboProducts || [];
  const bundleDiscount = product.bundleDiscount || 0;

  // Fetch combo products details
  useEffect(() => {
    async function fetchComboProducts() {
      if (comboItems.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productsData: ComboProductWithDetails[] = [];

        // Fetch all products and filter by IDs
        // Note: In production, consider creating an API endpoint to fetch by IDs
        const allProductsResponse = await fetch(`/api/products?limit=1000`);
        if (allProductsResponse.ok) {
          const allProductsData = await allProductsResponse.json();
          if (allProductsData.success && allProductsData.data?.products) {
            const allProducts = allProductsData.data.products as Product[];

            for (const item of comboItems) {
              const comboProduct = allProducts.find((p) => p.id === item.productId);
              if (comboProduct) {
                productsData.push({
                  ...item,
                  product: comboProduct,
                  variantId: comboProduct.variants[0]?.id,
                });
              } else {
                // Fallback: use productName if not found
                productsData.push(item);
              }
            }
          } else {
            // Fallback: use productName if fetch fails
            comboItems.forEach((item) => productsData.push(item));
          }
        } else {
          // Fallback: use productName if fetch fails
          comboItems.forEach((item) => productsData.push(item));
        }

        setComboProducts(productsData);
      } catch (error) {
        console.error('Error fetching combo products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchComboProducts();
  }, [comboItems]);

  // Calculate total savings
  const calculateSavings = (): number => {
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;

    comboProducts.forEach((item) => {
      if (item.product) {
        const variant = item.product.variants[0];
        if (variant) {
          const originalPrice = variant.price;
          const itemDiscount = item.discount || 0;
          const discountedPrice = originalPrice * (1 - itemDiscount / 100);
          totalOriginalPrice += originalPrice;
          totalDiscountedPrice += discountedPrice;
        }
      }
    });

    // Apply bundle discount
    const finalPrice = totalDiscountedPrice * (1 - bundleDiscount / 100);
    return totalOriginalPrice - finalPrice;
  };

  // Handle add all to cart
  const handleAddAllToCart = () => {
    let addedCount = 0;
    let failedCount = 0;

    comboProducts.forEach((item) => {
      if (item.product && item.variantId) {
        const variant = item.product.variants.find((v) => v.id === item.variantId);
        if (variant && variant.stock > 0) {
          addItem({
            productId: item.productId,
            variantId: item.variantId,
            name: item.productName,
            size: variant.size,
            price: variant.price,
            quantity: 1,
            image: variant.image || item.product.images[0],
          });
          addedCount++;
        } else {
          failedCount++;
        }
      } else {
        failedCount++;
      }
    });

    if (addedCount > 0) {
      toast({
        title: 'Đã thêm vào giỏ hàng',
        description: `Đã thêm ${addedCount} sản phẩm vào giỏ hàng${bundleDiscount > 0 ? ` (Tiết kiệm ${bundleDiscount}%)` : ''}`,
      });
    }

    if (failedCount > 0) {
      toast({
        title: 'Cảnh báo',
        description: `${failedCount} sản phẩm không thể thêm vào giỏ hàng`,
        variant: 'destructive',
      });
    }
  };

  if (comboItems.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-600">Đang tải combo sản phẩm...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const savings = calculateSavings();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-600" />
            <CardTitle>Combo sản phẩm</CardTitle>
          </div>
          {bundleDiscount > 0 && (
            <Badge className="bg-pink-600 text-white">
              <Percent className="w-3 h-3 mr-1" />
              Giảm {bundleDiscount}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Combo Items List */}
        <div className="space-y-3">
          {comboProducts.map((item, index) => {
            const variant = item.product?.variants[0];
            const itemPrice = variant?.price || 0;
            const itemDiscount = item.discount || 0;
            const discountedPrice = itemPrice * (1 - itemDiscount / 100);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {itemDiscount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(itemPrice)}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-pink-600">
                      {formatCurrency(discountedPrice)}
                    </span>
                    {itemDiscount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        -{itemDiscount}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Info */}
        {savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-green-700">
              Tiết kiệm: {formatCurrency(savings)}
            </p>
            {bundleDiscount > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Bao gồm giảm giá combo {bundleDiscount}%
              </p>
            )}
          </div>
        )}

        {/* Add All Button */}
        <Button
          onClick={handleAddAllToCart}
          className="w-full bg-pink-600 hover:bg-pink-700"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm tất cả vào giỏ hàng
        </Button>
      </CardContent>
    </Card>
  );
}

