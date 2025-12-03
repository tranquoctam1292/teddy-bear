// Product Data Access Layer - MongoDB Integration
import type { Product } from '@/types';
import { getCollections } from '@/lib/db';
import { mockProducts } from './mock-products';

// Re-export mock data from client-safe file (for migration script compatibility)
export { mockProducts, filterProducts } from './mock-products';

/**
 * Get product by slug from MongoDB
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { products } = await getCollections();
    const product = await products.findOne({ slug, isActive: true });
    
    if (!product) {
      return undefined;
    }

    // Format product (remove _id, ensure id exists, map minPrice to basePrice)
    const { _id, ...productData } = product as any;
    return {
      ...productData,
      id: productData.id || _id.toString(),
      basePrice: productData.minPrice || productData.basePrice || 0,
    } as Product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    // Fallback to mock data if database fails
    return mockProducts.find((product) => product.slug === slug);
  }
}

/**
 * Get all products from MongoDB (for client-side filtering)
 * Note: For large datasets, use API route instead
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { products } = await getCollections();
    const productsList = await products
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    return productsList.map((doc: any) => {
      const { _id, ...product } = doc;
      return {
        ...product,
        id: product.id || _id.toString(),
        basePrice: product.minPrice || product.basePrice || 0,
      } as Product;
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    // Fallback to mock data
    return mockProducts;
  }
}

