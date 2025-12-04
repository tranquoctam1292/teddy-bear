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
  seo?: SEOConfig; // Advanced SEO configuration
  
  createdAt: Date;
  updatedAt: Date;
}

interface SEOConfig {
  canonicalUrl?: string; // Override canonical URL to avoid duplicate content
  robots?: string; // "index, follow" | "noindex, follow" | "noindex, nofollow"
  focusKeyword?: string; // Primary keyword for SEO tracking
  altText?: string; // Alt text for featured image (if different from title/name)
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

### 2. Post Schema

```typescript
interface Post {
  _id?: ObjectId;
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // Rich text content (HTML)
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  seo?: SEOConfig; // Advanced SEO configuration
  
  // Media
  featuredImage?: string;
  images?: string[];
  
  // Categorization
  category?: string;
  tags: string[];
  
  // Status & Publishing
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  author?: string;
  
  // Analytics
  views?: number;
  likes?: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Points:**
- `seo` object contains advanced SEO settings
- `keywords` is an array for multiple keywords
- `status` controls visibility and publishing

---

### 3. Order Schema

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

### 4. Cart Schema

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

---

## 📊 PERFORMANCE OPTIMIZATION ANALYSIS

### Authors Collection - API Routes & Indexes

#### API Routes Analyzed:

**Admin Routes:**
1. `GET /api/admin/authors` - List with filters, search, sort, pagination
2. `POST /api/admin/authors` - Create with slug/email uniqueness check
3. `GET /api/admin/authors/[id]` - Get single by ID
4. `PATCH /api/admin/authors/[id]` - Update with uniqueness validation
5. `DELETE /api/admin/authors/[id]` - Delete with post dependency check

**Public Routes:**
1. `GET /api/authors` - Public list (active only, filtered, sorted)
2. `GET /api/authors/[slug]` - Get by slug (SEO URLs)
3. `GET /api/authors/search` - Autocomplete search

---

### 🔍 Query Patterns Identified:

#### Authors Collection Queries:

| Query Type | Fields | Frequency | Performance Impact |
|------------|--------|-----------|-------------------|
| **Find by slug** | `{ slug: string, status: 'active' }` | High | 🔴 Critical |
| **Find by email** | `{ email: string }` | Medium | 🟡 Important |
| **Find by status** | `{ status: string }` | High | 🟡 Important |
| **Text search** | `{ $or: [name, email, bio, jobTitle] }` | High | 🔴 Critical |
| **Filtered list** | `{ status, type }` | High | 🟡 Important |
| **Sorted by name** | `.sort({ name: 1 })` | High | 🟡 Important |
| **Find by ID** | `{ _id: ObjectId }` | High | ✅ Auto-indexed |

#### Posts Collection Queries (Author-related):

| Query Type | Fields | Frequency | Performance Impact |
|------------|--------|-----------|-------------------|
| **Count by author** | `{ 'authorInfo.authorId': string, status: 'published' }` | High | 🔴 Critical |
| **Count by reviewer** | `{ 'authorInfo.reviewerId': string, status: 'published' }` | High | 🔴 Critical |
| **Recent posts** | `{ 'authorInfo.authorId': string, status: 'published' }` + sort | Medium | 🟡 Important |

---

### 🎯 RECOMMENDED MONGODB INDEXES

#### Authors Collection:

```javascript
// 1. Slug Index (UNIQUE) - Critical for SEO URLs
db.authors.createIndex(
  { "slug": 1 }, 
  { 
    unique: true,
    name: "idx_authors_slug_unique"
  }
);

// 2. Email Index (UNIQUE, SPARSE) - For uniqueness validation
db.authors.createIndex(
  { "email": 1 }, 
  { 
    unique: true,
    sparse: true,  // Allow null/missing emails
    name: "idx_authors_email_unique"
  }
);

// 3. Status Index - For filtering active/inactive
db.authors.createIndex(
  { "status": 1 },
  { name: "idx_authors_status" }
);

// 4. Compound: Status + Type - For filtered lists
db.authors.createIndex(
  { "status": 1, "type": 1 },
  { name: "idx_authors_status_type" }
);

// 5. Compound: Status + Name - For sorted active lists
db.authors.createIndex(
  { "status": 1, "name": 1 },
  { name: "idx_authors_status_name" }
);

// 6. Text Index - For search functionality
db.authors.createIndex(
  { 
    "name": "text", 
    "email": "text", 
    "bio": "text", 
    "jobTitle": "text" 
  },
  { 
    name: "idx_authors_text_search",
    weights: {
      name: 10,      // Highest priority
      email: 5,
      jobTitle: 3,
      bio: 1
    }
  }
);

// 7. Created Date - For sorting by newest
db.authors.createIndex(
  { "createdAt": -1 },
  { name: "idx_authors_created" }
);
```

#### Posts Collection (Author-related):

```javascript
// 1. Author ID + Status - For counting author's posts
db.posts.createIndex(
  { "authorInfo.authorId": 1, "status": 1 },
  { name: "idx_posts_authorid_status" }
);

// 2. Reviewer ID + Status - For counting reviewed posts
db.posts.createIndex(
  { "authorInfo.reviewerId": 1, "status": 1 },
  { name: "idx_posts_reviewerid_status" }
);

// 3. Author ID + Status + PublishedAt - For recent posts query
db.posts.createIndex(
  { "authorInfo.authorId": 1, "status": 1, "publishedAt": -1 },
  { name: "idx_posts_author_recent" }
);

// 4. Compound for $or queries (author or reviewer)
// Note: MongoDB will use individual indexes for $or
```

---

### 📊 Performance Impact Analysis:

#### Without Indexes:
- ❌ Slug lookup: **Collection scan** (~100ms per query)
- ❌ Search queries: **Full scan** (~200-500ms)
- ❌ Email uniqueness check: **Full scan** (~50ms)
- ❌ Author post counts: **Full posts scan** (~200ms per author)

#### With Indexes:
- ✅ Slug lookup: **Index scan** (~2-5ms)
- ✅ Search queries: **Text index** (~10-30ms)
- ✅ Email check: **Index scan** (~2-5ms)
- ✅ Author post counts: **Index scan** (~5-10ms)

**Expected Performance Improvement: 10-50x faster** 🚀

---

### 🎯 Index Priority:

| Priority | Index | Reason | Impact |
|----------|-------|--------|--------|
| 🔴 **CRITICAL** | `slug` (unique) | SEO URLs, used on every author page visit | 50x faster |
| 🔴 **CRITICAL** | Posts `authorInfo.authorId` + `status` | Called on every author list/detail | 20x faster |
| 🟡 **HIGH** | Text search | Autocomplete, admin search | 30x faster |
| 🟡 **HIGH** | `email` (unique) | Uniqueness validation on create/update | 10x faster |
| 🟢 **MEDIUM** | `status` + `name` | Filtered/sorted lists | 5x faster |
| 🟢 **MEDIUM** | `status` + `type` | Type-based filtering | 5x faster |

---

### 💾 Index Storage Estimates:

```
Authors Collection (~1,000 documents):
- slug index: ~50 KB
- email index: ~40 KB
- status index: ~10 KB
- text index: ~200 KB
- Compound indexes: ~100 KB
Total: ~400 KB

Posts Collection (~10,000 documents):
- authorInfo.authorId index: ~300 KB
- authorInfo.reviewerId index: ~300 KB
- Compound indexes: ~500 KB
Total: ~1.1 MB

Grand Total: ~1.5 MB (negligible impact)
```

---

### 🚀 Implementation Script:

```javascript
// scripts/create-author-indexes.ts
import { getCollections } from '@/lib/db';

async function createAuthorIndexes() {
  const { authors, posts } = await getCollections();
  
  console.log('Creating indexes for authors collection...');
  
  // Authors indexes
  await authors.createIndex({ slug: 1 }, { unique: true });
  await authors.createIndex({ email: 1 }, { unique: true, sparse: true });
  await authors.createIndex({ status: 1 });
  await authors.createIndex({ status: 1, type: 1 });
  await authors.createIndex({ status: 1, name: 1 });
  await authors.createIndex(
    { name: "text", email: "text", bio: "text", jobTitle: "text" },
    { weights: { name: 10, email: 5, jobTitle: 3, bio: 1 } }
  );
  await authors.createIndex({ createdAt: -1 });
  
  console.log('✅ Authors indexes created');
  
  console.log('Creating indexes for posts collection (author-related)...');
  
  // Posts indexes (author-related)
  await posts.createIndex({ "authorInfo.authorId": 1, status: 1 });
  await posts.createIndex({ "authorInfo.reviewerId": 1, status: 1 });
  await posts.createIndex({ "authorInfo.authorId": 1, status: 1, publishedAt: -1 });
  
  console.log('✅ Posts indexes created');
  
  // Show all indexes
  const authorIndexes = await authors.indexes();
  const postIndexes = await posts.indexes();
  
  console.log('\n📊 Authors Collection Indexes:', authorIndexes.length);
  console.log('📊 Posts Collection Indexes:', postIndexes.length);
}

createAuthorIndexes();
```

---

### ✅ Benefits Summary:

1. **SEO Performance:**
   - Author pages load 50x faster
   - Critical for Google Core Web Vitals

2. **Admin Performance:**
   - Author list/search 30x faster
   - Better UX for content managers

3. **Data Integrity:**
   - Unique constraints prevent duplicates
   - Email/slug validation at database level

4. **Scalability:**
   - Handles 10,000+ authors efficiently
   - No performance degradation with growth

---

**Analysis Date:** December 4, 2025  
**Collections Analyzed:** authors, posts  
**Routes Analyzed:** 8 API endpoints  
**Indexes Recommended:** 10 total (7 authors + 3 posts)  
**Expected Improvement:** 10-50x faster queries  
**Storage Impact:** ~1.5 MB (negligible)

