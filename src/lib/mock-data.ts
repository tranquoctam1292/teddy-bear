// Mock Data for Homepage Sections - Phase 3 & 4
// Product, Feature, Testimonial, and Blog Post interfaces

// ============================================
// Phase 3: Product Sections
// ============================================

import type { Variant } from '@/types';

export interface HomepageProduct {
  id: string;
  name: string;
  slug: string;
  price: number; // Current price in VND (lowest variant price)
  originalPrice?: number; // Original price (if on sale)
  rating?: number; // 0-5 rating
  image: string; // Main product image URL
  images?: string[]; // Product gallery
  badge?: 'hot' | 'new' | 'sale'; // Product badge
  category?: string;
  tags?: string[]; // e.g., ["Best Seller", "Birthday"]
  // Phase 8: Product Enhancements
  size?: 'S' | 'M' | 'L' | 'XL' | 'XXL'; // Legacy - use variants instead
  ageRecommendation?: '0-3' | '3-6' | '6+' | 'all';
  material?: string; // e.g., "Cotton 100%", "Polyester"
  dimensions?: {
    height: number; // cm
    width: number; // cm
  };
  // Variants support (NEW)
  variants?: Variant[]; // Product variants with size, color, price
  basePrice?: number; // Lowest price (for display)
  maxPrice?: number; // Highest price (if multiple variants)
}

/**
 * Mock Products for Homepage Display
 * 8 products with Vietnamese names and realistic prices
 */
export const MOCK_PRODUCTS: HomepageProduct[] = [
  {
    id: '1',
    name: 'Gấu Bông Teddy Hồng Cổ Điển',
    slug: 'gau-bong-teddy-hong-co-dien',
    price: 200000, // Lowest variant price
    originalPrice: 350000,
    basePrice: 200000,
    maxPrice: 350000,
    rating: 4.8,
    image: 'https://placehold.co/400x400/fce7f3/ec4899?text=Teddy+Hồng',
    images: [
      'https://placehold.co/400x400/fce7f3/ec4899?text=Teddy+Hồng',
      'https://placehold.co/400x400/fce7f3/f472b6?text=Teddy+Hồng+2',
    ],
    badge: 'hot',
    category: 'teddy',
    tags: ['Best Seller', 'Birthday'],
    size: 'L', // Legacy
    ageRecommendation: '6+',
    material: 'Cotton 100%',
    dimensions: { height: 40, width: 30 },
    variants: [
      {
        id: '1-80cm',
        size: '80cm',
        color: 'Hồng',
        colorCode: '#ec4899',
        price: 200000,
        stock: 15,
        image: 'https://placehold.co/400x400/fce7f3/ec4899?text=Teddy+80cm',
      },
      {
        id: '1-1m2',
        size: '1m2',
        color: 'Hồng',
        colorCode: '#ec4899',
        price: 280000,
        stock: 10,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Teddy+1m2',
      },
      {
        id: '1-1m5',
        size: '1m5',
        color: 'Hồng',
        colorCode: '#ec4899',
        price: 350000,
        stock: 8,
        image: 'https://placehold.co/400x400/fce7f3/ec4899?text=Teddy+1m5',
      },
    ],
  },
  {
    id: '2',
    name: 'Gấu Bông Capybara Siêu Dễ Thương',
    slug: 'gau-bong-capybara-sieu-de-thuong',
    price: 250000,
    basePrice: 250000,
    maxPrice: 400000,
    rating: 5.0,
    image: 'https://placehold.co/400x400/d1fae5/10b981?text=Capybara',
    images: [
      'https://placehold.co/400x400/d1fae5/10b981?text=Capybara',
      'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+2',
    ],
    badge: 'new',
    category: 'capybara',
    tags: ['Mới', 'Yêu thích'],
    size: 'XL', // Legacy
    ageRecommendation: '3-6',
    material: 'Polyester mềm mại',
    dimensions: { height: 50, width: 35 },
    variants: [
      {
        id: '2-80cm',
        size: '80cm',
        color: 'Xanh lá',
        colorCode: '#10b981',
        price: 250000,
        stock: 20,
        image: 'https://placehold.co/400x400/d1fae5/10b981?text=Capybara+80cm',
      },
      {
        id: '2-1m2',
        size: '1m2',
        color: 'Xanh lá',
        colorCode: '#10b981',
        price: 320000,
        stock: 12,
        image: 'https://placehold.co/400x400/d1fae5/10b981?text=Capybara+1m2',
      },
      {
        id: '2-1m5',
        size: '1m5',
        color: 'Xanh lá',
        colorCode: '#10b981',
        price: 400000,
        stock: 5,
        image: 'https://placehold.co/400x400/d1fae5/10b981?text=Capybara+1m5',
      },
    ],
  },
  {
    id: '3',
    name: 'Gấu Bông Lotso Hồng Phấn',
    slug: 'gau-bong-lotso-hong-phan',
    price: 220000,
    originalPrice: 380000,
    basePrice: 220000,
    maxPrice: 320000,
    rating: 4.6,
    image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Lotso',
    images: [
      'https://placehold.co/400x400/fce7f3/f472b6?text=Lotso',
      'https://placehold.co/400x400/fce7f3/ec4899?text=Lotso+2',
    ],
    badge: 'sale',
    category: 'lotso',
    tags: ['Sale', 'Yêu thích'],
    size: 'M', // Legacy
    ageRecommendation: '6+',
    material: 'Cotton 100%',
    dimensions: { height: 35, width: 25 },
    variants: [
      {
        id: '3-80cm',
        size: '80cm',
        color: 'Hồng phấn',
        colorCode: '#f472b6',
        price: 220000,
        stock: 18,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Lotso+80cm',
      },
      {
        id: '3-1m2',
        size: '1m2',
        color: 'Hồng phấn',
        colorCode: '#f472b6',
        price: 280000,
        stock: 12,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Lotso+1m2',
      },
      {
        id: '3-1m5',
        size: '1m5',
        color: 'Hồng phấn',
        colorCode: '#f472b6',
        price: 320000,
        stock: 6,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Lotso+1m5',
      },
    ],
  },
  {
    id: '4',
    name: 'Gấu Bông Kuromi Đen Trắng',
    slug: 'gau-bong-kuromi-den-trang',
    price: 240000,
    basePrice: 240000,
    maxPrice: 360000,
    rating: 4.9,
    image: 'https://placehold.co/400x400/f3f4f6/6b7280?text=Kuromi',
    images: [
      'https://placehold.co/400x400/f3f4f6/6b7280?text=Kuromi',
      'https://placehold.co/400x400/e5e7eb/4b5563?text=Kuromi+2',
    ],
    badge: 'new',
    category: 'kuromi',
    tags: ['Mới', 'Best Seller'],
    size: 'L', // Legacy
    ageRecommendation: '6+',
    material: 'Polyester cao cấp',
    dimensions: { height: 38, width: 28 },
    variants: [
      {
        id: '4-80cm',
        size: '80cm',
        color: 'Đen trắng',
        colorCode: '#6b7280',
        price: 240000,
        stock: 15,
        image: 'https://placehold.co/400x400/f3f4f6/6b7280?text=Kuromi+80cm',
      },
      {
        id: '4-1m2',
        size: '1m2',
        color: 'Đen trắng',
        colorCode: '#6b7280',
        price: 300000,
        stock: 10,
        image: 'https://placehold.co/400x400/f3f4f6/6b7280?text=Kuromi+1m2',
      },
      {
        id: '4-1m5',
        size: '1m5',
        color: 'Đen trắng',
        colorCode: '#6b7280',
        price: 360000,
        stock: 7,
        image: 'https://placehold.co/400x400/f3f4f6/6b7280?text=Kuromi+1m5',
      },
    ],
  },
  {
    id: '5',
    name: 'Gấu Bông Cartoon Doremon Xanh',
    slug: 'gau-bong-cartoon-doremon-xanh',
    price: 180000,
    originalPrice: 300000,
    basePrice: 180000,
    maxPrice: 280000,
    rating: 4.5,
    image: 'https://placehold.co/400x400/dbeafe/3b82f6?text=Doremon',
    images: [
      'https://placehold.co/400x400/dbeafe/3b82f6?text=Doremon',
      'https://placehold.co/400x400/bfdbfe/2563eb?text=Doremon+2',
    ],
    badge: 'sale',
    category: 'cartoon',
    tags: ['Sale', 'Cartoon'],
    size: 'M', // Legacy
    ageRecommendation: '3-6',
    material: 'Cotton 100%',
    dimensions: { height: 32, width: 24 },
    variants: [
      {
        id: '5-80cm',
        size: '80cm',
        color: 'Xanh dương',
        colorCode: '#3b82f6',
        price: 180000,
        stock: 25,
        image: 'https://placehold.co/400x400/dbeafe/3b82f6?text=Doremon+80cm',
      },
      {
        id: '5-1m2',
        size: '1m2',
        color: 'Xanh dương',
        colorCode: '#3b82f6',
        price: 230000,
        stock: 15,
        image: 'https://placehold.co/400x400/dbeafe/3b82f6?text=Doremon+1m2',
      },
      {
        id: '5-1m5',
        size: '1m5',
        color: 'Xanh dương',
        colorCode: '#3b82f6',
        price: 280000,
        stock: 8,
        image: 'https://placehold.co/400x400/dbeafe/3b82f6?text=Doremon+1m5',
      },
    ],
  },
  {
    id: '6',
    name: 'Gấu Bông Teddy Nâu Cổ Điển',
    slug: 'gau-bong-teddy-nau-co-dien',
    price: 220000,
    basePrice: 220000,
    maxPrice: 340000,
    rating: 4.7,
    image: 'https://placehold.co/400x400/fef3c7/f59e0b?text=Teddy+Nâu',
    images: [
      'https://placehold.co/400x400/fef3c7/f59e0b?text=Teddy+Nâu',
      'https://placehold.co/400x400/fde68a/eab308?text=Teddy+Nâu+2',
    ],
    badge: 'hot',
    category: 'teddy',
    tags: ['Best Seller', 'Hot'],
    size: 'XL', // Legacy
    ageRecommendation: 'all',
    material: 'Cotton 100%',
    dimensions: { height: 45, width: 32 },
    variants: [
      {
        id: '6-80cm',
        size: '80cm',
        color: 'Nâu',
        colorCode: '#f59e0b',
        price: 220000,
        stock: 20,
        image: 'https://placehold.co/400x400/fef3c7/f59e0b?text=Teddy+Nâu+80cm',
      },
      {
        id: '6-1m2',
        size: '1m2',
        color: 'Nâu',
        colorCode: '#f59e0b',
        price: 280000,
        stock: 14,
        image: 'https://placehold.co/400x400/fef3c7/f59e0b?text=Teddy+Nâu+1m2',
      },
      {
        id: '6-1m5',
        size: '1m5',
        color: 'Nâu',
        colorCode: '#f59e0b',
        price: 340000,
        stock: 9,
        image: 'https://placehold.co/400x400/fef3c7/f59e0b?text=Teddy+Nâu+1m5',
      },
    ],
  },
  {
    id: '7',
    name: 'Gấu Bông Capybara Xanh Mint',
    slug: 'gau-bong-capybara-xanh-mint',
    price: 260000,
    originalPrice: 400000,
    basePrice: 260000,
    maxPrice: 420000,
    rating: 4.8,
    image: 'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+Mint',
    images: [
      'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+Mint',
      'https://placehold.co/400x400/a7f3d0/059669?text=Capybara+Mint+2',
    ],
    badge: 'sale',
    category: 'capybara',
    tags: ['Sale', 'Baby-safe'],
    size: 'L', // Legacy
    ageRecommendation: '0-3',
    material: 'Cotton 100% (Baby-safe)',
    dimensions: { height: 42, width: 30 },
    variants: [
      {
        id: '7-80cm',
        size: '80cm',
        color: 'Xanh mint',
        colorCode: '#14b8a6',
        price: 260000,
        stock: 22,
        image: 'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+Mint+80cm',
      },
      {
        id: '7-1m2',
        size: '1m2',
        color: 'Xanh mint',
        colorCode: '#14b8a6',
        price: 340000,
        stock: 16,
        image: 'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+Mint+1m2',
      },
      {
        id: '7-1m5',
        size: '1m5',
        color: 'Xanh mint',
        colorCode: '#14b8a6',
        price: 420000,
        stock: 6,
        image: 'https://placehold.co/400x400/ccfbf1/14b8a6?text=Capybara+Mint+1m5',
      },
    ],
  },
  {
    id: '8',
    name: 'Gấu Bông Cartoon Hello Kitty',
    slug: 'gau-bong-cartoon-hello-kitty',
    price: 230000,
    basePrice: 230000,
    maxPrice: 330000,
    rating: 4.9,
    image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Hello+Kitty',
    images: [
      'https://placehold.co/400x400/fce7f3/f472b6?text=Hello+Kitty',
      'https://placehold.co/400x400/fce7f3/ec4899?text=Hello+Kitty+2',
    ],
    badge: 'new',
    category: 'cartoon',
    tags: ['Mới', 'Cartoon'],
    size: 'M', // Legacy
    ageRecommendation: '3-6',
    material: 'Polyester mềm mại',
    dimensions: { height: 36, width: 26 },
    variants: [
      {
        id: '8-80cm',
        size: '80cm',
        color: 'Hồng',
        colorCode: '#f472b6',
        price: 230000,
        stock: 18,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Hello+Kitty+80cm',
      },
      {
        id: '8-1m2',
        size: '1m2',
        color: 'Hồng',
        colorCode: '#f472b6',
        price: 280000,
        stock: 12,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Hello+Kitty+1m2',
      },
      {
        id: '8-1m5',
        size: '1m5',
        color: 'Hồng',
        colorCode: '#f472b6',
        price: 330000,
        stock: 7,
        image: 'https://placehold.co/400x400/fce7f3/f472b6?text=Hello+Kitty+1m5',
      },
    ],
  },
];

// ============================================
// Phase 4: Content Sections
// ============================================

export interface Feature {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO date string
  image: string;
  slug: string;
  author: string;
}

/**
 * Features for Homepage Display
 * Trust-building features (Shipping, Returns, Support, etc.)
 */
export const FEATURES: Feature[] = [
  {
    id: '1',
    icon: 'Truck',
    title: 'Giao hàng nhanh',
    description: 'Miễn phí vận chuyển toàn quốc, nhận hàng trong 2-5 ngày',
  },
  {
    id: '2',
    icon: 'RefreshCw',
    title: 'Đổi trả dễ dàng',
    description: 'Đổi trả miễn phí trong 30 ngày, không cần lý do',
  },
  {
    id: '3',
    icon: 'Shield',
    title: 'Bảo hành chính hãng',
    description: 'Cam kết chất lượng, bảo hành 12 tháng cho tất cả sản phẩm',
  },
  {
    id: '4',
    icon: 'Headphones',
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi',
  },
];

/**
 * Testimonials for Homepage Display
 * Customer reviews and ratings
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Thị Mai',
    avatar: 'https://placehold.co/80x80/fce7f3/ec4899?text=MT',
    rating: 5,
    comment:
      'Gấu bông rất đẹp và mềm mại, con mình rất thích. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua tiếp!',
    role: 'Khách hàng',
  },
  {
    id: '2',
    name: 'Trần Văn Đức',
    avatar: 'https://placehold.co/80x80/dbeafe/3b82f6?text=TD',
    rating: 5,
    comment:
      'Chất lượng sản phẩm vượt mong đợi. Giá cả hợp lý, dịch vụ chăm sóc khách hàng tuyệt vời. Đáng 5 sao!',
    role: 'Khách hàng',
  },
  {
    id: '3',
    name: 'Lê Thị Hương',
    avatar: 'https://placehold.co/80x80/fce7f3/f472b6?text=LH',
    rating: 5,
    comment:
      'Mua làm quà sinh nhật cho bạn, bạn rất thích. Sản phẩm đẹp, giá tốt. Cảm ơn shop nhiều!',
    role: 'Khách hàng',
  },
];

/**
 * Blog Posts for Homepage Display
 * Latest blog articles
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Gấu Bông Được Yêu Thích Nhất 2025',
    excerpt:
      'Khám phá những mẫu gấu bông hot nhất năm 2025, từ Teddy cổ điển đến các nhân vật hoạt hình đáng yêu.',
    date: '2025-12-01',
    image: 'https://placehold.co/600x400/fce7f3/ec4899?text=Blog+1',
    slug: 'top-10-gau-bong-duoc-yeu-thich-nhat-2025',
    author: 'Teddy Shop',
  },
  {
    id: '2',
    title: 'Cách Chọn Gấu Bông Phù Hợp Cho Trẻ Em',
    excerpt:
      'Hướng dẫn chi tiết cách chọn gấu bông an toàn, chất lượng và phù hợp với độ tuổi của trẻ.',
    date: '2025-11-28',
    image: 'https://placehold.co/600x400/dbeafe/3b82f6?text=Blog+2',
    slug: 'cach-chon-gau-bong-phu-hop-cho-tre-em',
    author: 'Teddy Shop',
  },
  {
    id: '3',
    title: 'Lịch Sử Và Ý Nghĩa Của Gấu Bông Teddy',
    excerpt:
      'Tìm hiểu về nguồn gốc, lịch sử phát triển và ý nghĩa tinh thần của gấu bông Teddy qua các thời kỳ.',
    date: '2025-11-25',
    image: 'https://placehold.co/600x400/fce7f3/f472b6?text=Blog+3',
    slug: 'lich-su-va-y-nghia-cua-gau-bong-teddy',
    author: 'Teddy Shop',
  },
];

// ============================================
// Phase 7: Category Showcase
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  icon: string; // Lucide icon name
  featured?: boolean;
}

/**
 * Categories for Homepage Display
 * Main product categories to help customers discover products
 */
export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Gấu Bông Teddy',
    slug: 'gau-bong-teddy',
    description: 'Gấu bông cổ điển, mềm mại và đáng yêu',
    image: 'https://placehold.co/600x400/fce7f3/ec4899?text=Teddy+Bears',
    productCount: 45,
    icon: 'Heart',
    featured: true,
  },
  {
    id: '2',
    name: 'Gấu Bông Capybara',
    slug: 'gau-bong-capybara',
    description: 'Capybara siêu dễ thương, hot trend 2025',
    image: 'https://placehold.co/600x400/d1fae5/10b981?text=Capybara',
    productCount: 28,
    icon: 'Smile',
    featured: true,
  },
  {
    id: '3',
    name: 'Nhân Vật Hoạt Hình',
    slug: 'nhan-vat-hoat-hinh',
    description: 'Doremon, Hello Kitty, Kuromi và nhiều hơn nữa',
    image: 'https://placehold.co/600x400/dbeafe/3b82f6?text=Cartoon',
    productCount: 62,
    icon: 'Sparkles',
    featured: true,
  },
  {
    id: '4',
    name: 'Gấu Bông Khổ Lớn',
    slug: 'gau-bong-kho-lon',
    description: 'Gấu bông size lớn, hoàn hảo cho quà tặng',
    image: 'https://placehold.co/600x400/fef3c7/f59e0b?text=Large+Size',
    productCount: 18,
    icon: 'Package',
    featured: false,
  },
  {
    id: '5',
    name: 'Gấu Bông Cho Bé',
    slug: 'gau-bong-cho-be',
    description: 'An toàn cho trẻ em 0-3 tuổi, chất liệu cao cấp',
    image: 'https://placehold.co/600x400/fce7f3/f472b6?text=Baby+Safe',
    productCount: 32,
    icon: 'Baby',
    featured: true,
  },
  {
    id: '6',
    name: 'Bộ Sưu Tập Đặc Biệt',
    slug: 'bo-suu-tap-dac-biet',
    description: 'Limited edition và bộ sưu tập độc quyền',
    image: 'https://placehold.co/600x400/f3f4f6/6b7280?text=Special',
    productCount: 15,
    icon: 'Star',
    featured: false,
  },
];

// ============================================
// Phase 7: Emotional Hero Slides
// ============================================

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  heading: string;
  subheading?: string;
  description?: string;
  primaryButton?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline';
    openInNewTab?: boolean;
  };
  secondaryButton?: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline';
    openInNewTab?: boolean;
  };
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

/**
 * Emotional Hero Slides for Homepage
 * Phase 7: Updated with emotional storytelling
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    image: 'https://placehold.co/1920x800/ec4899/white?text=Emotional+Connection',
    imageAlt: 'Gấu bông - Người bạn đồng hành',
    heading: 'Mỗi Chú Gấu Là Một Kỷ Niệm Đẹp',
    subheading: 'Tìm người bạn đồng hành hoàn hảo',
    description:
      'Gấu bông không chỉ là món đồ chơi, mà là người bạn thân thiết, lưu giữ những khoảnh khắc đáng nhớ trong cuộc sống.',
    primaryButton: {
      text: 'Khám Phá Bộ Sưu Tập',
      link: '/products',
      style: 'primary',
      openInNewTab: false,
    },
    secondaryButton: {
      text: 'Tìm Quà Tặng',
      link: '/gift-guide',
      style: 'outline',
      openInNewTab: false,
    },
    textAlign: 'center',
    textColor: 'light',
    overlay: {
      enabled: true,
      color: 'rgba(0, 0, 0, 0.4)',
      opacity: 0.4,
    },
  },
  {
    id: '2',
    image: 'https://placehold.co/1920x800/f472b6/white?text=Perfect+Gift',
    imageAlt: 'Quà tặng ý nghĩa',
    heading: 'Quà Tặng Ý Nghĩa Cho Người Thân Yêu',
    subheading: 'Món quà từ trái tim',
    description:
      'Tặng gấu bông là cách thể hiện tình cảm chân thành. Mỗi chú gấu mang theo thông điệp yêu thương và sự quan tâm.',
    primaryButton: {
      text: 'Xem Gift Guide',
      link: '/gift-guide',
      style: 'primary',
      openInNewTab: false,
    },
    textAlign: 'left',
    textColor: 'light',
    overlay: {
      enabled: true,
      color: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.3,
    },
  },
  {
    id: '3',
    image: 'https://placehold.co/1920x800/db2777/white?text=Quality+Safety',
    imageAlt: 'Chất lượng và an toàn',
    heading: 'Chất Lượng Cao Cấp - An Toàn Tuyệt Đối',
    subheading: 'Cam kết cho sức khỏe và niềm vui',
    description:
      'Tất cả sản phẩm được kiểm định chất lượng, an toàn cho trẻ em, mềm mại và bền đẹp theo thời gian.',
    primaryButton: {
      text: 'Tìm Hiểu Thêm',
      link: '/about',
      style: 'primary',
      openInNewTab: false,
    },
    textAlign: 'right',
    textColor: 'light',
    overlay: {
      enabled: true,
      color: 'rgba(0, 0, 0, 0.5)',
      opacity: 0.5,
    },
  },
];

// ============================================
// Phase 5: Marketing Sections
// ============================================

export interface CTAContent {
  heading: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  background?: 'gradient' | 'solid' | 'image';
  backgroundColor?: string;
  backgroundImage?: string;
  variant?: 'centered' | 'split';
}

export interface NewsletterContent {
  heading: string;
  subheading?: string;
  placeholder?: string;
  buttonText?: string;
  privacyText?: string;
}

export interface CountdownTarget {
  targetDate: string; // ISO date string
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

/**
 * CTA Banner Content for Homepage Display
 * Call-to-action banners to drive conversions
 */
export const CTA_CONTENT: CTAContent = {
  heading: 'Giảm giá lên đến 50% - Chỉ trong tuần này!',
  description: 'Mua ngay để nhận ưu đãi đặc biệt và miễn phí vận chuyển toàn quốc',
  buttonText: 'Mua ngay',
  buttonLink: '/products?sale=true',
  background: 'gradient',
  variant: 'centered',
};

/**
 * Newsletter Subscription Content
 * Email capture for marketing campaigns
 */
export const NEWSLETTER_CONTENT: NewsletterContent = {
  heading: 'Đăng ký nhận tin khuyến mãi',
  subheading: 'Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và ưu đãi độc quyền',
  placeholder: 'Nhập email của bạn',
  buttonText: 'Đăng ký ngay',
  privacyText:
    'Chúng tôi cam kết bảo mật thông tin của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.',
};

/**
 * Countdown Timer Target Date
 * Sale event countdown (3 days from now for testing)
 */
export const COUNTDOWN_TARGET: CountdownTarget = {
  targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  heading: 'Khuyến mãi kết thúc sau',
  description: 'Nhanh tay mua sắm để không bỏ lỡ ưu đãi đặc biệt này!',
  buttonText: 'Xem sản phẩm khuyến mãi',
  buttonLink: '/products?sale=true',
};

// ============================================
// Phase 8: Gift Guide
// ============================================

export interface GiftOccasion {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  image: string;
  productIds: string[]; // Recommended products
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * Gift Occasions for Homepage Display
 * Occasion-based product recommendations
 */
export const GIFT_OCCASIONS: GiftOccasion[] = [
  {
    id: '1',
    name: 'Sinh Nhật',
    slug: 'sinh-nhat',
    description: 'Quà tặng sinh nhật ý nghĩa cho mọi lứa tuổi',
    icon: 'Cake',
    image: 'https://placehold.co/400x300/fce7f3/ec4899?text=Birthday',
    productIds: ['1', '2', '3'],
    priceRange: { min: 200000, max: 500000 },
  },
  {
    id: '2',
    name: 'Valentine',
    slug: 'valentine',
    description: 'Gấu bông tình yêu, thể hiện tình cảm chân thành',
    icon: 'Heart',
    image: 'https://placehold.co/400x300/fce7f3/f472b6?text=Valentine',
    productIds: ['1', '4', '6'],
    priceRange: { min: 250000, max: 600000 },
  },
  {
    id: '3',
    name: '8/3 - Ngày Phụ Nữ',
    slug: 'ngay-phu-nu',
    description: 'Quà tặng đặc biệt cho người phụ nữ yêu thương',
    icon: 'Flower',
    image: 'https://placehold.co/400x300/fce7f3/f472b6?text=8%2F3',
    productIds: ['2', '5', '7'],
    priceRange: { min: 200000, max: 500000 },
  },
  {
    id: '4',
    name: 'Giáng Sinh',
    slug: 'giang-sinh',
    description: 'Gấu bông Giáng Sinh, mang niềm vui đến mọi nhà',
    icon: 'TreePine',
    image: 'https://placehold.co/400x300/dbeafe/3b82f6?text=Christmas',
    productIds: ['3', '6', '8'],
    priceRange: { min: 250000, max: 600000 },
  },
  {
    id: '5',
    name: 'Tết Nguyên Đán',
    slug: 'tet-nguyen-dan',
    description: 'Quà Tết ý nghĩa, chúc may mắn và hạnh phúc',
    icon: 'Sparkles',
    image: 'https://placehold.co/400x300/fef3c7/f59e0b?text=Tet',
    productIds: ['1', '4', '7'],
    priceRange: { min: 300000, max: 800000 },
  },
  {
    id: '6',
    name: 'Tốt Nghiệp',
    slug: 'tot-nghiep',
    description: 'Chúc mừng thành công, khởi đầu hành trình mới',
    icon: 'GraduationCap',
    image: 'https://placehold.co/400x300/d1fae5/10b981?text=Graduation',
    productIds: ['2', '5', '8'],
    priceRange: { min: 250000, max: 500000 },
  },
];

// ============================================
// Phase 9: Age Recommendations
// ============================================

export interface AgeGroup {
  id: string;
  ageRange: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  safetyFeatures: string[];
  productIds: string[];
}

/**
 * Age Groups for Homepage Display
 * Age-based product recommendations with safety features
 */
export const AGE_GROUPS: AgeGroup[] = [
  {
    id: '1',
    ageRange: '0-3',
    name: 'Trẻ Sơ Sinh & Nhũ Nhi',
    description: 'Gấu bông an toàn tuyệt đối, không có phụ kiện nhỏ',
    icon: 'Baby',
    safetyFeatures: [
      'Không có phụ kiện nhỏ',
      'Chất liệu mềm mại, không gây dị ứng',
      'Dễ giặt, kháng khuẩn',
    ],
    productIds: ['2', '5', '8'],
  },
  {
    id: '2',
    ageRange: '3-6',
    name: 'Trẻ Mẫu Giáo',
    description: 'Gấu bông đa dạng, kích thích sáng tạo và vui chơi',
    icon: 'User', // Changed from 'Child' (doesn't exist in lucide-react)
    safetyFeatures: ['Kích thước vừa phải', 'Màu sắc tươi sáng', 'Dễ cầm nắm'],
    productIds: ['1', '3', '6'],
  },
  {
    id: '3',
    ageRange: '6+',
    name: 'Trẻ Em & Người Lớn',
    description: 'Gấu bông đa dạng, phù hợp mọi sở thích',
    icon: 'Users',
    safetyFeatures: ['Đa dạng kích thước', 'Nhiều nhân vật', 'Chất lượng cao cấp'],
    productIds: ['1', '2', '3', '4', '5', '6', '7', '8'],
  },
];

// ============================================
// Phase 9: Video Content
// ============================================

export interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string; // e.g., "5:30"
  videoUrl: string; // YouTube/Vimeo URL
  type: 'unboxing' | 'in-use' | 'quality' | 'comparison';
  description?: string;
}

/**
 * Video Content for Homepage Display
 * Product showcase videos to build trust
 */
export const VIDEO_CONTENT: VideoContent[] = [
  {
    id: '1',
    title: 'Unboxing Gấu Bông Teddy Hồng',
    thumbnail: 'https://placehold.co/800x450/fce7f3/ec4899?text=Unboxing+Video',
    duration: '3:45',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    type: 'unboxing',
    description: 'Xem quá trình mở hộp và kiểm tra chất lượng sản phẩm',
  },
  {
    id: '2',
    title: 'Trẻ Em Chơi Với Gấu Bông Capybara',
    thumbnail: 'https://placehold.co/800x450/d1fae5/10b981?text=Kids+Playing',
    duration: '2:20',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    type: 'in-use',
    description: 'Gấu bông trong cuộc sống thực tế, trẻ em vui chơi an toàn',
  },
  {
    id: '3',
    title: 'So Sánh Kích Thước Gấu Bông',
    thumbnail: 'https://placehold.co/800x450/dbeafe/3b82f6?text=Size+Comparison',
    duration: '4:10',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    type: 'comparison',
    description: 'So sánh các kích thước S, M, L, XL để chọn phù hợp',
  },
  {
    id: '4',
    title: 'Chất Lượng Và Chi Tiết Sản Phẩm',
    thumbnail: 'https://placehold.co/800x450/fef3c7/f59e0b?text=Quality+Close-up',
    duration: '3:15',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
    type: 'quality',
    description: 'Xem chi tiết chất liệu, đường may và độ mềm mại',
  },
];
