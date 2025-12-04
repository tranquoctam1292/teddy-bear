// Mock Products Data - Client-safe (no database imports)
// This file can be safely imported in Client Components
import type { Product } from '@/types';

// Mock products data - used for client-side rendering and fallback
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gấu Bông Teddy Cổ Điển',
    slug: 'gau-bong-teddy-co-dien',
    description: 'Chú gấu bông Teddy cổ điển với thiết kế đáng yêu, mềm mại. Là món quà hoàn hảo cho mọi dịp đặc biệt.',
    category: 'teddy',
    tags: ['Best Seller', 'Birthday', 'Valentine'],
    basePrice: 250000,
    maxPrice: 450000,
    images: [
      '/images/products/teddy-1.jpg',
      '/images/products/teddy-2.jpg',
      '/images/products/teddy-3.jpg',
    ],
    variants: [
      {
        id: 'v1-1',
        size: '80cm',
        price: 250000,
        stock: 15,
        image: '/images/products/teddy-80cm.jpg',
      },
      {
        id: 'v1-2',
        size: '1m2',
        price: 350000,
        stock: 10,
        image: '/images/products/teddy-1m2.jpg',
      },
      {
        id: 'v1-3',
        size: '1m5',
        price: 450000,
        stock: 8,
      },
    ],
    isHot: true,
  },
  // Add more mock products here if needed
];

/**
 * Filter products (client-side helper)
 * Note: For server-side, use MongoDB queries in API routes
 */
export function filterProducts(
  products: Product[],
  filters: {
    priceRange?: string[];
    categories?: string[];
    sizes?: string[];
    occasions?: string[];
  }
): Product[] {
  return products.filter((product) => {
    // Price range filter - check both basePrice and maxPrice
    if (filters.priceRange && filters.priceRange.length > 0) {
      const matchesPrice = filters.priceRange.some((range) => {
        if (range.includes('+')) {
          // Handle "1000000+" case
          const min = parseInt(range.replace('+', ''));
          return product.basePrice >= min;
        }
        
        const [minStr, maxStr] = range.split('-');
        const min = parseInt(minStr);
        const max = maxStr ? parseInt(maxStr) : Infinity;
        
        // Product matches if its price range overlaps with filter range
        const productMaxPrice = product.maxPrice || product.basePrice;
        return (
          (product.basePrice >= min && product.basePrice <= max) ||
          (productMaxPrice >= min && productMaxPrice <= max) ||
          (product.basePrice <= min && productMaxPrice >= max)
        );
      });
      if (!matchesPrice) return false;
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) return false;
    }

    // Size filter (check if product has variant matching size)
    if (filters.sizes && filters.sizes.length > 0) {
      const hasMatchingSize = product.variants.some((variant) => {
        const sizeLower = variant.size.toLowerCase();
        return filters.sizes!.some((filterSize) => {
          if (filterSize === 'mini') {
            return sizeLower.includes('80') || sizeLower.includes('mini');
          }
          if (filterSize === 'bigsize') {
            return sizeLower.includes('1m') || sizeLower.includes('2m') || sizeLower.includes('big');
          }
          return false;
        });
      });
      if (!hasMatchingSize) return false;
    }

    // Occasion filter (check tags)
    if (filters.occasions && filters.occasions.length > 0) {
      const hasMatchingOccasion = filters.occasions.some((occasion) => {
        const occasionMap: Record<string, string> = {
          birthday: 'Birthday',
          graduation: 'Graduation',
          valentine: 'Valentine',
        };
        return product.tags.includes(occasionMap[occasion] || occasion);
      });
      if (!hasMatchingOccasion) return false;
    }

    return true;
  });
}




