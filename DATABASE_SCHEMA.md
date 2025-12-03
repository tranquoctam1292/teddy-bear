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



