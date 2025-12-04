'use client';

// Trang chi tiết sản phẩm (Dynamic Route)
import { useState, useCallback, use, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Ruler, Star, Check } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import SizeGuideModal from '@/components/product/SizeGuideModal.lazy';
import MobileBuyButton from '@/components/product/MobileBuyButton';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import type { Variant, Product } from '@/types';
import JsonLd from '@/components/seo/JsonLd';
import { generateProductSchema } from '@/lib/seo/schemas';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import RelatedPosts from '@/components/product/RelatedPosts';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  // Fetch product from API
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        if (data.success && data.data?.product) {
          setProduct(data.data.product);
          setSelectedVariant(data.data.product.variants[0] || null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  const handleVariantChange = useCallback((variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'Sản phẩm bạn đang tìm kiếm không tồn tại.'}
          </p>
          <Link
            href="/products"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image || product.images[0],
    });
  };

  const currentPrice = selectedVariant?.price || product.basePrice;

  // Generate JSON-LD schema
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn');
  const productSchema = product ? generateProductSchema({
    name: product.name,
    description: product.description,
    images: product.images,
    sku: (selectedVariant as any)?.sku,
    variants: product.variants,
    rating: (product as any).rating || 0,
    reviewCount: (product as any).reviewCount || 0,
  }, baseUrl) : null;

  // Get category label for breadcrumb
  const categoryLabels: Record<string, string> = {
    teddy: 'Gấu Teddy',
    capybara: 'Gấu Capybara',
    lotso: 'Gấu Lotso',
    kuromi: 'Gấu Kuromi',
    cartoon: 'Gấu Hoạt Hình',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20 lg:pb-8">
      {/* JSON-LD Structured Data */}
      {productSchema && <JsonLd data={productSchema} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Sản phẩm', href: '/products' },
            { label: categoryLabels[product.category] || product.category, href: `/products?category=${product.category}` },
            { label: product.name },
          ]}
          className="mb-6"
        />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              selectedVariant={selectedVariant || undefined}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category & Tags */}
            <div>
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-3">
                {product.category}
              </span>
              {product.isHot && (
                <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Hot
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.8/5 - 128 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-pink-600">
                {formatCurrency(currentPrice)}
              </span>
              {product.maxPrice && product.maxPrice > product.basePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatCurrency(product.maxPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phù hợp cho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cream-100 text-brown-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Chọn kích thước</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  <Ruler className="w-4 h-4" />
                  Hướng dẫn chọn size
                </button>
              </div>
              <VariantSelector
                product={product}
                selectedVariantId={selectedVariant?.id}
                onVariantChange={handleVariantChange}
              />
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Số lượng</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 min-w-[4rem] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          selectedVariant?.stock || 1,
                          quantity + 1
                        )
                      )
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-gray-600">
                    Còn {selectedVariant.stock} sản phẩm
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons - Hidden on mobile (using MobileBuyButton instead) */}
            <div className="hidden lg:block space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  Yêu thích
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-pink-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Đặc điểm nổi bật</h3>
              <div className="space-y-2">
                {[
                  'Chất liệu cao cấp, mềm mại',
                  'An toàn cho trẻ em',
                  'Dễ dàng vệ sinh',
                  'Bảo hành 6 tháng',
                  'Giao hàng toàn quốc',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        variants={product.variants}
      />

      {/* Mobile Buy Button - Sticky bottom */}
      <MobileBuyButton
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
      />

      {/* Related Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RelatedPosts
          productName={product.name}
          category={product.category}
        />
      </div>
    </div>
  );
}
