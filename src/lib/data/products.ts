// Mock data cho products
import type { Product } from '@/types';

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
  {
    id: '2',
    name: 'Gấu Bông Capybara Siêu Dễ Thương',
    slug: 'gau-bong-capybara',
    description: 'Chú Capybara đáng yêu với khuôn mặt ngây thơ, chất liệu siêu mềm mại. Bạn đồng hành hoàn hảo cho mọi lứa tuổi.',
    category: 'capybara',
    tags: ['New', 'Graduation'],
    basePrice: 280000,
    maxPrice: 500000,
    images: [
      '/images/products/capybara-1.jpg',
      '/images/products/capybara-2.jpg',
    ],
    variants: [
      {
        id: 'v2-1',
        size: '80cm',
        price: 280000,
        stock: 12,
      },
      {
        id: 'v2-2',
        size: '1m2',
        price: 380000,
        stock: 9,
      },
      {
        id: 'v2-3',
        size: '1m5',
        price: 500000,
        stock: 5,
      },
    ],
    isHot: false,
  },
  {
    id: '3',
    name: 'Gấu Bông Lotso Hồng',
    slug: 'gau-bong-lotso-hong',
    description: 'Chú gấu Lotso màu hồng đáng yêu từ bộ phim nổi tiếng. Chất liệu cao cấp, an toàn cho trẻ em.',
    category: 'lotso',
    tags: ['Birthday', 'Best Seller'],
    basePrice: 300000,
    maxPrice: 550000,
    images: [
      '/images/products/lotso-1.jpg',
      '/images/products/lotso-2.jpg',
      '/images/products/lotso-3.jpg',
    ],
    variants: [
      {
        id: 'v3-1',
        size: '80cm',
        price: 300000,
        stock: 8,
      },
      {
        id: 'v3-2',
        size: '1m2',
        price: 420000,
        stock: 6,
      },
      {
        id: 'v3-3',
        size: '1m5',
        price: 550000,
        stock: 4,
      },
    ],
    isHot: true,
  },
  {
    id: '4',
    name: 'Gấu Bông Kuromi Đen Trắng',
    slug: 'gau-bong-kuromi',
    description: 'Kuromi với thiết kế độc đáo màu đen trắng, phù hợp cho những ai yêu thích phong cách cá tính.',
    category: 'kuromi',
    tags: ['New', 'Valentine'],
    basePrice: 320000,
    maxPrice: 580000,
    images: [
      '/images/products/kuromi-1.jpg',
      '/images/products/kuromi-2.jpg',
    ],
    variants: [
      {
        id: 'v4-1',
        size: '80cm',
        price: 320000,
        stock: 10,
      },
      {
        id: 'v4-2',
        size: '1m2',
        price: 450000,
        stock: 7,
      },
      {
        id: 'v4-3',
        size: '1m5',
        price: 580000,
        stock: 3,
      },
    ],
    isHot: false,
  },
  {
    id: '5',
    name: 'Gấu Bông Cartoon Nhân Vật Hoạt Hình',
    slug: 'gau-bong-cartoon',
    description: 'Bộ sưu tập gấu bông nhân vật hoạt hình đáng yêu, nhiều màu sắc rực rỡ.',
    category: 'cartoon',
    tags: ['Birthday', 'Graduation'],
    basePrice: 200000,
    maxPrice: 400000,
    images: [
      '/images/products/cartoon-1.jpg',
      '/images/products/cartoon-2.jpg',
    ],
    variants: [
      {
        id: 'v5-1',
        size: '80cm',
        price: 200000,
        stock: 20,
      },
      {
        id: 'v5-2',
        size: '1m2',
        price: 300000,
        stock: 15,
      },
      {
        id: 'v5-3',
        size: '1m5',
        price: 400000,
        stock: 10,
      },
    ],
    isHot: false,
  },
  {
    id: '6',
    name: 'Gấu Bông Teddy Khổng Lồ 2m',
    slug: 'gau-bong-teddy-khong-lo',
    description: 'Chú gấu Teddy khổng lồ cao 2m, món quà ấn tượng cho những dịp đặc biệt. Chất liệu siêu mềm, an toàn.',
    category: 'teddy',
    tags: ['Best Seller', 'Valentine'],
    basePrice: 800000,
    maxPrice: 800000,
    images: [
      '/images/products/teddy-giant-1.jpg',
      '/images/products/teddy-giant-2.jpg',
    ],
    variants: [
      {
        id: 'v6-1',
        size: '2m',
        price: 800000,
        stock: 3,
      },
    ],
    isHot: true,
  },
];

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug);
}

// Helper function to filter products
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

