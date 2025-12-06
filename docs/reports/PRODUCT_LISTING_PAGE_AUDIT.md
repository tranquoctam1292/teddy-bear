# 🧪 Product Listing Page (PLP) - Comprehensive Audit Report

**Date:** December 2025  
**Page:** `src/app/(shop)/products/page.tsx`  
**Status:** ⚠️ Critical Issues Found

---

## 📋 Executive Summary

Trang danh mục sản phẩm hiện tại có **nhiều vấn đề nghiêm trọng** về logic, SEO, và performance. Trang đang sử dụng **mock data** thay vì API thật, không có URL synchronization, thiếu loading/error states, và không có SEO metadata.

**Priority Issues:**

1. 🔴 **CRITICAL:** Đang dùng mock data thay vì API MongoDB
2. 🔴 **CRITICAL:** Không có URL synchronization với filters
3. 🟡 **HIGH:** Thiếu SEO metadata (canonical, structured data)
4. 🟡 **HIGH:** Không có loading/error states
5. 🟢 **MEDIUM:** Thiếu sorting và pagination

---

## 1. 🐞 Potential Bugs & Issues

### 1.1 Functional Bugs

#### 🔴 **BUG #1: Mock Data Instead of Real API**

**Location:** `src/app/(shop)/products/page.tsx:8`

```typescript
import { mockProducts, filterProducts } from '@/lib/data/mock-products';
```

**Problem:**

- Trang đang dùng mock data thay vì fetch từ `/api/products`
- Không kết nối với MongoDB database
- Dữ liệu không real-time, không có pagination

**Impact:** Production sẽ không hiển thị sản phẩm thật

---

#### 🔴 **BUG #2: No URL Synchronization**

**Location:** `src/app/(shop)/products/page.tsx:15-20`

**Problem:**

- Filters không sync với URL query params
- User không thể share link với filters đã chọn
- Browser back/forward không hoạt động với filters
- SEO: Google không index được filtered pages

**Current Code:**

```typescript
const [filters, setFilters] = useState<FilterState>({
  priceRange: [],
  categories: [],
  sizes: [],
  occasions: [],
});
```

**Expected:** URL should update like `/products?category=teddy&minPrice=100000`

---

#### 🟡 **BUG #3: FilterSidebar State Not Synced**

**Location:** `src/components/filter/FilterSidebar.tsx:28-33`

**Problem:**

- FilterSidebar có internal state riêng
- Khi user click filter, state chỉ update trong component
- Phải click "Áp dụng" mới sync với parent
- Desktop sidebar và mobile sidebar có state riêng biệt

**Impact:** UX confusing, filters không apply ngay lập tức

---

#### 🟡 **BUG #4: No Sorting Functionality**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có UI để sort (Giá tăng/giảm, Mới nhất, Bán chạy)
- API route có support sorting nhưng frontend không dùng

**Impact:** User không thể sắp xếp sản phẩm

---

#### 🟡 **BUG #5: No Pagination**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Hiển thị tất cả sản phẩm cùng lúc
- Không có "Load More" hoặc pagination buttons
- API route có pagination nhưng frontend không dùng

**Impact:** Performance issues với nhiều sản phẩm, không SEO-friendly

---

#### 🟢 **BUG #6: Empty State Logic**

**Location:** `src/app/(shop)/products/page.tsx:120-138`

**Problem:**

- Empty state chỉ check `filteredProducts.length === 0`
- Không phân biệt giữa "no products" vs "filter returned no results"
- Không có loading state khi đang fetch

**Impact:** User không biết đang loading hay thực sự không có sản phẩm

---

### 1.2 UI/UX Issues

#### 🟡 **ISSUE #1: No Loading State**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có Skeleton Loading khi fetch data
- Màn hình trắng khi đang load
- User không biết app đang làm gì

**Impact:** Poor UX, user có thể click nhiều lần

---

#### 🟡 **ISSUE #2: No Error Handling**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có try-catch khi fetch API
- Không hiển thị error message nếu API fail
- App có thể crash nếu API error

**Impact:** User không biết tại sao không load được sản phẩm

---

#### 🟢 **ISSUE #3: Responsive Grid Could Be Better**

**Location:** `src/app/(shop)/products/page.tsx:143`

**Current:**

```typescript
'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6';
```

**Problem:**

- Mobile: 2 cols (có thể 1 col cho UX tốt hơn)
- Tablet: Vẫn 2 cols (nên 3 cols)
- Desktop: 3 cols (có thể 4 cols)

**Impact:** Không tận dụng tối đa không gian màn hình

---

#### 🟢 **ISSUE #4: Filter Sidebar Mobile UX**

**Location:** `src/components/filter/FilterSidebar.tsx:73-81`

**Problem:**

- Mobile sidebar là fixed overlay (tốt)
- Nhưng không có animation smooth
- Không có "Apply" button sticky ở bottom khi scroll

**Impact:** UX không mượt mà trên mobile

---

### 1.3 SEO Issues

#### 🔴 **ISSUE #1: No Metadata Generation**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có `generateMetadata()` function
- Không có title, description, canonical URL
- Google không biết trang này là gì

**Impact:** SEO score = 0, không index được

---

#### 🔴 **ISSUE #2: No Canonical URL**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có canonical URL để tránh duplicate content
- Các URL với filters khác nhau (`?category=teddy`, `?category=panda`) sẽ bị Google coi là duplicate

**Impact:** SEO penalty, ranking thấp

---

#### 🟡 **ISSUE #3: Heading Structure**

**Location:** `src/app/(shop)/products/page.tsx:44`

**Current:**

```typescript
<h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
```

**Problem:**

- H1 quá generic ("Sản phẩm")
- Nên có H1 dynamic theo category/filter
- ProductCard không có heading (nên dùng H2 cho tên sản phẩm)

**Impact:** SEO structure không tối ưu

---

#### 🟡 **ISSUE #4: No Structured Data (Schema.org)**

**Location:** `src/app/(shop)/products/page.tsx`

**Problem:**

- Không có JSON-LD schema cho ProductCollection
- Google không hiểu đây là trang danh sách sản phẩm

**Impact:** Không có rich snippets trong search results

---

#### 🟢 **ISSUE #5: Product Card Semantic HTML**

**Location:** `src/components/product/ProductCard.tsx:172-280`

**Current:**

```typescript
<div className="group relative bg-white rounded-lg...">
  <Link href={`/products/${product.slug}`}>
```

**Problem:**

- Nên dùng `<article>` thay vì `<div>` cho product card
- Link nên wrap toàn bộ card, không chỉ image

**Impact:** Accessibility và SEO không tối ưu

---

### 1.4 Performance Issues

#### 🟡 **ISSUE #1: Client-Side Filtering**

**Location:** `src/app/(shop)/products/page.tsx:24-33`

**Problem:**

- Filtering chạy trên client với `useMemo`
- Với 1000+ products, sẽ chậm
- Nên filter trên server (MongoDB query)

**Impact:** Performance degradation với nhiều sản phẩm

---

#### 🟡 **ISSUE #2: No Server-Side Rendering**

**Location:** `src/app/(shop)/products/page.tsx:1`

**Problem:**

- Component là `'use client'` hoàn toàn
- Không có SSR, tất cả render trên client
- SEO không tốt, initial load chậm

**Impact:** Poor SEO, slow first paint

---

#### 🟢 **ISSUE #3: Image Optimization**

**Location:** `src/components/product/ProductCard.tsx:178-185`

**Current:**

```typescript
<Image
  src={displayImage}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  unoptimized // ⚠️ PROBLEM!
/>
```

**Problem:**

- `unoptimized={true}` tắt Next.js image optimization
- Images không được resize/compress
- Load time chậm

**Impact:** Slow page load, poor Core Web Vitals

---

---

## 2. 🧪 Test Cases (Manual Testing)

### Test Case #1: Filter Functionality

**Priority:** 🔴 Critical

**Steps:**

1. Mở trang `/products`
2. Click filter "Khoảng giá: 100.000đ - 500.000đ"
3. Click filter "Loại gấu: Teddy"
4. Verify: Sản phẩm được filter đúng
5. Check URL: URL có update không? (Expected: NO - Bug #2)

**Expected Result:**

- ✅ Sản phẩm filter đúng
- ❌ URL không update (BUG)

---

### Test Case #2: URL Sharing

**Priority:** 🔴 Critical

**Steps:**

1. Apply filters trên trang products
2. Copy URL và paste vào tab mới
3. Verify: Filters có được restore không?

**Expected Result:**

- ❌ Filters không restore (BUG #2)

---

### Test Case #3: Loading State

**Priority:** 🟡 High

**Steps:**

1. Mở DevTools → Network tab
2. Set throttling = "Slow 3G"
3. Reload trang `/products`
4. Verify: Có loading skeleton không?

**Expected Result:**

- ❌ Không có loading state (ISSUE #1)

---

### Test Case #4: Error Handling

**Priority:** 🟡 High

**Steps:**

1. Mở DevTools → Network tab
2. Block request to `/api/products`
3. Reload trang
4. Verify: Có error message không?

**Expected Result:**

- ❌ Không có error handling (ISSUE #2)

---

### Test Case #5: Mobile Filter Sidebar

**Priority:** 🟢 Medium

**Steps:**

1. Mở trên mobile (< 1024px)
2. Click button "Lọc"
3. Verify: Sidebar mở smooth không?
4. Scroll sidebar, verify: "Áp dụng" button có sticky không?

**Expected Result:**

- ⚠️ Sidebar mở nhưng không smooth (ISSUE #4)

---

### Test Case #6: SEO Metadata

**Priority:** 🔴 Critical

**Steps:**

1. View page source của `/products`
2. Check `<head>` section
3. Verify: Có `<title>`, `<meta description>`, `<link rel="canonical">` không?

**Expected Result:**

- ❌ Không có metadata (ISSUE #1, #2)

---

### Test Case #7: Performance with Many Products

**Priority:** 🟡 High

**Steps:**

1. Tạo 100+ mock products
2. Mở trang `/products`
3. Open DevTools → Performance tab
4. Record và verify: Filter có lag không?

**Expected Result:**

- ⚠️ Có thể lag với client-side filtering (ISSUE #1)

---

---

## 3. 🛠️ Fix & Optimization Plan

### Fix #1: Replace Mock Data with Real API

**File:** `src/app/(shop)/products/page.tsx`

**Refactored Code:**

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { type FilterState } from '@/components/filter/FilterSidebar';
import type { ProductListItem } from '@/lib/schemas/product';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

  // Parse filters from URL
  const filters = useMemo<FilterState>(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const tags = searchParams.get('tags');

    return {
      priceRange: minPrice || maxPrice ? [`${minPrice || '0'}-${maxPrice || '10000000'}`] : [],
      categories: category ? [category] : [],
      sizes: size ? [size] : [],
      occasions: tags ? tags.split(',') : [],
    };
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query params from URL
        const params = new URLSearchParams();

        if (filters.categories.length > 0) {
          params.set('category', filters.categories[0]);
        }

        if (filters.priceRange.length > 0) {
          const range = filters.priceRange[0];
          if (range.includes('-')) {
            const [min, max] = range.split('-');
            if (min) params.set('minPrice', min);
            if (max && max !== '10000000') params.set('maxPrice', max);
          }
        }

        if (filters.sizes.length > 0) {
          params.set('size', filters.sizes[0]);
        }

        if (filters.occasions.length > 0) {
          params.set('tags', filters.occasions.join(','));
        }

        // Add pagination
        const page = searchParams.get('page') || '1';
        params.set('page', page);
        params.set('limit', '12');

        // Add sorting
        const sort = searchParams.get('sort') || 'newest';
        params.set('sort', sort);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch products');
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
  }, [searchParams, filters]);

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
        if (min && min !== '0') params.set('minPrice', min);
        else params.delete('minPrice');
        if (max && max !== '10000000') params.set('maxPrice', max);
        else params.delete('maxPrice');
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
                  ? `${
                      filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1)
                    } - Sản phẩm`
                  : 'Tất cả sản phẩm'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {loading ? 'Đang tải...' : `Tìm thấy ${pagination.total} sản phẩm`}
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
              onApplyFilters={handleApplyFilters}
              initialFilters={filters}
            />
          </aside>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={(newFilters) => {
              handleApplyFilters(newFilters);
              setIsFilterOpen(false);
            }}
            initialFilters={filters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-4 space-y-2">
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
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', String(Math.max(1, pagination.page - 1)));
                        router.push(`/products?${params.toString()}`);
                      }}
                      disabled={!pagination.hasPrev}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Trước
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                      Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set(
                          'page',
                          String(Math.min(pagination.totalPages, pagination.page + 1))
                        );
                        router.push(`/products?${params.toString()}`);
                      }}
                      disabled={!pagination.hasNext}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sau
                    </button>
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
```

---

### Fix #2: Add SEO Metadata

**File:** `src/app/(shop)/products/layout.tsx` (NEW FILE)

**Code:**

```typescript
import { Metadata } from 'next';
import { getCollections } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const baseUrl = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
  const canonicalUrl = `${baseUrl.replace(/\/$/, '')}/products`;

  return {
    title: 'Sản phẩm - Gấu Bông Cao Cấp | The Emotional House',
    description:
      'Khám phá bộ sưu tập gấu bông cao cấp tại The Emotional House. Nhiều loại gấu bông: Teddy, Capybara, Panda, Unicorn với nhiều kích thước và màu sắc.',
    keywords: 'gấu bông, teddy bear, gấu bông cao cấp, quà tặng, The Emotional House',

    openGraph: {
      title: 'Sản phẩm - Gấu Bông Cao Cấp | The Emotional House',
      description: 'Khám phá bộ sưu tập gấu bông cao cấp tại The Emotional House',
      url: canonicalUrl,
      siteName: 'The Emotional House',
      type: 'website',
      locale: 'vi_VN',
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Sản phẩm - Gấu Bông Cao Cấp | The Emotional House',
      description: 'Khám phá bộ sưu tập gấu bông cao cấp tại The Emotional House',
    },

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

---

### Fix #3: Add Structured Data (Schema.org)

**File:** `src/app/(shop)/products/page.tsx` (Add to component)

**Code to add:**

```typescript
// Add this inside the component, before return
useEffect(() => {
  // Generate Schema.org JSON-LD for ProductCollection
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sản phẩm - The Emotional House',
    description: 'Danh sách sản phẩm gấu bông cao cấp',
    url: typeof window !== 'undefined' ? window.location.href : '',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination.total,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/products/${
            product.slug
          }`,
          image: product.images?.[0] || '',
          offers: {
            '@type': 'Offer',
            price: product.minPrice,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
  };

  // Remove existing schema script if any
  const existingScript = document.getElementById('products-schema');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new schema script
  const script = document.createElement('script');
  script.id = 'products-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);

  return () => {
    const scriptToRemove = document.getElementById('products-schema');
    if (scriptToRemove) {
      scriptToRemove.remove();
    }
  };
}, [products, pagination.total]);
```

---

### Fix #4: Update FilterSidebar to Accept Initial Filters

**File:** `src/components/filter/FilterSidebar.tsx`

**Changes:**

```typescript
interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState; // NEW
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters, // NEW
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      // Use initialFilters if provided
      priceRange: [],
      categories: [],
      sizes: [],
      occasions: [],
    }
  );

  // Sync with initialFilters when they change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // ... rest of code
}
```

---

### Fix #5: Improve ProductCard Semantic HTML

**File:** `src/components/product/ProductCard.tsx`

**Changes:**

```typescript
// Replace the outer div with article
return (
  <article className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    {/* Image Container */}
    <Link
      href={`/products/${product.slug}`}
      className="block relative aspect-square overflow-hidden bg-gray-100"
      aria-label={`Xem chi tiết ${product.name}`}
    >
      {/* ... image code ... */}
    </Link>

    {/* Product Info */}
    <div className="p-3 md:p-4 space-y-2">
      {/* Product Name - Use H2 for SEO */}
      <h2 className="font-semibold text-gray-900 line-clamp-2 text-sm md:text-base min-h-[2.5rem] md:min-h-[3rem] group-hover:text-pink-600 transition-colors">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h2>
      {/* ... rest of code ... */}
    </div>
  </article>
);
```

---

### Fix #6: Remove unoptimized from Image

**File:** `src/components/product/ProductCard.tsx:184`

**Change:**

```typescript
<Image
  src={displayImage}
  alt={product.name}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-105"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // Remove unoptimized prop
  priority={false} // Only set priority for above-fold images
/>
```

---

---

## 4. 🎨 UI Improvements

### Improvement #1: Add Sorting Dropdown

**Location:** Header section, next to View Mode toggle

**Code:**

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Add to header
<div className="flex items-center gap-3">
  {/* Sorting */}
  <Select
    value={searchParams.get('sort') || 'newest'}
    onValueChange={(value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', value);
      params.set('page', '1'); // Reset to page 1
      router.push(`/products?${params.toString()}`);
    }}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Sắp xếp" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="newest">Mới nhất</SelectItem>
      <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
      <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
      <SelectItem value="popular">Bán chạy</SelectItem>
    </SelectContent>
  </Select>

  {/* View Mode Toggle - existing code */}
</div>;
```

---

### Improvement #2: Smooth Filter Sidebar Animation

**File:** `src/components/filter/FilterSidebar.tsx`

**Changes:**

```typescript
// Add transition classes
<div className={cn(
  "fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto lg:relative lg:shadow-none lg:w-full",
  "transition-transform duration-300 ease-in-out",
  isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
)}>
```

---

### Improvement #3: Sticky Apply Button on Mobile

**File:** `src/components/filter/FilterSidebar.tsx`

**Changes:**

```typescript
{
  /* Actions */
}
<div className="pt-4 border-t space-y-2 sticky bottom-0 bg-white pb-4 lg:static">
  <button
    onClick={handleApply}
    className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
  >
    Áp dụng ({Object.values(filters).flat().length})
  </button>
  {/* ... reset button ... */}
</div>;
```

---

### Improvement #4: Hover Effects Enhancement

**File:** `src/components/product/ProductCard.tsx`

**Already has good hover effects, but can enhance:**

```typescript
<div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300">
  {/* Add border color change on hover */}
```

---

### Improvement #5: Loading Skeleton Enhancement

**File:** `src/app/(shop)/products/page.tsx`

**Better skeleton:**

```typescript
{
  loading && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

---

## 5. 📊 Priority Matrix

| Issue                    | Priority    | Effort | Impact | Fix Order |
| ------------------------ | ----------- | ------ | ------ | --------- |
| Mock Data → Real API     | 🔴 Critical | High   | High   | 1         |
| URL Synchronization      | 🔴 Critical | Medium | High   | 2         |
| SEO Metadata             | 🔴 Critical | Low    | High   | 3         |
| Loading/Error States     | 🟡 High     | Low    | Medium | 4         |
| FilterSidebar State Sync | 🟡 High     | Low    | Medium | 5         |
| Sorting UI               | 🟡 High     | Low    | Medium | 6         |
| Pagination               | 🟡 High     | Medium | Medium | 7         |
| Image Optimization       | 🟢 Medium   | Low    | Low    | 8         |
| Semantic HTML            | 🟢 Medium   | Low    | Low    | 9         |
| Responsive Grid          | 🟢 Medium   | Low    | Low    | 10        |

---

## 6. ✅ Testing Checklist

Sau khi apply fixes, test lại:

- [ ] Products load từ API thật (không phải mock)
- [ ] URL updates khi apply filters
- [ ] Share URL và verify filters restore
- [ ] Loading skeleton hiển thị khi fetch
- [ ] Error message hiển thị khi API fail
- [ ] Sorting dropdown hoạt động
- [ ] Pagination buttons hoạt động
- [ ] SEO metadata có trong `<head>`
- [ ] Canonical URL có trong `<head>`
- [ ] Schema.org JSON-LD có trong page
- [ ] Mobile filter sidebar smooth
- [ ] Images optimized (check Network tab)
- [ ] ProductCard dùng `<article>` và `<h2>`

---

## 7. 📝 Notes

- **Migration Path:** Có thể giữ mock data làm fallback nếu API fail
- **Performance:** Monitor Core Web Vitals sau khi deploy
- **SEO:** Submit sitemap với filtered URLs nếu cần
- **Accessibility:** Test với screen reader sau khi fix semantic HTML

---

**Report Generated:** December 2025  
**Next Review:** After fixes applied
