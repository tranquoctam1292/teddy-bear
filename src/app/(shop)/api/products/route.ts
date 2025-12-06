import { NextRequest, NextResponse } from 'next/server';
import type { GetProductsQueryParams, GetProductsResponse, ProductsErrorResponse } from '@/lib/api-contracts/products';
import { getCollections } from '@/lib/db';
import type { ProductListItem } from '@/lib/schemas/product';

/**
 * GET /api/products
 * 
 * Fetch products with filtering capabilities (MongoDB)
 * 
 * Query Parameters:
 * - category, minPrice, maxPrice, size, tags, isHot, page, limit, sort
 */
export async function GET(request: NextRequest) {
  try {
    const { products } = await getCollections();
    
    // Check if collection is available (null during build phase or connection failures)
    if (!products) {
      console.warn('Products collection not available. Returning empty products list.');
      return NextResponse.json({
        success: true,
        data: {
          products: [],
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
          filters: {
            applied: {},
            available: {
              categories: [],
              priceRange: { min: 0, max: 0 },
              sizes: [],
              tags: [],
            },
          },
        },
      });
    }
    
    const searchParams = request.nextUrl.searchParams;
    
    // Check if requesting single product by slug
    const slug = searchParams.get('slug');
    if (slug) {
      const product = await products.findOne({ slug, isActive: true });
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }
      const { _id, ...productData } = product as any;
      return NextResponse.json({
        success: true,
        data: {
          product: {
            ...productData,
            id: productData.id || _id.toString(),
            basePrice: productData.minPrice || productData.basePrice || 0,
          },
        },
      });
    }

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

    // Handle exclude parameter (for related products)
    const excludeId = searchParams.get('exclude');

    // Validate pagination
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));

    // Build MongoDB query
    const query: any = { isActive: true }; // Only show active products

    if (params.category) {
      query.category = params.category;
    }

    if (params.minPrice !== undefined) {
      query.minPrice = { $gte: params.minPrice };
    }

    if (params.maxPrice !== undefined) {
      query.$or = [
        { minPrice: { $lte: params.maxPrice } },
        { maxPrice: { $lte: params.maxPrice } },
      ];
    }

    if (params.size) {
      query['variants.size'] = params.size;
    }

    if (params.tags) {
      const tagList = params.tags.split(',').map((t) => t.trim());
      query.tags = { $in: tagList };
    }

    if (params.isHot !== undefined) {
      query.isHot = params.isHot;
    }

    // Exclude specific product by ID
    if (excludeId) {
      query.id = { $ne: excludeId };
      // Also try to exclude by _id if it's an ObjectId
      try {
        const { ObjectId } = await import('mongodb');
        query._id = { $ne: new ObjectId(excludeId) };
      } catch {
        // Ignore if ObjectId import fails
      }
    }

    // Build sort
    let sort: any = { createdAt: -1 }; // Default: newest first
    switch (params.sort) {
      case 'price_asc':
        sort = { minPrice: 1 };
        break;
      case 'price_desc':
        sort = { minPrice: -1 };
        break;
      case 'popular':
        // Sort by isHot first, then by views/rating if available
        sort = { isHot: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Get total count
    const total = await products.countDocuments(query);

    // Fetch products
    const productsList = await products
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format products for response
    const formattedProducts: ProductListItem[] = productsList.map((doc: any) => {
      const { _id, ...product } = doc;
      return {
        id: product.id || _id.toString(),
        name: product.name,
        slug: product.slug,
        category: product.category,
        tags: product.tags || [],
        minPrice: product.minPrice || product.basePrice || 0,
        maxPrice: product.maxPrice,
        images: product.images || [],
        isHot: product.isHot || false,
        rating: product.rating,
        reviewCount: product.reviewCount,
        variantCount: product.variants?.length || 0,
      };
    });

    const totalPages = Math.ceil(total / limit);
    const response: GetProductsResponse = {
      success: true,
      data: {
        products: formattedProducts,
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
            categories: [],
            priceRange: { min: 0, max: 0 },
            sizes: [],
            tags: [],
          },
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
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
