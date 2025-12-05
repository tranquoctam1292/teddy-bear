/**
 * Mock Products Data
 * 
 * Tạm thời sử dụng mock data cho Product Picker và Comparison Table Builder
 * Sẽ được thay thế bằng API search thật sau
 */

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  minPrice?: number;
  category?: string;
  description?: string;
}

/**
 * Mock Products List
 * Dữ liệu mẫu cho testing và development
 */
export const mockProducts: MockProduct[] = [
  {
    id: 'product-001',
    name: 'Gấu Bông Teddy Cổ Điển 80cm',
    slug: 'gau-bong-teddy-co-dien-80cm',
    images: ['https://placehold.co/400x400/pink/white?text=Teddy+80cm'],
    minPrice: 250000,
    category: 'teddy',
    description: 'Gấu bông teddy cổ điển kích thước 80cm, chất liệu bông gòn cao cấp',
  },
  {
    id: 'product-002',
    name: 'Gấu Bông Teddy Siêu Mềm 1m2',
    slug: 'gau-bong-teddy-sieu-mem-1m2',
    images: ['https://placehold.co/400x400/pink/white?text=Teddy+1m2'],
    minPrice: 350000,
    category: 'teddy',
    description: 'Gấu bông teddy siêu mềm kích thước 1m2, phù hợp làm quà tặng',
  },
  {
    id: 'product-003',
    name: 'Gấu Bông Teddy Khổng Lồ 1m5',
    slug: 'gau-bong-teddy-khong-lo-1m5',
    images: ['https://placehold.co/400x400/pink/white?text=Teddy+1m5'],
    minPrice: 450000,
    category: 'teddy',
    description: 'Gấu bông teddy khổng lồ kích thước 1m5, ấn tượng và độc đáo',
  },
  {
    id: 'product-004',
    name: 'Gấu Bông Capybara Dễ Thương',
    slug: 'gau-bong-capybara-de-thuong',
    images: ['https://placehold.co/400x400/brown/white?text=Capybara'],
    minPrice: 280000,
    category: 'capybara',
    description: 'Gấu bông capybara dễ thương, chất liệu mềm mại',
  },
  {
    id: 'product-005',
    name: 'Gấu Bông Panda Đen Trắng',
    slug: 'gau-bong-panda-den-trang',
    images: ['https://placehold.co/400x400/black/white?text=Panda'],
    minPrice: 300000,
    category: 'panda',
    description: 'Gấu bông panda đen trắng, thiết kế đáng yêu',
  },
  {
    id: 'product-006',
    name: 'Gấu Bông Rabbit Hồng',
    slug: 'gau-bong-rabbit-hong',
    images: ['https://placehold.co/400x400/pink/white?text=Rabbit'],
    minPrice: 220000,
    category: 'rabbit',
    description: 'Gấu bông thỏ hồng, phù hợp cho bé gái',
  },
  {
    id: 'product-007',
    name: 'Gấu Bông Bear Nâu 60cm',
    slug: 'gau-bong-bear-nau-60cm',
    images: ['https://placehold.co/400x400/brown/white?text=Bear+60cm'],
    minPrice: 200000,
    category: 'bear',
    description: 'Gấu bông gấu nâu kích thước 60cm, giá rẻ',
  },
  {
    id: 'product-008',
    name: 'Gấu Bông Unicorn Cầu Vồng',
    slug: 'gau-bong-unicorn-cau-vong',
    images: ['https://placehold.co/400x400/purple/white?text=Unicorn'],
    minPrice: 320000,
    category: 'unicorn',
    description: 'Gấu bông kỳ lân cầu vồng, màu sắc rực rỡ',
  },
  {
    id: 'product-009',
    name: 'Gấu Bông Teddy Valentine Đỏ',
    slug: 'gau-bong-teddy-valentine-do',
    images: ['https://placehold.co/400x400/red/white?text=Valentine'],
    minPrice: 280000,
    category: 'teddy',
    description: 'Gấu bông teddy màu đỏ, lý tưởng cho ngày Valentine',
  },
  {
    id: 'product-010',
    name: 'Gấu Bông Teddy Sinh Nhật',
    slug: 'gau-bong-teddy-sinh-nhat',
    images: ['https://placehold.co/400x400/pink/white?text=Birthday'],
    minPrice: 260000,
    category: 'teddy',
    description: 'Gấu bông teddy có kèm phụ kiện sinh nhật',
  },
  {
    id: 'product-011',
    name: 'Gấu Bông Teddy Giáng Sinh',
    slug: 'gau-bong-teddy-giang-sinh',
    images: ['https://placehold.co/400x400/green/white?text=Christmas'],
    minPrice: 300000,
    category: 'teddy',
    description: 'Gấu bông teddy chủ đề Giáng Sinh, có mũ và khăn',
  },
  {
    id: 'product-012',
    name: 'Gấu Bông Teddy Tết',
    slug: 'gau-bong-teddy-tet',
    images: ['https://placehold.co/400x400/red/yellow?text=Tet'],
    minPrice: 290000,
    category: 'teddy',
    description: 'Gấu bông teddy chủ đề Tết, màu đỏ vàng may mắn',
  },
];

/**
 * Search products by query (mock implementation)
 * @param query Search query
 * @param limit Maximum number of results
 * @returns Filtered products
 */
export function searchMockProducts(query: string, limit: number = 20): MockProduct[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return mockProducts
    .filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category?.toLowerCase().includes(lowerQuery);
      const descriptionMatch = product.description?.toLowerCase().includes(lowerQuery);
      
      return nameMatch || categoryMatch || descriptionMatch;
    })
    .slice(0, limit);
}

/**
 * Get product by ID (mock implementation)
 * @param productId Product ID
 * @returns Product or undefined
 */
export function getMockProductById(productId: string): MockProduct | undefined {
  return mockProducts.find((p) => p.id === productId);
}

/**
 * Get products by IDs (mock implementation)
 * @param productIds Array of product IDs
 * @returns Array of products
 */
export function getMockProductsByIds(productIds: string[]): MockProduct[] {
  return mockProducts.filter((p) => productIds.includes(p.id));
}

/**
 * Filter products by criteria (mock implementation)
 * @param products Array of products to filter
 * @param filters Filter criteria
 * @returns Filtered products
 */
export function filterProducts(
  products: MockProduct[],
  filters: {
    priceRange?: string[] | Array<{ min: number; max: number }>;
    categories?: string[];
    sizes?: string[];
    occasions?: string[];
  }
): MockProduct[] {
  return products.filter((product) => {
    // Price range filter
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length > 0) {
      // Convert string array to object array if needed
      const priceRanges: Array<{ min: number; max: number }> = filters.priceRange
        .filter((range): range is string | { min: number; max: number } => range != null)
        .map((range) => {
          if (typeof range === 'string') {
            // Parse string like "0-100000" or "1000000+"
            if (range.includes('+')) {
              const min = parseInt(range.replace('+', ''), 10);
              return { min, max: Infinity };
            }
            const [minStr, maxStr] = range.split('-');
            return {
              min: parseInt(minStr || '0', 10),
              max: parseInt(maxStr || '0', 10),
            };
          }
          return range;
        });

      if (priceRanges.length > 0) {
        const matchesPrice = priceRanges.some((range) => {
          const productPrice = product.minPrice || 0;
          return productPrice >= range.min && (range.max === Infinity || productPrice <= range.max);
        });
        if (!matchesPrice) {
          return false;
        }
      }
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!product.category || !filters.categories.includes(product.category)) {
        return false;
      }
    }

    // Size filter (not applicable to mock products, but keep for compatibility)
    if (filters.sizes && filters.sizes.length > 0) {
      // Mock products don't have size, so skip this filter
    }

    // Occasion filter (not applicable to mock products, but keep for compatibility)
    if (filters.occasions && filters.occasions.length > 0) {
      // Mock products don't have occasion, so skip this filter
    }

    return true;
  });
}
