'use client';

// Trang danh sách sản phẩm - Liệt kê + Bộ lọc (Filter)
import { useState, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { type FilterState } from '@/components/filter/FilterSidebar';
import { mockProducts, filterProducts } from '@/lib/data/products';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    categories: [],
    sizes: [],
    occasions: [],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Apply filters
  const filteredProducts = useMemo(() => {
    return filterProducts(mockProducts, filters);
  }, [filters]);

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tìm thấy {filteredProducts.length} sản phẩm
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Lọc</span>
                {activeFilterCount > 0 && (
                  <span className="bg-white text-pink-600 text-xs font-bold rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              onApplyFilters={(newFilters) => {
                setFilters(newFilters);
              }}
            />
          </aside>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={(newFilters) => {
              setFilters(newFilters);
              setIsFilterOpen(false);
            }}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [],
                      categories: [],
                      sizes: [],
                      occasions: [],
                    });
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
