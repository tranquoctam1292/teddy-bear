// API Contracts for Product Listing & Filtering
import type { ProductListItem } from '../schemas/product';

/**
 * GET /api/products
 * 
 * GOAL: Fetch products for the main shop page with filtering capabilities
 * 
 * Query Parameters:
 * - category?: string - Filter by category (e.g., "teddy", "capybara")
 * - minPrice?: number - Minimum price filter
 * - maxPrice?: number - Maximum price filter
 * - size?: string - Filter by variant size (e.g., "1m2", "80cm")
 * - tags?: string - Filter by tags (comma-separated, e.g., "Birthday,Best Seller")
 * - isHot?: boolean - Filter hot products only
 * - page?: number - Page number for pagination (default: 1)
 * - limit?: number - Items per page (default: 12)
 * - sort?: string - Sort order ("price_asc", "price_desc", "newest", "popular")
 * 
 * Example Request:
 * GET /api/products?category=teddy&minPrice=100000&size=1m2&page=1&limit=12
 */

export interface GetProductsQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  tags?: string;
  isHot?: boolean;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

/**
 * Response Body for GET /api/products
 */
export interface GetProductsResponse {
  success: true;
  data: {
    products: ProductListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    filters: {
      applied: Partial<GetProductsQueryParams>;
      available: {
        categories: Array<{ value: string; label: string; count: number }>;
        priceRange: { min: number; max: number };
        sizes: Array<{ value: string; label: string; count: number }>;
        tags: Array<{ value: string; label: string; count: number }>;
      };
    };
  };
}

/**
 * Error Response
 */
export interface ProductsErrorResponse {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}



