import { NextRequest, NextResponse } from 'next/server';
import type { GetProductsQueryParams, GetProductsResponse, ProductsErrorResponse } from '@/lib/api-contracts/products';
import { mockProducts } from '@/lib/data/products';
import type { ProductListItem } from '@/lib/schemas/product';

/**
 * GET /api/products
 * 
 * Fetch products with filtering capabilities
 * 
 * Query Parameters:
 * - category, minPrice, maxPrice, size, tags, isHot, page, limit, sort
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const params: GetProductsQueryParams = {
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      size: searchParams.get('size') || undefined,
      tags: searchParams.get('tags') || undefined,
      isHot: searchParams.get('isHot') === 'true' ? true : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
      sort: (searchParams.get('sort') as GetProductsQueryParams['sort']) || 'newest',
    };

    // Validate pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));

    // Filter products
    let filteredProducts = [...mockProducts];

    // Apply filters
    if (params.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === params.category);
    }

    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.basePrice >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => {
        const maxPrice = p.maxPrice || p.basePrice;
        return maxPrice <= params.maxPrice!;
      });
    }

    if (params.size) {
      filteredProducts = filteredProducts.filter((p) =>
        p.variants.some((v) => v.size === params.size)
      );
    }

    if (params.tags) {
      const tagList = params.tags.split(',').map((t) => t.trim());
      filteredProducts = filteredProducts.filter((p) =>
        tagList.some((tag) => p.tags.includes(tag))
      );
    }

    if (params.isHot !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.isHot === params.isHot);
    }

    // Sort products
    switch (params.sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => (b.maxPrice || b.basePrice) - (a.maxPrice || a.basePrice));
        break;
      case 'popular':
        // Sort by isHot first, then by name
        filteredProducts.sort((a, b) => {
          if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'newest':
      default:
        // Keep original order (newest first)
        break;
    }

    // Pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Convert to ProductListItem format
    const productListItems: ProductListItem[] = paginatedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      tags: product.tags,
      minPrice: product.basePrice,
      maxPrice: product.maxPrice,
      images: product.images,
      isHot: product.isHot,
      variantCount: product.variants.length,
    }));

    // Get available filter options
    const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
    const allPrices = mockProducts.flatMap((p) => [
      p.basePrice,
      ...p.variants.map((v) => v.price),
    ]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    const sizes = Array.from(
      new Set(mockProducts.flatMap((p) => p.variants.map((v) => v.size)))
    );

    const allTags = Array.from(new Set(mockProducts.flatMap((p) => p.tags)));

    const response: GetProductsResponse = {
      success: true,
      data: {
        products: productListItems,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: {
          applied: params,
          available: {
            categories: categories.map((cat) => ({
              value: cat,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              count: mockProducts.filter((p) => p.category === cat).length,
            })),
            priceRange: { min: minPrice, max: maxPrice },
            sizes: sizes.map((size) => ({
              value: size,
              label: size,
              count: mockProducts.filter((p) =>
                p.variants.some((v) => v.size === size)
              ).length,
            })),
            tags: allTags.map((tag) => ({
              value: tag,
              label: tag,
              count: mockProducts.filter((p) => p.tags.includes(tag)).length,
            })),
          },
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Products API error:', error);
    const errorResponse: ProductsErrorResponse = {
      success: false,
      error: 'Failed to fetch products',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
