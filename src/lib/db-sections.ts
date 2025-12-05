// Database access for Homepage Sections
// This is a separate file to isolate database imports from section components
// NOTE: This file should only be imported in Server Components
// It uses MongoDB which is server-only, but we don't use 'server-only' directive
// to avoid build conflicts. Instead, we rely on lazy-loading in getSectionComponent()
import { getCollections } from './db';

/**
 * Get products for FeaturedProducts/ProductGrid sections
 */
export async function getSectionProducts(query: {
  productSelection?: 'manual' | 'automatic' | 'category' | 'tag';
  productIds?: string[];
  category?: string;
  tag?: string;
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc';
  limit?: number;
}) {
  const { products } = await getCollections();
  
  let mongoQuery: any = { isActive: true };
  let sort: any = {};
  const limit = query.limit || 8;

  // Build query based on selection method
  switch (query.productSelection) {
    case 'manual':
      if (query.productIds && query.productIds.length > 0) {
        const { ObjectId } = await import('mongodb');
        mongoQuery._id = { 
          $in: query.productIds.map(id => new ObjectId(id))
        };
      }
      break;

    case 'category':
      if (query.category) {
        mongoQuery.category = query.category;
      }
      break;

    case 'tag':
      if (query.tag) {
        mongoQuery.tags = query.tag;
      }
      break;

    case 'automatic':
    default:
      // Will use sorting only
      break;
  }

  // Apply sorting
  switch (query.sortBy) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'popular':
      sort = { views: -1 };
      break;
    case 'price-asc':
      sort = { minPrice: 1 };
      break;
    case 'price-desc':
      sort = { minPrice: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const productsList = await products
    .find(mongoQuery)
    .sort(sort)
    .limit(limit)
    .toArray();

  return productsList;
}

/**
 * Get posts for BlogPosts section
 */
export async function getSectionPosts(query: {
  postSelection?: 'recent' | 'featured' | 'category' | 'manual';
  category?: string;
  postIds?: string[];
  limit?: number;
}) {
  const { posts } = await getCollections();

  let mongoQuery: any = { status: 'published' };
  const limit = query.limit || 6;

  // Build query based on selection method
  switch (query.postSelection) {
    case 'featured':
      mongoQuery.featured = true;
      break;

    case 'category':
      if (query.category) {
        mongoQuery.category = query.category;
      }
      break;

    case 'manual':
      if (query.postIds && query.postIds.length > 0) {
        const { ObjectId } = await import('mongodb');
        mongoQuery._id = { 
          $in: query.postIds.map(id => new ObjectId(id))
        };
      }
      break;

    case 'recent':
    default:
      // Will use default sorting
      break;
  }

  const postsList = await posts
    .find(mongoQuery)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .toArray();

  return postsList;
}

