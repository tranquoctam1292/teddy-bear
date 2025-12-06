'use client';

// Trang danh sách sản phẩm - Liệt kê + Bộ lọc (Filter)
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { type FilterState } from '@/components/filter/FilterSidebar';
import type { ProductListItem } from '@/lib/schemas/product';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsResponse {
  success: boolean;
  data?: {
    products: ProductListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Parse filters from URL query params
  const filters = useMemo<FilterState>(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const tags = searchParams.get('tags');

    // Build priceRange array from minPrice/maxPrice
    const priceRange: string[] = [];
    if (minPrice || maxPrice) {
      const min = minPrice || '0';
      const max = maxPrice || '10000000';
      priceRange.push(`${min}-${max}`);
    }

    return {
      priceRange,
      categories: category ? [category] : [],
      sizes: size ? [size] : [],
      occasions: tags ? tags.split(',').filter(Boolean) : [],
    };
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query params directly from searchParams (not from filters to avoid dependency issues)
        const params = new URLSearchParams();

        // Category filter
        const category = searchParams.get('category');
        if (category) {
          params.set('category', category);
        }

        // Price range filter
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        if (minPrice) {
          params.set('minPrice', minPrice);
        }
        if (maxPrice) {
          params.set('maxPrice', maxPrice);
        }

        // Size filter
        const size = searchParams.get('size');
        if (size) {
          params.set('size', size);
        }

        // Tags/occasions filter
        const tags = searchParams.get('tags');
        if (tags) {
          params.set('tags', tags);
        }

        // Pagination
        const page = searchParams.get('page') || '1';
        params.set('page', page);
        params.set('limit', '12');

        // Sorting
        const sort = searchParams.get('sort') || 'newest';
        params.set('sort', sort);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await response.json();

        if (!response.ok || !data.success) {
          // Handle API error response format
          const errorMessage =
            data.error ||
            (data as any).details?.message ||
            'Không thể tải danh sách sản phẩm';
          throw new Error(errorMessage);
        }

        if (data.data) {
          setProducts(data.data.products);
          setPagination(data.data.pagination);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải sản phẩm');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // Only depend on searchParams, not filters

  // Inject JSON-LD Schema.org for Product Collection
  useEffect(() => {
    // Only inject schema if we have products
    if (products.length === 0) {
      // Remove existing schema if no products
      const existingScript = document.getElementById('product-list-schema');
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    // Get base URL for absolute URLs in schema
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Build current page URL (without query params for canonical)
    const currentUrl = `${baseUrl}/products`;

    // Generate Schema.org JSON-LD for CollectionPage
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Sản phẩm - Gấu Bông Cao Cấp',
      description: 'Danh sách sản phẩm gấu bông cao cấp tại The Emotional House',
      url: currentUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: pagination.total,
        itemListElement: products.map((product, index) => {
          const productUrl = `${baseUrl}/products/${product.slug}`;
          const productImage = product.images?.[0] || '';
          const absoluteImageUrl =
            productImage.startsWith('http://') || productImage.startsWith('https://')
              ? productImage
              : `${baseUrl}${productImage.startsWith('/') ? '' : '/'}${productImage}`;

          return {
            '@type': 'ListItem',
            position: (pagination.page - 1) * 12 + index + 1, // Account for pagination
            item: {
              '@type': 'Product',
              name: product.name,
              url: productUrl,
              image: absoluteImageUrl || undefined,
              offers: {
                '@type': 'Offer',
                price: product.minPrice,
                priceCurrency: 'VND',
                availability: 'https://schema.org/InStock',
                url: productUrl,
              },
              ...(product.category && { category: product.category }),
              ...(product.tags && product.tags.length > 0 && { keywords: product.tags.join(', ') }),
            },
          };
        }),
      },
    };

    // Remove existing schema script if any
    const existingScript = document.getElementById('product-list-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject new schema script
    const script = document.createElement('script');
    script.id = 'product-list-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById('product-list-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [products, pagination.total, pagination.page]); // Re-run when products or pagination changes

  // Handle sort change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1'); // Reset to page 1 when sorting changes
    router.push(`/products?${params.toString()}`);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/products?${params.toString()}`);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update URL when filters change
  const handleApplyFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update category
    if (newFilters.categories.length > 0) {
      params.set('category', newFilters.categories[0]);
    } else {
      params.delete('category');
    }

    // Update price range
    if (newFilters.priceRange.length > 0) {
      const range = newFilters.priceRange[0];
      if (range.includes('-')) {
        const [min, max] = range.split('-');
        if (min && min !== '0') {
          params.set('minPrice', min);
        } else {
          params.delete('minPrice');
        }
        if (max && max !== '10000000') {
          params.set('maxPrice', max);
        } else {
          params.delete('maxPrice');
        }
      }
    } else {
      params.delete('minPrice');
      params.delete('maxPrice');
    }

    // Update size
    if (newFilters.sizes.length > 0) {
      params.set('size', newFilters.sizes[0]);
    } else {
      params.delete('size');
    }

    // Update tags/occasions
    if (newFilters.occasions.length > 0) {
      params.set('tags', newFilters.occasions.join(','));
    } else {
      params.delete('tags');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`/products?${params.toString()}`);
  };

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.categories.length > 0
                  ? `${filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1)} - Sản phẩm`
                  : 'Tất cả sản phẩm'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {loading ? 'Đang tải...' : `Tìm thấy ${pagination.total} sản phẩm`}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

              {/* Sorting Dropdown */}
              <Select
                value={searchParams.get('sort') || 'newest'}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[160px] sm:w-[180px] h-9">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
                  <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
                  <SelectItem value="popular">Bán chạy</SelectItem>
                </SelectContent>
              </Select>

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
              onApplyFilters={handleApplyFilters}
              initialFilters={filters}
            />
          </aside>

          {/* Mobile Filter Sidebar - Only render on mobile */}
          <div className="lg:hidden">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={(newFilters) => {
                handleApplyFilters(newFilters);
                setIsFilterOpen(false);
              }}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
                aria-label="Đang tải sản phẩm"
                aria-live="polite"
              >
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    aria-hidden="true"
                  >
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-3 md:p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">Không tìm thấy sản phẩm nào phù hợp</p>
                <button
                  onClick={() => {
                    router.push('/products');
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6'
                      : 'space-y-6'
                  }
                >
                  {products.map((product) => {
                    // Convert ProductListItem to Product type for ProductCard
                    const productForCard: Product = {
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      basePrice: product.minPrice,
                      maxPrice: product.maxPrice,
                      images: product.images,
                      variants: [],
                      tags: product.tags || [],
                      category: product.category || '',
                      description: '',
                      isActive: true,
                      isHot: product.isHot || false,
                    };
                    return <ProductCard key={product.id} product={productForCard} />;
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                        disabled={!pagination.hasPrev}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                        aria-label="Trang trước"
                      >
                        Trước
                      </button>
                      <div className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600">
                        <span className="font-medium">Trang</span>
                        <span className="font-bold text-gray-900">{pagination.page}</span>
                        <span>/{pagination.totalPages}</span>
                      </div>
                      <button
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={!pagination.hasNext}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                        aria-label="Trang sau"
                      >
                        Sau
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Hiển thị {products.length} / {pagination.total} sản phẩm
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
