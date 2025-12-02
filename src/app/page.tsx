'use client';

import Link from 'next/link';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/data/products';

export default function Home() {
  // Get hot products
  const hotProducts = mockProducts.filter((p) => p.isHot).slice(0, 6);
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 via-pink-400 to-pink-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                The Emotional House
                <br />
                <span className="text-pink-100">Gấu Bông Đầy Cảm Xúc</span>
              </h1>
              <p className="text-xl md:text-2xl text-pink-100 mb-8 leading-relaxed">
                Mỗi chú gấu bông là một câu chuyện, một kỷ niệm đẹp. 
                Tìm người bạn đồng hành hoàn hảo cho bạn và người thân yêu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
                >
                  Khám phá sản phẩm
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-pink-600/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-600/30 transition-colors"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="text-9xl animate-bounce">🐻</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chất lượng cao cấp
              </h3>
              <p className="text-gray-600">
                Nguyên liệu an toàn, mềm mại và bền đẹp
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nhiều kích thước
              </h3>
              <p className="text-gray-600">
                Từ 80cm đến 2m, phù hợp mọi không gian
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-pink-600 fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dịch vụ tận tâm
              </h3>
              <p className="text-gray-600">
                Gói quà đẹp, giao hàng nhanh, hỗ trợ 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Products Section */}
      {hotProducts.length > 0 && (
        <section className="py-16 bg-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sản phẩm Hot 🔥
                </h2>
                <p className="text-gray-600">
                  Những sản phẩm được yêu thích nhất
                </p>
              </div>
              <Link
                href="/products?filter=hot"
                className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Khám phá bộ sưu tập đa dạng của chúng tôi
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tìm người bạn đồng hành hoàn hảo?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Khám phá bộ sưu tập gấu bông đa dạng của chúng tôi
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
