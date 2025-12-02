This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
DATABASE_SCHEMA.md
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/robots.txt
public/vercel.svg
public/window.svg
README.md
src/app/(shop)/(content)/about/page.tsx
src/app/(shop)/(content)/blog/page.tsx
src/app/(shop)/(content)/store/page.tsx
src/app/(shop)/api/cart/route.ts
src/app/(shop)/api/checkout/route.ts
src/app/(shop)/api/products/route.ts
src/app/(shop)/cart/page.tsx
src/app/(shop)/checkout/page.tsx
src/app/(shop)/checkout/success/page.tsx
src/app/(shop)/products/[slug]/page.tsx
src/app/(shop)/products/page.tsx
src/app/favicon.ico
src/app/layout.tsx
src/app/page.tsx
src/components/cart/CartItem.tsx
src/components/cart/UpsellServices.tsx
src/components/filter/FilterSidebar.tsx
src/components/layout/Footer.tsx
src/components/layout/Header.tsx
src/components/layout/MobileMenu.tsx
src/components/product/ProductCard.tsx
src/components/product/ProductGallery.tsx
src/components/product/SizeGuideModal.tsx
src/components/product/VariantSelector.tsx
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Modal.tsx
src/lib/api-contracts/cart.ts
src/lib/api-contracts/checkout.ts
src/lib/api-contracts/index.ts
src/lib/api-contracts/products.ts
src/lib/constants.ts
src/lib/data/products.ts
src/lib/db.ts
src/lib/schemas/cart.ts
src/lib/schemas/index.ts
src/lib/schemas/order.ts
src/lib/schemas/product.ts
src/lib/utils.ts
src/store/useCartStore.ts
src/styles/globals.css
src/types/index.ts
tsconfig.json
```

# Files

## File: DATABASE_SCHEMA.md
````markdown
# Database Schema & API Contracts Documentation

## MongoDB Schema Definitions

### 1. Product Schema

```typescript
interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  
  // Price range (calculated from variants)
  minPrice: number;
  maxPrice?: number;
  
  images: string[];
  variants: ProductVariant[]; // Nested array
  
  isHot: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  
  metaTitle?: string;
  metaDescription?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  _id?: ObjectId;
  id: string;
  size: string; // "80cm", "1m2", "1m5", "2m"
  price: number;
  stock: number;
  image?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}
```

**Key Points:**
- Variants are nested within Product document
- `minPrice` and `maxPrice` are calculated fields for quick listing display
- Each variant has its own `id`, `size`, `price`, and `stock`

---

### 2. Order Schema

```typescript
interface Order {
  _id?: ObjectId;
  orderId: string; // "ORD-1234567890-0001"
  
  userId?: string;
  guestEmail: string;
  
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingFee: number;
  shippingMethod: 'standard' | 'express';
  
  // CRITICAL: Upsell Services tracking
  upsellServices: {
    vacuumSealing: boolean;
    isGiftWrapped: boolean;
    giftWrapFee: number;
    expressShipping: boolean;
  };
  
  // Pricing breakdown
  subtotal: number;
  upsellTotal: number;
  shippingTotal: number;
  total: number;
  
  paymentDetails: PaymentDetails;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Points:**
- `upsellServices` object tracks all applied services
- `giftWrapFee` stores the actual fee charged
- All totals are calculated and stored for audit trail

---

### 3. Cart Schema

```typescript
interface Cart {
  _id?: ObjectId;
  userId?: string;
  sessionId?: string;
  
  items: CartItem[];
  upsellServices: UpsellServices;
  
  subtotal: number;
  upsellTotal: number;
  shippingFee: number;
  total: number;
  
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

interface CartItem {
  productId: string;
  variantId: string; // CRITICAL: Links to specific variant
  name: string;
  size: string;
  price: number; // Snapshot price
  quantity: number;
  image: string;
}
```

**Key Points:**
- `variantId` is critical for linking to specific Product variant
- Price is snapshot at time of adding to cart
- Cart can be user-based or session-based

---

## API Contracts

### 1. GET /api/products

**Purpose:** Fetch products with filtering

**Query Parameters:**
- `category?: string` - Filter by category
- `minPrice?: number` - Minimum price
- `maxPrice?: number` - Maximum price
- `size?: string` - Filter by variant size
- `tags?: string` - Comma-separated tags
- `isHot?: boolean` - Hot products only
- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 12)
- `sort?: string` - Sort order

**Example Request:**
```
GET /api/products?category=teddy&minPrice=100000&size=1m2&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "1",
        "name": "Gấu Bông Teddy",
        "slug": "gau-bong-teddy",
        "category": "teddy",
        "tags": ["Best Seller"],
        "minPrice": 250000,
        "maxPrice": 450000,
        "images": ["/images/teddy-1.jpg"],
        "isHot": true,
        "variantCount": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "applied": { "category": "teddy" },
      "available": {
        "categories": [...],
        "priceRange": { "min": 200000, "max": 800000 },
        "sizes": [...],
        "tags": [...]
      }
    }
  }
}
```

---

### 2. POST /api/cart

**Purpose:** Add variant to cart

**Request Body:**
```json
{
  "productId": "1",
  "variantId": "v1-2",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "productId": "1",
          "variantId": "v1-2",
          "name": "Gấu Bông Teddy",
          "size": "1m2",
          "price": 350000,
          "quantity": 2,
          "image": "/images/teddy-1m2.jpg"
        }
      ],
      "upsellServices": {
        "vacuumSealing": false,
        "giftWrapping": false,
        "expressShipping": false
      },
      "subtotal": 700000,
      "upsellTotal": 0,
      "shippingFee": 30000,
      "total": 730000
    },
    "totals": {
      "subtotal": 700000,
      "upsellTotal": 0,
      "shippingFee": 30000,
      "total": 730000,
      "itemCount": 2
    }
  }
}
```

---

### 3. POST /api/checkout

**Purpose:** Create order with upsell services

**Request Body:**
```json
{
  "userId": "user123",
  "guestEmail": "customer@email.com",
  "items": [
    {
      "productId": "1",
      "variantId": "v1-2",
      "name": "Gấu Bông Teddy",
      "size": "1m2",
      "price": 350000,
      "quantity": 1,
      "image": "/images/teddy-1m2.jpg"
    }
  ],
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "customer@email.com",
    "address": "123 Đường ABC",
    "ward": "Phường 1",
    "district": "Quận 1",
    "city": "TP. Hồ Chí Minh",
    "note": "Giao vào giờ hành chính"
  },
  "shippingMethod": "standard",
  "upsellServices": {
    "vacuumSealing": true,
    "isGiftWrapped": true,
    "giftWrapFee": 30000,
    "expressShipping": false
  },
  "paymentDetails": {
    "method": "cod"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-1704123456-0001",
    "order": {
      "id": "ORD-1704123456-0001",
      "status": "pending",
      "total": 410000,
      "itemCount": 1,
      "paymentMethod": "cod",
      "estimatedDelivery": "2024-01-05T10:00:00Z"
    },
    "message": "Đơn hàng đã được tạo thành công"
  }
}
```

---

## Implementation Notes

### MongoDB Collections

1. **products** - Product documents with nested variants
2. **orders** - Order documents with upsell services tracking
3. **carts** - User/session carts
4. **users** - User accounts (optional)

### Security Considerations

1. **Price Validation:** Server always recalculates totals
2. **Stock Validation:** Check variant stock before adding to cart
3. **Input Validation:** All user inputs are validated
4. **Type Safety:** TypeScript interfaces ensure type safety

### TODO for Production

1. Implement MongoDB connection and queries
2. Add authentication middleware
3. Implement payment gateway integration (MoMo, VNPay)
4. Add email notifications
5. Implement order tracking system
6. Add inventory management
7. Add analytics and reporting
````

## File: public/robots.txt
````
# Cấu hình SEO
User-agent: *
Allow: /
````

## File: src/app/(shop)/(content)/about/page.tsx
````typescript
// Câu chuyện thương hiệu
import { Heart, Sparkles, Users, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng tôi - The Emotional House',
  description: 'Câu chuyện về The Emotional House - Nơi gắn kết cảm xúc qua những chú gấu bông đầy yêu thương.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-6xl">🐻</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Câu chuyện của chúng tôi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The Emotional House được sinh ra từ niềm tin rằng mỗi chú gấu bông không chỉ là một món đồ chơi,
            mà còn là người bạn đồng hành, mang theo những cảm xúc và kỷ niệm đẹp nhất.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Chúng tôi mong muốn mang đến những chú gấu bông chất lượng cao, được làm từ nguyên liệu an toàn,
                với thiết kế đáng yêu và đầy cảm xúc. Mỗi sản phẩm đều được chăm chút tỉ mỉ để trở thành
                món quà ý nghĩa cho những người thân yêu.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Từ những dịp đặc biệt như sinh nhật, tốt nghiệp, Valentine đến những khoảnh khắc đơn giản
                trong cuộc sống, chúng tôi tin rằng một chú gấu bông có thể truyền tải tình cảm một cách
                chân thành và ấm áp nhất.
              </p>
            </div>
            <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-400 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Giá trị cốt lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tình yêu</h3>
              <p className="text-gray-600">
                Mỗi sản phẩm đều được tạo ra với tình yêu và sự chăm chút, để mang lại niềm vui cho khách hàng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chất lượng</h3>
              <p className="text-gray-600">
                Chúng tôi cam kết sử dụng nguyên liệu cao cấp, an toàn và bền đẹp cho mọi sản phẩm.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Dịch vụ</h3>
              <p className="text-gray-600">
                Đội ngũ tư vấn nhiệt tình, hỗ trợ khách hàng 24/7 và dịch vụ gói quà tận tâm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hành trình của chúng tôi
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Khởi đầu</h3>
                <p className="text-gray-600">
                  The Emotional House được thành lập với mong muốn đơn giản: tạo ra những chú gấu bông
                  không chỉ đẹp mà còn mang ý nghĩa sâu sắc, trở thành người bạn đồng hành trong cuộc sống.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phát triển</h3>
                <p className="text-gray-600">
                  Qua nhiều năm, chúng tôi đã mở rộng danh mục sản phẩm với nhiều kích thước và nhân vật khác nhau,
                  từ gấu bông cổ điển đến các nhân vật hoạt hình được yêu thích.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tương lai</h3>
                <p className="text-gray-600">
                  Chúng tôi tiếp tục đổi mới và cải thiện, luôn lắng nghe phản hồi từ khách hàng để mang đến
                  những trải nghiệm tốt nhất. Mục tiêu của chúng tôi là trở thành thương hiệu gấu bông
                  được tin yêu nhất tại Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hãy cùng chúng tôi tạo nên những kỷ niệm đẹp
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Khám phá bộ sưu tập gấu bông của chúng tôi và tìm người bạn đồng hành hoàn hảo cho bạn.
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
          >
            Xem sản phẩm
          </a>
        </div>
      </section>
    </div>
  );
}
````

## File: src/app/(shop)/(content)/blog/page.tsx
````typescript
// Trang tin tức (Góc của Gấu)
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Góc của Gấu - Blog The Emotional House',
  description: 'Những câu chuyện, mẹo vặt và tin tức về gấu bông từ The Emotional House.',
};

// Mock blog posts data
const blogPosts = [
  {
    id: '1',
    title: 'Cách chọn gấu bông phù hợp cho từng dịp',
    excerpt: 'Gấu bông không chỉ là món quà mà còn là người bạn đồng hành. Hãy cùng tìm hiểu cách chọn gấu bông phù hợp cho từng dịp đặc biệt...',
    author: 'The Emotional House',
    date: '2024-12-01',
    image: '/images/blog/post-1.jpg',
    category: 'Mẹo vặt',
  },
  {
    id: '2',
    title: 'Lịch sử và ý nghĩa của gấu bông Teddy',
    excerpt: 'Teddy Bear đã trở thành biểu tượng của tình yêu và sự ấm áp. Khám phá câu chuyện đằng sau chú gấu bông nổi tiếng nhất thế giới...',
    author: 'The Emotional House',
    date: '2024-11-25',
    image: '/images/blog/post-2.jpg',
    category: 'Kiến thức',
  },
  {
    id: '3',
    title: 'Cách bảo quản gấu bông luôn như mới',
    excerpt: 'Gấu bông của bạn sẽ luôn mềm mại và đẹp như mới nếu bạn biết cách chăm sóc đúng cách. Hãy cùng học những mẹo bảo quản hiệu quả...',
    author: 'The Emotional House',
    date: '2024-11-18',
    image: '/images/blog/post-3.jpg',
    category: 'Chăm sóc',
  },
  {
    id: '4',
    title: 'Top 5 gấu bông được yêu thích nhất năm 2024',
    excerpt: 'Cùng điểm qua những chú gấu bông đang được khách hàng yêu thích nhất trong năm nay tại The Emotional House...',
    author: 'The Emotional House',
    date: '2024-11-10',
    image: '/images/blog/post-4.jpg',
    category: 'Sản phẩm',
  },
];

const categories = ['Tất cả', 'Mẹo vặt', 'Kiến thức', 'Chăm sóc', 'Sản phẩm'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Góc của Gấu 🐻
          </h1>
          <p className="text-xl text-pink-100">
            Những câu chuyện, mẹo vặt và tin tức về gấu bông
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    category === 'Tất cả'
                      ? 'bg-pink-600 text-white'
                      : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <Link href={`/blog/${post.id}`}>
                  {/* Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🐻</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-pink-600 font-medium group-hover:gap-2 transition-all">
                      <span>Đọc thêm</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đăng ký nhận tin
          </h2>
          <p className="text-gray-600 mb-8">
            Nhận những bài viết mới nhất và ưu đãi đặc biệt từ Góc của Gấu
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
````

## File: src/app/(shop)/(content)/store/page.tsx
````typescript
// Hệ thống cửa hàng
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hệ thống cửa hàng - The Emotional House',
  description: 'Tìm cửa hàng The Emotional House gần bạn nhất. Chúng tôi có mặt tại nhiều thành phố trên cả nước.',
};

const stores = [
  {
    id: '1',
    name: 'The Emotional House - TP. Hồ Chí Minh',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    phone: '028 1234 5678',
    email: 'hcm@emotionalhouse.vn',
    hours: '9:00 - 22:00 (Tất cả các ngày trong tuần)',
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: '2',
    name: 'The Emotional House - Hà Nội',
    address: '456 Đường Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
    phone: '024 9876 5432',
    email: 'hanoi@emotionalhouse.vn',
    hours: '9:00 - 22:00 (Tất cả các ngày trong tuần)',
    lat: 21.0285,
    lng: 105.8542,
  },
  {
    id: '3',
    name: 'The Emotional House - Đà Nẵng',
    address: '789 Đường Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    phone: '0236 5555 6666',
    email: 'danang@emotionalhouse.vn',
    hours: '9:00 - 21:30 (Tất cả các ngày trong tuần)',
    lat: 16.0544,
    lng: 108.2022,
  },
];

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <MapPin className="w-16 h-16 text-pink-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hệ thống cửa hàng
          </h1>
          <p className="text-xl text-gray-600">
            Tìm cửa hàng The Emotional House gần bạn nhất và đến trải nghiệm không gian đầy cảm xúc của chúng tôi
          </p>
        </div>
      </section>

      {/* Stores List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {store.name}
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.address}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <a
                      href={`tel:${store.phone.replace(/\s/g, '')}`}
                      className="text-gray-600 text-sm hover:text-pink-600 transition-colors"
                    >
                      {store.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <a
                      href={`mailto:${store.email}`}
                      className="text-gray-600 text-sm hover:text-pink-600 transition-colors"
                    >
                      {store.email}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.hours}</p>
                  </div>
                </div>

                {/* Map Button */}
                <button
                  className="mt-6 w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                  onClick={() => {
                    // In a real app, this would open Google Maps
                    window.open(
                      `https://www.google.com/maps?q=${store.lat},${store.lng}`,
                      '_blank'
                    );
                  }}
                >
                  Xem trên bản đồ
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Bản đồ cửa hàng
          </h2>
          <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <p className="text-gray-600">
                  Tích hợp Google Maps sẽ được hiển thị tại đây
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (Cần API key từ Google Maps Platform)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Không tìm thấy cửa hàng gần bạn?
          </h2>
          <p className="text-gray-600 mb-8">
            Đừng lo! Chúng tôi có dịch vụ giao hàng toàn quốc. Liên hệ với chúng tôi để được tư vấn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1900123456"
              className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Gọi ngay: 1900 123 456
            </a>
            <a
              href="mailto:hello@emotionalhouse.vn"
              className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold border-2 border-pink-600 hover:bg-pink-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email: hello@emotionalhouse.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
````

## File: src/app/(shop)/api/cart/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import type {
  AddToCartRequest,
  UpdateCartItemRequest,
  UpdateUpsellServicesRequest,
  CartResponse,
  CartErrorResponse,
} from '@/lib/api-contracts/cart';
import type { Cart, CartItem } from '@/lib/schemas/cart';
import { mockProducts } from '@/lib/data/products';

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const body: AddToCartRequest = await request.json();

    // Validate request
    if (!body.productId || !body.variantId || !body.quantity || body.quantity < 1) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Invalid request data',
        details: {
          message: 'productId, variantId, and quantity (>= 1) are required',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find product and variant
    const product = mockProducts.find((p) => p.id === body.productId);
    if (!product) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Product not found',
        details: {
          field: 'productId',
          message: `Product with ID ${body.productId} does not exist`,
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const variant = product.variants.find((v) => v.id === body.variantId);
    if (!variant) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Variant not found',
        details: {
          field: 'variantId',
          message: `Variant with ID ${body.variantId} does not exist for this product`,
        },
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check stock availability
    if (variant.stock < body.quantity) {
      const errorResponse: CartErrorResponse = {
        success: false,
        error: 'Insufficient stock',
        details: {
          message: `Only ${variant.stock} items available in stock`,
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create cart item
    const cartItem: CartItem = {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      size: variant.size,
      price: variant.price,
      quantity: body.quantity,
      image: variant.image || product.images[0] || '',
    };

    // TODO: Get or create cart from database
    // For now, return the cart item structure
    // In real implementation, you would:
    // 1. Get user's cart (from session or userId)
    // 2. Check if item already exists, update quantity if so
    // 3. Add new item if not exists
    // 4. Recalculate totals
    // 5. Save to database

    const mockCart: Cart = {
      items: [cartItem],
      upsellServices: {
        vacuumSealing: false,
        giftWrapping: false,
        expressShipping: false,
      },
      subtotal: cartItem.price * cartItem.quantity,
      upsellTotal: 0,
      shippingFee: 30000,
      total: cartItem.price * cartItem.quantity + 30000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response: CartResponse = {
      success: true,
      data: {
        cart: mockCart,
        totals: {
          subtotal: mockCart.subtotal,
          upsellTotal: mockCart.upsellTotal,
          shippingFee: mockCart.shippingFee,
          total: mockCart.total,
          itemCount: mockCart.items.reduce((sum, item) => sum + item.quantity, 0),
        },
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Add to cart API error:', error);
    const errorResponse: CartErrorResponse = {
      success: false,
      error: 'Failed to add item to cart',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT /api/cart/upsell-services
 * Update upsell services
 */
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Check if it's upsell-services update
    if (url.pathname.includes('upsell-services')) {
      const body: UpdateUpsellServicesRequest = await request.json();
      
      // TODO: Update cart's upsell services in database
      // For now, return mock response
      const mockCart: Cart = {
        items: [],
        upsellServices: {
          vacuumSealing: body.upsellServices.vacuumSealing ?? false,
          giftWrapping: body.upsellServices.giftWrapping ?? false,
          expressShipping: body.upsellServices.expressShipping ?? false,
        },
        subtotal: 0,
        upsellTotal: body.upsellServices.giftWrapping ? 30000 : 0,
        shippingFee: body.upsellServices.expressShipping ? 50000 : 30000,
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response: CartResponse = {
        success: true,
        data: {
          cart: mockCart,
          totals: {
            subtotal: mockCart.subtotal,
            upsellTotal: mockCart.upsellTotal,
            shippingFee: mockCart.shippingFee,
            total: mockCart.total,
            itemCount: 0,
          },
        },
      };

      return NextResponse.json(response);
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
  } catch (error) {
    console.error('Update cart API error:', error);
    const errorResponse: CartErrorResponse = {
      success: false,
      error: 'Failed to update cart',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
````

## File: src/app/(shop)/api/checkout/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import type { CheckoutRequest, CheckoutResponse, CheckoutErrorResponse } from '@/lib/api-contracts/checkout';
import type { Order, ShippingAddress, UpsellServices as OrderUpsellServices, PaymentDetails } from '@/lib/schemas/order';

// Using CheckoutRequest from api-contracts

// Validate request data (using CheckoutRequest from contracts)
function validateCheckoutRequest(data: unknown): data is CheckoutRequest {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const d = data as Record<string, unknown>;
  
  if (!d.items || !Array.isArray(d.items) || d.items.length === 0) {
    return false;
  }
  if (!d.shippingInfo || typeof d.shippingInfo !== 'object') {
    return false;
  }
  if (!d.paymentMethod || typeof d.paymentMethod !== 'string') {
    return false;
  }
  if (typeof d.subtotal !== 'number' || d.subtotal <= 0) {
    return false;
  }
  if (typeof d.total !== 'number' || d.total <= 0) {
    return false;
  }
  return true;
}

// Validate shipping info
function validateShippingInfo(info: ShippingAddress): { valid: boolean; error?: string } {
  if (!info.fullName?.trim()) {
    return { valid: false, error: 'Họ tên không được để trống' };
  }
  if (!info.phone?.trim()) {
    return { valid: false, error: 'Số điện thoại không được để trống' };
  }
  if (!/^(0|\+84)[0-9]{9,10}$/.test(info.phone.replace(/\s/g, ''))) {
    return { valid: false, error: 'Số điện thoại không hợp lệ' };
  }
  if (!info.email?.trim()) {
    return { valid: false, error: 'Email không được để trống' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }
  if (!info.address?.trim()) {
    return { valid: false, error: 'Địa chỉ không được để trống' };
  }
  if (!info.ward?.trim()) {
    return { valid: false, error: 'Phường/Xã không được để trống' };
  }
  if (!info.district?.trim()) {
    return { valid: false, error: 'Quận/Huyện không được để trống' };
  }
  if (!info.city?.trim()) {
    return { valid: false, error: 'Thành phố không được để trống' };
  }
  return { valid: true };
}

// Generate order ID
function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
}

// Simulate order creation (in real app, save to database)
async function createOrder(data: CheckoutRequest): Promise<Order> {
  const orderId = generateOrderId();
  
  // Calculate totals server-side for security
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const upsellTotal = data.upsellServices.isGiftWrapped ? data.upsellServices.giftWrapFee : 0;
  const shippingFee = data.upsellServices.expressShipping ? 50000 : 30000;
  const total = subtotal + upsellTotal + shippingFee;
  
  // Map upsell services to schema format
  const upsellServices: OrderUpsellServices = {
    vacuumSealing: data.upsellServices.vacuumSealing,
    isGiftWrapped: data.upsellServices.isGiftWrapped,
    giftWrapFee: data.upsellServices.giftWrapFee || 0,
    expressShipping: data.upsellServices.expressShipping,
  };
  
  const paymentDetails: PaymentDetails = {
    method: data.paymentDetails.method,
    status: 'pending',
    amount: total,
  };
  
  const order: Order = {
    orderId,
    guestEmail: data.guestEmail,
    userId: data.userId,
    items: data.items,
    shippingAddress: data.shippingAddress,
    shippingFee,
    shippingMethod: data.shippingMethod || 'standard',
    upsellServices,
    subtotal,
    upsellTotal,
    shippingTotal: shippingFee,
    total,
    paymentDetails,
    orderStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // TODO: Save to database (MongoDB, PostgreSQL, etc.)
  // await db.orders.insertOne(order);
  
  // TODO: Send confirmation email
  // await sendOrderConfirmationEmail(order);
  
  // TODO: Process payment based on payment method
  // if (data.paymentMethod === 'momo' || data.paymentMethod === 'vnpay') {
  //   const paymentResult = await processPayment(order);
  //   if (!paymentResult.success) {
  //     throw new Error('Payment processing failed');
  //   }
  // }

  return order;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request structure
    if (!validateCheckoutRequest(body)) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.' },
        { status: 400 }
      );
    }

    // Validate shipping info
    const shippingValidation = validateShippingInfo(body.shippingAddress);
    if (!shippingValidation.valid) {
      return NextResponse.json(
        { error: shippingValidation.error },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'bank_transfer', 'momo', 'vnpay'];
    if (!validPaymentMethods.includes(body.paymentDetails.method)) {
      return NextResponse.json(
        { error: 'Phương thức thanh toán không hợp lệ' },
        { status: 400 }
      );
    }
    
    // Validate guest email
    if (!body.guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.guestEmail)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Create order
    const order = await createOrder(body);

    // TODO: Save to MongoDB
    // const { orders } = await getCollections();
    // await orders.insertOne(order);

    // Return success response
    const response: CheckoutResponse = {
      success: true,
      data: {
        orderId: order.orderId,
        order: {
          id: order.orderId,
          status: order.orderStatus,
          total: order.total,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          paymentMethod: order.paymentDetails.method,
          estimatedDelivery: order.estimatedDelivery?.toISOString(),
        },
        message: 'Đơn hàng đã được tạo thành công',
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Checkout API error:', error);
    const errorResponse: CheckoutErrorResponse = {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET endpoint to retrieve order status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch order from MongoDB
    // const { orders } = await getCollections();
    // const order = await orders.findOne({ orderId });
    // 
    // if (!order) {
    //   return NextResponse.json(
    //     { success: false, error: 'Order not found' },
    //     { status: 404 }
    //   );
    // }
    
    // For now, return mock response
    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: 'pending' as const,
        total: 0,
        itemCount: 0,
        shippingAddress: {} as ShippingAddress,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get order API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve order',
      },
      { status: 500 }
    );
  }
}
````

## File: src/app/(shop)/api/products/route.ts
````typescript
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
````

## File: src/app/(shop)/cart/page.tsx
````typescript
'use client';

// Giỏ hàng với CartItem và UpsellServices
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartItem from '@/components/cart/CartItem';
import UpsellServices from '@/components/cart/UpsellServices';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    clearCart,
    getSubtotal,
    getUpsellTotal,
    getShippingFee,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const upsellTotal = getUpsellTotal();
  const shippingFee = getShippingFee();
  const total = getTotalPrice();
  const totalItems = getTotalItems();

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
            <p className="text-gray-600">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Tiếp tục mua sắm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-600">
            Bạn có {totalItems} {totalItems === 1 ? 'sản phẩm' : 'sản phẩm'} trong giỏ hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items & Upsell Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Sản phẩm ({items.length})
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa tất cả
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                ))}
              </div>
            </div>

            {/* Upsell Services */}
            <UpsellServices />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {upsellTotal > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dịch vụ bổ sung</span>
                    <span>{formatCurrency(upsellTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-pink-600">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-pink-600 text-white text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 transition-colors mb-4"
              >
                Thanh toán
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block w-full text-center text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium"
              >
                ← Tiếp tục mua sắm
              </Link>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/(shop)/checkout/page.tsx
````typescript
'use client';

// Trang thanh toán với form đầy đủ
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import type { ShippingInfo, PaymentMethod } from '@/types';
import { CreditCard, Truck, MapPin, User, Phone, Mail, FileText, Lock } from 'lucide-react';
import CartItem from '@/components/cart/CartItem';
import UpsellServices from '@/components/cart/UpsellServices';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    upsellServices,
    getSubtotal,
    getUpsellTotal,
    getShippingFee,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const subtotal = getSubtotal();
  const upsellTotal = getUpsellTotal();
  const shippingFee = getShippingFee();
  const total = getTotalPrice();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    if (!shippingInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã';
    }
    if (!shippingInfo.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'Vui lòng nhập thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestEmail: shippingInfo.email,
          items,
          shippingAddress: shippingInfo,
          shippingMethod: upsellServices.expressShipping ? 'express' : 'standard',
          upsellServices: {
            vacuumSealing: upsellServices.vacuumSealing,
            isGiftWrapped: upsellServices.giftWrapping,
            giftWrapFee: upsellServices.giftWrapping ? 30000 : 0,
            expressShipping: upsellServices.expressShipping,
          },
          paymentDetails: {
            method: paymentMethod,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi xử lý đơn hàng');
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ShippingInfo,
    value: string
  ) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất thông tin để đặt hàng</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Truck className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0901234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Địa chỉ cụ thể *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Số nhà, tên đường"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Ward */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Phường 1"
                    />
                    {errors.ward && (
                      <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quận 1"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="TP. Hồ Chí Minh"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Note */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={shippingInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Lưu ý cho người giao hàng..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💰' },
                    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                    { value: 'momo', label: 'Ví MoMo', icon: '💳' },
                    { value: 'vnpay', label: 'VNPay', icon: '💳' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.value
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cart Items Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Sản phẩm đã chọn ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </div>
              </div>

              {/* Upsell Services */}
              <UpsellServices />
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-pink-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {upsellTotal > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Dịch vụ bổ sung</span>
                      <span>{formatCurrency(upsellTotal)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatCurrency(shippingFee)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold text-pink-600">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Đặt hàng
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc đặt hàng, bạn đồng ý với{' '}
                  <a href="/terms" className="text-pink-600 hover:underline">
                    Điều khoản sử dụng
                  </a>{' '}
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
````

## File: src/app/(shop)/checkout/success/page.tsx
````typescript
'use client';

// Trang thành công sau khi đặt hàng
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã đặt hàng tại The Emotional House
          </p>
          <p className="text-gray-500">
            Mã đơn hàng: <span className="font-semibold text-pink-600">{orderId}</span>
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-pink-600" />
              <div>
                <p className="font-medium text-gray-900">Trạng thái đơn hàng</p>
                <p className="text-sm text-gray-600">Đang xử lý</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Email xác nhận</p>
                <p className="text-sm text-gray-600">
                  Đã gửi đến email của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-pink-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Bước tiếp theo</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li>1. Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút</li>
            <li>2. Đơn hàng sẽ được đóng gói và giao trong 1-3 ngày</li>
            <li>3. Bạn sẽ nhận được thông báo khi đơn hàng được giao</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>

        {/* Auto redirect notice */}
        {countdown > 0 && (
          <p className="text-sm text-gray-500 mt-6">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </p>
        )}
      </div>
    </div>
  );
}
````

## File: src/app/(shop)/products/[slug]/page.tsx
````typescript
'use client';

// Trang chi tiết sản phẩm (Dynamic Route)
import { useState, useCallback } from 'react';
import { ShoppingCart, Heart, Share2, Ruler, Star, Check } from 'lucide-react';
import Image from 'next/image';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import SizeGuideModal from '@/components/product/SizeGuideModal';
import { getProductBySlug } from '@/lib/data/products';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import type { Variant } from '@/types';

interface ProductDetailPageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductBySlug(params.slug);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product?.variants[0] || null
  );
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-4">
            Sản phẩm bạn đang tìm kiếm không tồn tại.
          </p>
          <a
            href="/products"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Quay lại danh sách sản phẩm
          </a>
        </div>
      </div>
    );
  }

  const handleVariantChange = useCallback((variant: Variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image || product.images[0],
    });
  };

  const currentPrice = selectedVariant?.price || product.basePrice;
  const displayImage = selectedVariant?.image || product.images[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              selectedVariant={selectedVariant || undefined}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category & Tags */}
            <div>
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-3">
                {product.category}
              </span>
              {product.isHot && (
                <span className="ml-2 inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  Hot
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-600">(4.8/5 - 128 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-pink-600">
                {formatCurrency(currentPrice)}
              </span>
              {product.maxPrice && product.maxPrice > product.basePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatCurrency(product.maxPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Phù hợp cho</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cream-100 text-brown-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Chọn kích thước</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium"
                >
                  <Ruler className="w-4 h-4" />
                  Hướng dẫn chọn size
                </button>
              </div>
              <VariantSelector
                product={product}
                selectedVariantId={selectedVariant?.id}
                onVariantChange={handleVariantChange}
              />
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Số lượng</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 min-w-[4rem] text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          selectedVariant?.stock || 1,
                          quantity + 1
                        )
                      )
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-gray-600">
                    Còn {selectedVariant.stock} sản phẩm
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ hàng
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                  Yêu thích
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-pink-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Đặc điểm nổi bật</h3>
              <div className="space-y-2">
                {[
                  'Chất liệu cao cấp, mềm mại',
                  'An toàn cho trẻ em',
                  'Dễ dàng vệ sinh',
                  'Bảo hành 6 tháng',
                  'Giao hàng toàn quốc',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        variants={product.variants}
      />
    </div>
  );
}
````

## File: src/app/(shop)/products/page.tsx
````typescript
'use client';

// Trang danh sách sản phẩm - Liệt kê + Bộ lọc (Filter)
import { useState, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar, { type FilterState } from '@/components/filter/FilterSidebar';
import { mockProducts, filterProducts } from '@/lib/data/products';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    categories: [],
    sizes: [],
    occasions: [],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Apply filters
  const filteredProducts = useMemo(() => {
    return filterProducts(mockProducts, filters);
  }, [filters]);

  const activeFilterCount = Object.values(filters).flat().length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tìm thấy {filteredProducts.length} sản phẩm
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
              onApplyFilters={(newFilters) => {
                setFilters(newFilters);
              }}
            />
          </aside>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApplyFilters={(newFilters) => {
              setFilters(newFilters);
              setIsFilterOpen(false);
            }}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [],
                      categories: [],
                      sizes: [],
                      occasions: [],
                    });
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Emotional House - Gấu Bông Cao Cấp",
  description: "Cửa hàng gấu bông với tình yêu và cảm xúc. Sản phẩm chất lượng cao, nhiều kích thước và dịch vụ gói quà.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
````

## File: src/app/page.tsx
````typescript
'use client';

import Link from 'next/link';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/data/products';

export default function Home() {
  // Get hot products
  const hotProducts = mockProducts.filter((p) => p.isHot).slice(0, 6);
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 via-pink-400 to-pink-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                The Emotional House
                <br />
                <span className="text-pink-100">Gấu Bông Đầy Cảm Xúc</span>
              </h1>
              <p className="text-xl md:text-2xl text-pink-100 mb-8 leading-relaxed">
                Mỗi chú gấu bông là một câu chuyện, một kỷ niệm đẹp. 
                Tìm người bạn đồng hành hoàn hảo cho bạn và người thân yêu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
                >
                  Khám phá sản phẩm
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-pink-600/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-600/30 transition-colors"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="text-9xl animate-bounce">🐻</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chất lượng cao cấp
              </h3>
              <p className="text-gray-600">
                Nguyên liệu an toàn, mềm mại và bền đẹp
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nhiều kích thước
              </h3>
              <p className="text-gray-600">
                Từ 80cm đến 2m, phù hợp mọi không gian
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-pink-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-pink-600 fill-current" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dịch vụ tận tâm
              </h3>
              <p className="text-gray-600">
                Gói quà đẹp, giao hàng nhanh, hỗ trợ 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Products Section */}
      {hotProducts.length > 0 && (
        <section className="py-16 bg-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sản phẩm Hot 🔥
                </h2>
                <p className="text-gray-600">
                  Những sản phẩm được yêu thích nhất
                </p>
              </div>
              <Link
                href="/products?filter=hot"
                className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Khám phá bộ sưu tập đa dạng của chúng tôi
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tìm người bạn đồng hành hoàn hảo?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Khám phá bộ sưu tập gấu bông đa dạng của chúng tôi
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
````

## File: src/components/cart/CartItem.tsx
````typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
    } else {
      updateQuantity(item.productId, item.variantId, newQuantity);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.productId, item.variantId);
      setIsRemoving(false);
    }, 200);
  };

  return (
    <div
      className={`flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all ${
        isRemoving ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🐻</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="block hover:text-pink-600 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">Kích thước: {item.size}</p>
        
        {/* Price */}
        <p className="text-lg font-bold text-pink-600 mb-3">
          {formatCurrency(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-600 hover:bg-pink-50 rounded-lg transition-colors"
              aria-label="Save for later"
              title="Lưu để mua sau"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item"
              title="Xóa sản phẩm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <p className="text-sm text-gray-600 mt-2">
          Tổng: <span className="font-semibold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </p>
      </div>
    </div>
  );
}
````

## File: src/components/cart/UpsellServices.tsx
````typescript
'use client';

// Checkbox gói quà, hút chân không
// Vacuum Sealing: Free, Gift Wrapping: +30,000 VND, Express Shipping: Conditional
import { useCartStore } from '@/store/useCartStore';
import { UPSELL_SERVICES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Gift, Package, Truck } from 'lucide-react';

export default function UpsellServices() {
  const { upsellServices, updateUpsellServices, getUpsellTotal } = useCartStore();

  const handleToggle = (service: keyof typeof upsellServices) => {
    updateUpsellServices({
      [service]: !upsellServices[service],
    });
  };

  return (
    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Dịch vụ bổ sung
      </h3>

      {/* Vacuum Sealing - Free */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.vacuumSealing}
          onChange={() => handleToggle('vacuumSealing')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.VACUUM_SEALING.name}
            </span>
            <span className="text-sm text-green-600 font-semibold">Miễn phí</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.VACUUM_SEALING.description}
          </p>
        </div>
      </label>

      {/* Gift Wrapping - Paid */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.giftWrapping}
          onChange={() => handleToggle('giftWrapping')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.GIFT_WRAPPING.name}
            </span>
            <span className="text-sm text-pink-600 font-semibold">
              +{formatCurrency(UPSELL_SERVICES.GIFT_WRAPPING.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.GIFT_WRAPPING.description}
          </p>
        </div>
      </label>

      {/* Express Shipping - Conditional */}
      <label className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-colors">
        <input
          type="checkbox"
          checked={upsellServices.expressShipping}
          onChange={() => handleToggle('expressShipping')}
          className="mt-1 w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-pink-600" />
            <span className="font-medium text-gray-900">
              {UPSELL_SERVICES.EXPRESS_SHIPPING.name}
            </span>
            <span className="text-sm text-pink-600 font-semibold">
              +{formatCurrency(UPSELL_SERVICES.EXPRESS_SHIPPING.price)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {UPSELL_SERVICES.EXPRESS_SHIPPING.description}
          </p>
        </div>
      </label>

      {/* Total Upsell Price */}
      {getUpsellTotal() > 0 && (
        <div className="pt-4 border-t border-pink-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tổng phí dịch vụ:</span>
            <span className="text-lg font-bold text-pink-600">
              {formatCurrency(getUpsellTotal())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
````

## File: src/components/filter/FilterSidebar.tsx
````typescript
'use client';

// Component bộ lọc
// Filter by: Price Range, Character, Size, Occasion
import { useState } from 'react';
import { CATEGORIES, SIZES, OCCASIONS, PRICE_RANGES } from '@/lib/constants';
import { formatPriceRange } from '@/lib/utils';
import { X, Filter } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: string[];
  categories: string[];
  sizes: string[];
  occasions: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onApplyFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    categories: [],
    sizes: [],
    occasions: [],
  });

  const toggleFilter = (
    type: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: newValues };
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [],
      categories: [],
      sizes: [],
      occasions: [],
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const hasActiveFilters =
    filters.priceRange.length > 0 ||
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.occasions.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:z-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto lg:relative lg:shadow-none lg:w-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-pink-600" />
              <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Khoảng giá</h3>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.priceRange.includes(range.value)}
                    onChange={() => toggleFilter('priceRange', range.value)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Character/Category */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Nhân vật</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.value)}
                    onChange={() => toggleFilter('categories', category.value)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Kích thước</h3>
            <div className="space-y-2">
              {SIZES.map((size) => (
                <label
                  key={size.value}
                  className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size.value)}
                    onChange={() => toggleFilter('sizes', size.value)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Dịp</h3>
            <div className="space-y-2">
              {OCCASIONS.map((occasion) => (
                <label
                  key={occasion.value}
                  className="flex items-center gap-2 p-2 hover:bg-pink-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.occasions.includes(occasion.value)}
                    onChange={() => toggleFilter('occasions', occasion.value)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{occasion.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <button
              onClick={handleApply}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Áp dụng ({Object.values(filters).flat().length})
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/layout/Footer.tsx
````typescript
'use client';

// Footer component với links và thông tin liên hệ
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Tất cả sản phẩm', href: '/products' },
    { name: 'Gấu bông mới', href: '/products?filter=new' },
    { name: 'Sản phẩm hot', href: '/products?filter=hot' },
    { name: 'Khuyến mãi', href: '/products?filter=sale' },
  ],
  support: [
    { name: 'Hướng dẫn mua hàng', href: '/help/shopping-guide' },
    { name: 'Chính sách đổi trả', href: '/help/return-policy' },
    { name: 'Chính sách bảo hành', href: '/help/warranty' },
    { name: 'Vận chuyển', href: '/help/shipping' },
  ],
  company: [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Góc của Gấu', href: '/blog' },
    { name: 'Hệ thống cửa hàng', href: '/store' },
    { name: 'Tuyển dụng', href: '/careers' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Youtube', icon: Youtube, href: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-white border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">🐻</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">The Emotional House</h3>
                <p className="text-xs text-gray-600">Gấu bông cao cấp</p>
              </div>
            </Link>
            <p className="text-sm text-gray-600">
              Mang đến những chú gấu bông đầy cảm xúc, gắn kết tình yêu và kỷ niệm đẹp.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-700" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Cửa hàng</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hotline</p>
                  <a
                    href="tel:1900123456"
                    className="text-sm text-gray-600 hover:text-pink-600"
                  >
                    1900 123 456
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:hello@emotionalhouse.vn"
                    className="text-sm text-gray-600 hover:text-pink-600"
                  >
                    hello@emotionalhouse.vn
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                  <p className="text-sm text-gray-600">
                    123 Đường ABC, Quận XYZ<br />
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {new Date().getFullYear()} The Emotional House. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-pink-600 fill-current" />
              <span>in Vietnam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
````

## File: src/components/layout/Header.tsx
````typescript
'use client';

// Header component với navigation, search, cart
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, Heart, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import MobileMenu from './MobileMenu';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Sản phẩm', href: '/products' },
  { name: 'Góc của Gấu', href: '/blog' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Cửa hàng', href: '/store' },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white text-xl font-bold">🐻</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">The Emotional House</h1>
                <p className="text-xs text-gray-500">Gấu bông cao cấp</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-pink-100 text-pink-700'
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {isSearchOpen && (
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        pathname={pathname}
        cartItemCount={cartItemCount}
      />
    </>
  );
}
````

## File: src/components/layout/MobileMenu.tsx
````typescript
'use client';

// MobileMenu component với hamburger menu
import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Heart, User, Home, Package, BookOpen, Info, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  pathname: string | null;
  cartItemCount: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'Trang chủ': <Home className="w-5 h-5" />,
  'Sản phẩm': <Package className="w-5 h-5" />,
  'Góc của Gấu': <BookOpen className="w-5 h-5" />,
  'Về chúng tôi': <Info className="w-5 h-5" />,
  'Cửa hàng': <MapPin className="w-5 h-5" />,
};

export default function MobileMenu({
  isOpen,
  onClose,
  navigation,
  pathname,
  cartItemCount,
}: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-6 py-4 transition-colors
                        ${
                          isActive
                            ? 'bg-pink-50 text-pink-700 border-r-4 border-pink-600'
                            : 'text-gray-700 hover:bg-pink-50'
                        }
                      `}
                    >
                      {iconMap[item.name]}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="border-t border-gray-200 p-4 space-y-2">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Yêu thích</span>
                </Link>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Tài khoản</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Giỏ hàng</span>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-white text-pink-600 text-xs font-bold rounded-full px-2 py-1">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
````

## File: src/components/product/ProductCard.tsx
````typescript
'use client';

// Thẻ sản phẩm ngoài danh sách
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatCurrency, formatPriceRange } from '@/lib/utils';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceDisplay =
    product.maxPrice && product.maxPrice > product.basePrice
      ? formatPriceRange(product.basePrice, product.maxPrice)
      : formatCurrency(product.basePrice);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Hot Badge */}
      {product.isHot && (
        <div className="absolute top-3 left-3 z-10 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Hot
        </div>
      )}

      {/* Wishlist Button */}
      <button
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          // TODO: Add to wishlist
        }}
      >
        <Heart className="w-4 h-4 text-gray-600" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🐻</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-pink-600 font-medium uppercase">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-cream-100 text-brown-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-pink-600">{priceDisplay}</span>
          {product.variants.length > 1 && (
            <span className="text-xs text-gray-500">
              ({product.variants.length} kích thước)
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
````

## File: src/components/product/ProductGallery.tsx
````typescript
'use client';

// Slider ảnh sản phẩm
// Image MUST update automatically when variant changes
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Variant } from '@/types';

interface ProductGalleryProps {
  images: string[];
  selectedVariant?: Variant;
}

export default function ProductGallery({
  images,
  selectedVariant,
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Compute display images based on variant
  const displayImages = (() => {
    if (selectedVariant?.image) {
      // If variant has specific image, show it first
      const variantImageIndex = images.findIndex((img) => img === selectedVariant.image);
      if (variantImageIndex !== -1) {
        return [selectedVariant.image, ...images.filter((img) => img !== selectedVariant.image)];
      }
      return [selectedVariant.image, ...images];
    }
    return images;
  })();

  // Reset to first image when variant changes
  const prevVariantIdRef = useRef<string | undefined>(selectedVariant?.id);
  
  useEffect(() => {
    if (prevVariantIdRef.current !== selectedVariant?.id) {
      prevVariantIdRef.current = selectedVariant?.id;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setCurrentIndex(0);
      }, 0);
    }
  }, [selectedVariant?.id]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Không có ảnh</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
        <Image
          src={displayImages[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                ${
                  index === currentIndex
                    ? 'border-pink-400 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-pink-300'
                }
              `}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
````

## File: src/components/product/SizeGuideModal.tsx
````typescript
'use client';

// Popup so sánh kích thước
// Hướng dẫn chọn size - giúp khách hàng hình dung kích thước thực tế
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: Array<{ id: string; size: string; price: number }>;
}

const sizeComparisons = [
  {
    size: '80cm',
    description: 'Kích thước nhỏ gọn',
    comparison: 'Khoảng bằng một chiếc gối ôm',
    height: '80cm',
    suitable: 'Phù hợp để đặt trên giường, ghế sofa',
  },
  {
    size: '1m2',
    description: 'Kích thước trung bình',
    comparison: 'Khoảng bằng một đứa trẻ 4-5 tuổi',
    height: '120cm',
    suitable: 'Phù hợp để ôm khi ngủ, trang trí phòng',
  },
  {
    size: '1m5',
    description: 'Kích thước lớn',
    comparison: 'Khoảng bằng một người lớn ngồi',
    height: '150cm',
    suitable: 'Món quà ấn tượng, trang trí không gian lớn',
  },
  {
    size: '2m',
    description: 'Kích thước khổng lồ',
    comparison: 'Cao hơn một người lớn',
    height: '200cm',
    suitable: 'Món quà đặc biệt, trang trí sự kiện',
  },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
  variants,
}: SizeGuideModalProps) {
  // Get available sizes from variants
  const availableSizes = variants.map((v) => v.size);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Ruler className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Hướng dẫn chọn kích thước
                    </h2>
                    <p className="text-sm text-gray-600">
                      So sánh kích thước để chọn sản phẩm phù hợp
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Visual Size Comparison */}
                <div className="mb-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    So sánh trực quan
                  </h3>
                  <div className="flex items-end justify-center gap-4 h-64">
                    {sizeComparisons
                      .filter((s) => availableSizes.includes(s.size))
                      .map((sizeInfo) => {
                        const heightPercent =
                          sizeInfo.size === '80cm'
                            ? 40
                            : sizeInfo.size === '1m2'
                            ? 60
                            : sizeInfo.size === '1m5'
                            ? 75
                            : 100;

                        return (
                          <div
                            key={sizeInfo.size}
                            className="flex flex-col items-center gap-2 flex-1"
                          >
                            <div
                              className="w-full bg-gradient-to-t from-pink-400 to-pink-500 rounded-t-lg shadow-lg flex items-end justify-center"
                              style={{ height: `${heightPercent}%` }}
                            >
                              <span className="text-white font-bold text-sm mb-2">
                                {sizeInfo.size}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 text-center font-medium">
                              {sizeInfo.height}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Size Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  {sizeComparisons
                    .filter((s) => availableSizes.includes(s.size))
                    .map((sizeInfo) => (
                      <div
                        key={sizeInfo.size}
                        className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-pink-300 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-pink-600 font-bold text-lg">
                              {sizeInfo.size}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {sizeInfo.description}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.height} chiều cao
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-medium text-sm">
                              ≈
                            </span>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.comparison}
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-pink-600 font-medium text-sm">
                              ✓
                            </span>
                            <p className="text-sm text-gray-600">
                              {sizeInfo.suitable}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    💡 Mẹo chọn size
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>
                      Nếu mua làm quà, hãy cân nhắc không gian nhà người nhận
                    </li>
                    <li>
                      Size lớn hơn thường có giá trị cảm xúc cao hơn nhưng cần không gian lớn
                    </li>
                    <li>
                      Size nhỏ gọn phù hợp để mang theo khi đi du lịch
                    </li>
                    <li>
                      Nếu không chắc chắn, hãy chọn size trung bình (1m2) - phù hợp nhất
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
````

## File: src/components/product/VariantSelector.tsx
````typescript
'use client';

// Chọn Size/Màu (Logic phức tạp ở đây)
// Changing size MUST update displayed Price and Product Image automatically
import { useState, useMemo, useRef, useEffect } from 'react';
import type { Product, Variant } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface VariantSelectorProps {
  product: Product;
  selectedVariantId?: string;
  onVariantChange: (variant: Variant) => void;
}

export default function VariantSelector({
  product,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  // Compute current variant based on props (derived state)
  const currentVariant = useMemo(() => {
    if (selectedVariantId) {
      return product.variants.find((v) => v.id === selectedVariantId) || product.variants[0] || null;
    }
    return product.variants[0] || null;
  }, [selectedVariantId, product.variants]);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(currentVariant);
  const prevVariantIdRef = useRef<string | undefined>(currentVariant?.id);

  // Sync state when variant changes - use callback to avoid synchronous setState
  useEffect(() => {
    if (currentVariant && prevVariantIdRef.current !== currentVariant.id) {
      prevVariantIdRef.current = currentVariant.id;
      // Use requestAnimationFrame to defer state update
      requestAnimationFrame(() => {
        setSelectedVariant(currentVariant);
        onVariantChange(currentVariant);
      });
    }
  }, [currentVariant, onVariantChange]);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

  if (!selectedVariant || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kích thước
        </label>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantSelect(variant)}
              disabled={variant.stock === 0}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all
                ${
                  selectedVariant.id === variant.id
                    ? 'border-pink-400 bg-pink-50 text-pink-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-pink-200'
                }
                ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {variant.size}
              {variant.stock === 0 && (
                <span className="ml-1 text-xs text-red-500">(Hết hàng)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">Giá:</span>
          <span className="text-2xl font-bold text-pink-600">
            {formatCurrency(selectedVariant.price)}
          </span>
        </div>
        {product.basePrice !== selectedVariant.price && (
          <p className="text-xs text-gray-500 mt-1">
            Giá gốc: <span className="line-through">{formatCurrency(product.basePrice)}</span>
          </p>
        )}
        {selectedVariant.stock > 0 && (
          <p className="text-xs text-green-600 mt-2">
            Còn {selectedVariant.stock} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
````

## File: src/components/ui/Button.tsx
````typescript
// Button component
export default function Button() {
  return <button>Button</button>;
}
````

## File: src/components/ui/Input.tsx
````typescript
// Input component
export default function Input() {
  return <input />;
}
````

## File: src/components/ui/Modal.tsx
````typescript
// Modal component
export default function Modal() {
  return <div>Modal</div>;
}
````

## File: src/lib/api-contracts/cart.ts
````typescript
// API Contracts for Cart Management
import type { Cart, CartItem } from '../schemas/cart';
import type { UpsellServices } from '@/types';

/**
 * POST /api/cart
 * 
 * GOAL: Add a specific variant to the user's cart
 * 
 * Request Body:
 */
export interface AddToCartRequest {
  productId: string; // Product identifier
  variantId: string; // Variant identifier (CRITICAL - specifies size/price)
  quantity: number; // Quantity to add (must be > 0)
}

/**
 * PUT /api/cart/:itemId
 * 
 * GOAL: Update quantity of an existing cart item
 * 
 * Request Body:
 */
export interface UpdateCartItemRequest {
  quantity: number; // New quantity (must be > 0)
}

/**
 * DELETE /api/cart/:itemId
 * 
 * GOAL: Remove an item from cart
 * 
 * No request body required
 */

/**
 * PUT /api/cart/upsell-services
 * 
 * GOAL: Update upsell services selection
 * 
 * Request Body:
 */
export interface UpdateUpsellServicesRequest {
  upsellServices: Partial<UpsellServices>;
}

/**
 * Response Body for Cart Operations
 */
export interface CartResponse {
  success: true;
  data: {
    cart: Cart;
    totals: {
      subtotal: number;
      upsellTotal: number;
      shippingFee: number;
      total: number;
      itemCount: number; // Total quantity of items
    };
  };
}

/**
 * Error Response
 */
export interface CartErrorResponse {
  success: false;
  error: string;
  details?: {
    field?: string;
    message: string;
  };
}
````

## File: src/lib/api-contracts/checkout.ts
````typescript
// API Contracts for Checkout Processing
import type { ShippingAddress, UpsellServices, PaymentDetails } from '../schemas/order';
import type { CartItem } from '../schemas/cart';

/**
 * POST /api/checkout
 * 
 * GOAL: Finalize the order, calculate total including shipping and upsell fees,
 * and create the Order record
 * 
 * Request Body:
 */
export interface CheckoutRequest {
  // User identification
  userId?: string; // Optional - for logged-in users
  guestEmail: string; // Required for guest checkout
  
  // Cart items
  items: CartItem[]; // Array of items with variantId references
  
  // Shipping information
  shippingAddress: ShippingAddress;
  shippingMethod?: 'standard' | 'express'; // Default: 'standard'
  
  // Upsell Services - CRITICAL for final fee calculation
  upsellServices: UpsellServices;
  
  // Payment details
  paymentDetails: {
    method: PaymentDetails['method'];
  };
  
  // Optional: Pre-calculated totals (will be verified server-side)
  subtotal?: number;
  upsellTotal?: number;
  shippingFee?: number;
  total?: number;
}

/**
 * Response Body for POST /api/checkout
 */
export interface CheckoutResponse {
  success: true;
  data: {
    orderId: string; // Generated order ID (e.g., "ORD-1234567890-0001")
    order: {
      id: string;
      status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
      total: number;
      itemCount: number;
      paymentMethod: string;
      estimatedDelivery?: string; // ISO date string
    };
    payment?: {
      // For online payments (MoMo, VNPay)
      paymentUrl?: string;
      transactionId?: string;
      qrCode?: string; // For QR code payments
    };
    message: string;
  };
}

/**
 * Error Response
 */
export interface CheckoutErrorResponse {
  success: false;
  error: string;
  details?: {
    field?: string;
    message: string;
    code?: string; // Error code for client handling
  };
}

/**
 * GET /api/checkout/:orderId
 * 
 * GOAL: Retrieve order status and details
 * 
 * Response Body:
 */
export interface GetOrderResponse {
  success: true;
  data: {
    orderId: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
    total: number;
    itemCount: number;
    shippingAddress: ShippingAddress;
    paymentStatus: PaymentDetails['status'];
    trackingNumber?: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
  };
}
````

## File: src/lib/api-contracts/index.ts
````typescript
// Central export for all API contracts
export * from './products';
export * from './cart';
export * from './checkout';
````

## File: src/lib/api-contracts/products.ts
````typescript
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
````

## File: src/lib/constants.ts
````typescript
// Lưu các biến cố định (Danh sách Category, Phí ship, Filter options)

// Categories
export const CATEGORIES = [
  { value: 'teddy', label: 'Teddy' },
  { value: 'capybara', label: 'Capybara' },
  { value: 'lotso', label: 'Lotso' },
  { value: 'kuromi', label: 'Kuromi' },
  { value: 'cartoon', label: 'Cartoon' },
] as const;

// Size Options
export const SIZES = [
  { value: 'mini', label: 'Mini' },
  { value: 'bigsize', label: 'Bigsize' },
] as const;

// Occasion Tags
export const OCCASIONS = [
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'graduation', label: 'Tốt nghiệp' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'anniversary', label: 'Kỷ niệm' },
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { value: '0-100000', label: 'Dưới 100.000đ', min: 0, max: 100000 },
  { value: '100000-500000', label: '100.000đ - 500.000đ', min: 100000, max: 500000 },
  { value: '500000-1000000', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
  { value: '1000000+', label: 'Trên 1.000.000đ', min: 1000000, max: Infinity },
] as const;

// Shipping Fees
export const SHIPPING_FEE = 30000; // VND - Standard shipping
export const EXPRESS_SHIPPING_FEE = 50000; // VND - Express shipping
export const GIFT_WRAPPING_FEE = 30000; // VND

// Upsell Services
export const UPSELL_SERVICES = {
  VACUUM_SEALING: {
    id: 'vacuum-sealing',
    name: 'Hút chân không',
    price: 0,
    description: 'Giúp giảm kích thước vận chuyển',
  },
  GIFT_WRAPPING: {
    id: 'gift-wrapping',
    name: 'Gói quà & Thiệp',
    price: GIFT_WRAPPING_FEE,
    description: 'Gói quà đẹp và kèm thiệp chúc mừng',
  },
  EXPRESS_SHIPPING: {
    id: 'express-shipping',
    name: 'Giao hàng nhanh',
    price: EXPRESS_SHIPPING_FEE,
    description: 'Giao hàng trong 24h',
  },
} as const;
````

## File: src/lib/data/products.ts
````typescript
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
    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      const matchesPrice = filters.priceRange.some((range) => {
        const [min, max] = range.split('-').map((v) => {
          if (v === '+') return Infinity;
          return parseInt(v);
        });
        return (
          product.basePrice >= min &&
          (max === Infinity || product.basePrice <= max)
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
````

## File: src/lib/db.ts
````typescript
// MongoDB Connection Helper
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Get MongoDB database instance
 */
export async function getDatabase(dbName: string = 'teddy-shop'): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Get MongoDB collections
 */
export async function getCollections() {
  const db = await getDatabase();
  return {
    products: db.collection('products'),
    orders: db.collection('orders'),
    carts: db.collection('carts'),
    users: db.collection('users'),
  };
}

/**
 * Connect to MongoDB (for initialization)
 */
export async function connectDB(): Promise<void> {
  try {
    await clientPromise;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Export the client promise for use in API routes
export default clientPromise;
````

## File: src/lib/schemas/cart.ts
````typescript
// MongoDB Schema Definitions for Cart
import type { ObjectId } from 'mongodb';
import type { CartItem, UpsellServices } from '@/types';

/**
 * Cart Schema
 * User's shopping cart (can be persisted or session-based)
 */
export interface Cart {
  _id?: ObjectId;
  userId?: string; // For logged-in users
  sessionId?: string; // For guest users
  
  // Cart items - each item references a specific variant
  items: CartItem[];
  
  // Upsell services selected
  upsellServices: UpsellServices;
  
  // Calculated totals (can be computed on-the-fly or cached)
  subtotal: number;
  upsellTotal: number;
  shippingFee: number;
  total: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For session-based carts
}

/**
 * Cart Item Schema
 * Individual item in the cart, linked to a specific variant
 */
export interface CartItem {
  productId: string; // Reference to Product.id
  variantId: string; // Reference to ProductVariant.id - CRITICAL for variant selection
  name: string; // Product name (denormalized for display)
  size: string; // Variant size (denormalized)
  price: number; // Variant price at time of adding (snapshot)
  quantity: number;
  image: string; // Variant or product image
}
````

## File: src/lib/schemas/index.ts
````typescript
// Central export for all MongoDB schemas
export * from './product';
export * from './order';
export * from './cart';
````

## File: src/lib/schemas/order.ts
````typescript
// MongoDB Schema Definitions for Order
import type { ObjectId } from 'mongodb';
import type { CartItem } from '@/types';

/**
 * Shipping Address Schema
 */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string; // Street address
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Thành phố
  note?: string; // Delivery notes
}

/**
 * Upsell Services Schema
 * Tracks which services were applied to the order
 */
export interface UpsellServices {
  vacuumSealing: boolean; // Free service - reduces shipping size
  isGiftWrapped: boolean; // Paid service
  giftWrapFee: number; // Fee for gift wrapping (typically 30,000 VND)
  expressShipping: boolean; // Express delivery option
}

/**
 * Payment Details Schema
 */
export interface PaymentDetails {
  method: 'cod' | 'bank_transfer' | 'momo' | 'vnpay';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string; // For online payments
  paidAt?: Date; // Payment timestamp
  amount: number; // Amount paid
}

/**
 * Order Schema
 * Complete order entity with upsell services tracking
 */
export interface Order {
  _id?: ObjectId;
  orderId: string; // Human-readable order ID (e.g., "ORD-1234567890-0001")
  
  // User information
  userId?: string; // Optional - for logged-in users
  guestEmail: string; // Email for guest checkout
  
  // Order items
  items: CartItem[]; // Array of cart items with variantId references
  
  // Shipping information
  shippingAddress: ShippingAddress;
  shippingFee: number; // Calculated shipping cost
  shippingMethod: 'standard' | 'express';
  
  // Upsell Services - CRITICAL for tracking
  upsellServices: UpsellServices;
  
  // Pricing breakdown
  subtotal: number; // Sum of all items (price * quantity)
  upsellTotal: number; // Total from upsell services (gift wrapping, etc.)
  shippingTotal: number; // Shipping fee
  total: number; // Final total (subtotal + upsellTotal + shippingTotal)
  
  // Payment information
  paymentDetails: PaymentDetails;
  
  // Order status
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  
  // Tracking
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order Summary (for API responses)
 */
export interface OrderSummary {
  orderId: string;
  status: Order['orderStatus'];
  total: number;
  itemCount: number;
  createdAt: Date;
}
````

## File: src/lib/schemas/product.ts
````typescript
// MongoDB Schema Definitions for Product
import type { ObjectId } from 'mongodb';

/**
 * Product Variant Schema
 * Represents a specific size/price option for a product
 */
export interface ProductVariant {
  _id?: ObjectId;
  id: string; // Unique identifier for the variant
  size: string; // e.g., "80cm", "1m2", "1m5", "2m"
  price: number; // Price in VND
  stock: number; // Available quantity
  image?: string; // Optional variant-specific image URL
  sku?: string; // Stock Keeping Unit (optional)
  weight?: number; // Weight in grams (for shipping calculation)
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

/**
 * Product Schema
 * Core product entity with nested variants array
 */
export interface Product {
  _id?: ObjectId;
  id: string; // Unique identifier
  name: string;
  slug: string; // URL-friendly identifier
  description: string;
  category: string; // e.g., "teddy", "capybara", "lotso", "kuromi", "cartoon"
  tags: string[]; // e.g., ["Best Seller", "Birthday", "Valentine"]
  
  // Price range for quick display (calculated from variants)
  minPrice: number; // Lowest price among all variants
  maxPrice?: number; // Highest price (if multiple variants)
  
  // Product images
  images: string[]; // Main product gallery
  
  // Variants array - nested structure
  variants: ProductVariant[];
  
  // Product metadata
  isHot: boolean; // Featured/hot product flag
  isActive: boolean; // Product availability
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Total number of reviews
  
  // SEO & Marketing
  metaTitle?: string;
  metaDescription?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Simplified Product (for listing pages)
 * Lightweight version without full variant details
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  minPrice: number;
  maxPrice?: number;
  images: string[];
  isHot: boolean;
  rating?: number;
  reviewCount?: number;
  variantCount: number; // Number of available variants
}
````

## File: src/lib/utils.ts
````typescript
// Hàm định dạng tiền tệ (VND), xử lý chuỗi
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

// Format currency without currency symbol (for display)
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// Format price range
export function formatPriceRange(min: number, max?: number): string {
  if (max && max !== Infinity) {
    return `${formatPrice(min)}đ - ${formatPrice(max)}đ`;
  }
  return `Từ ${formatPrice(min)}đ`;
}
````

## File: src/store/useCartStore.ts
````typescript
// Quản lý trạng thái giỏ hàng toàn cục
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, UpsellServices } from '@/types';

interface CartStore {
  items: CartItem[];
  upsellServices: UpsellServices;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  updateUpsellServices: (services: Partial<UpsellServices>) => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getUpsellTotal: () => number;
  getItemCount: () => number;
  getTotalItems: () => number;
  getShippingFee: () => number;
}

const GIFT_WRAPPING_PRICE = 30000;
const EXPRESS_SHIPPING_PRICE = 50000;
const STANDARD_SHIPPING_PRICE = 30000;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      upsellServices: {
        vacuumSealing: false,
        giftWrapping: false,
        expressShipping: false,
      },
      
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        }),
      
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),
      
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      
      clearCart: () =>
        set({
          items: [],
          upsellServices: {
            vacuumSealing: false,
            giftWrapping: false,
            expressShipping: false,
          },
        }),
      
      updateUpsellServices: (services) =>
        set((state) => ({
          upsellServices: { ...state.upsellServices, ...services },
        })),
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getUpsellTotal: () => {
        const { upsellServices } = get();
        let total = 0;
        if (upsellServices.giftWrapping) {
          total += GIFT_WRAPPING_PRICE;
        }
        // Express shipping is included in shipping fee, not upsell
        return total;
      },
      
      getShippingFee: () => {
        const { upsellServices } = get();
        if (upsellServices.expressShipping) {
          return EXPRESS_SHIPPING_PRICE;
        }
        return STANDARD_SHIPPING_PRICE;
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().getSubtotal() + get().getUpsellTotal() + get().getShippingFee();
      },
    }),
    {
      name: 'teddy-shop-cart',
    }
  )
);
````

## File: src/styles/globals.css
````css
/* Global CSS (Tailwind directives) */
@import "tailwindcss";

/* "Emotional House" Theme - Pastel Colors */
:root {
  /* Pink Palette */
  --pink-50: #fdf2f8;
  --pink-100: #fce7f3;
  --pink-200: #fbcfe8;
  --pink-300: #f9a8d4;
  --pink-400: #f472b6;
  --pink-500: #ec4899;
  --pink-600: #db2777;
  
  /* Cream Palette */
  --cream-50: #fefbf7;
  --cream-100: #fdf6ed;
  --cream-200: #faedd4;
  --cream-300: #f6e0b8;
  
  /* Brown Palette */
  --brown-100: #f5e6d3;
  --brown-200: #e8d5c4;
  --brown-300: #d4c4b0;
  --brown-600: #8b7355;
  --brown-700: #6b5d4f;
  --brown-900: #3d3529;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Smooth transitions for "Emotional House" UX */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
````

## File: src/types/index.ts
````typescript
// Định nghĩa kiểu dữ liệu (Product, Variant, CartItem)

export type Variant = {
  id: string;
  size: string;      // e.g., "1m2"
  price: number;     // e.g., 350000
  stock: number;
  image?: string;    // Specific image for this size
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;     // e.g., "Teddy", "Cartoon"
  tags: string[];       // e.g., "Birthday", "Best Seller"
  basePrice: number;    // Lowest price for display
  maxPrice?: number;    // Highest price for display range
  images: string[];     // Main gallery
  variants: Variant[];  // Array of size/price options
  isHot: boolean;
};

export type CartItem = {
  productId: string;
  variantId: string; // Specific size selected
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

// Upsell Services Types
export type UpsellService = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export type UpsellServices = {
  vacuumSealing: boolean;  // Free
  giftWrapping: boolean;   // Paid (+30,000 VND)
  expressShipping: boolean; // Conditional
};

// Checkout Types
export type ShippingInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
};

export type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay';

export type Order = {
  id: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  upsellTotal: number;
  shippingFee: number;
  total: number;
  upsellServices: UpsellServices;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
};
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
````

## File: eslint.config.mjs
````
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: package.json
````json
{
  "name": "teddy-shop",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0",
    "next": "16.0.6",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
````

## File: postcss.config.mjs
````
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
````

## File: public/file.svg
````
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
````
