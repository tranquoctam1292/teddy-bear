# 🐻 Plan Nâng Cấp Hệ Thống Sản Phẩm - Teddy Shop

**Ngày tạo:** 5 tháng 12, 2025  
**Mục tiêu:** Nâng cấp trang thêm sản phẩm (CMS) và trang chi tiết sản phẩm (Frontend) để phù hợp với ngành nghề bán gấu bông, quà tặng  
**Phạm vi:** Admin Product Form + Frontend Product Detail Page

---

## 📋 Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [Phân Tích Hiện Trạng](#2-phân-tích-hiện-trạng)
3. [Yêu Cầu Nâng Cấp](#3-yêu-cầu-nâng-cấp)
4. [Chi Tiết Implementation](#4-chi-tiết-implementation)
5. [Database Schema Changes](#5-database-schema-changes)
6. [API Routes](#6-api-routes)
7. [Components](#7-components)
8. [Timeline & Phân Công](#8-timeline--phân-công)
9. [Testing Checklist](#9-testing-checklist)

---

## 1. Tổng Quan

### 1.1. Mục Tiêu

Nâng cấp hệ thống sản phẩm để:

- ✅ **Phù hợp với ngành gấu bông/quà tặng** - Thêm các trường thông tin đặc thù
- ✅ **Tăng trải nghiệm người dùng** - UI/UX tốt hơn, thông tin chi tiết hơn
- ✅ **Tăng tỷ lệ chuyển đổi** - Hiển thị đầy đủ thông tin, tính năng quà tặng
- ✅ **SEO tối ưu** - Rich snippets, structured data
- ✅ **Quản lý dễ dàng** - CMS thân thiện, workflow rõ ràng

### 1.2. Phạm Vi

**CMS (Admin):**
- Trang thêm sản phẩm mới (`/admin/products/new`)
- Trang chỉnh sửa sản phẩm (`/admin/products/[id]/edit`)
- ProductFormV3 component

**Frontend:**
- Trang chi tiết sản phẩm (`/products/[slug]`)
- ProductGallery, VariantSelector components

**Database:**
- Mở rộng Product schema
- Thêm collections mới (nếu cần)

---

## 2. Phân Tích Hiện Trạng

### 2.1. CMS (Admin) - Hiện Tại

**Điểm Mạnh:**
- ✅ WordPress-style editor layout
- ✅ Rich text editor (Tiptap)
- ✅ Variant system (size, color, price, stock)
- ✅ SEO tools (meta title, description, schema builder)
- ✅ Image gallery
- ✅ Category & tags

**Điểm Yếu:**
- ❌ Thiếu thông tin chi tiết về sản phẩm (chất liệu, kích thước, trọng lượng)
- ❌ Không có tính năng quà tặng (gift wrapping, gift message)
- ❌ Không có video giới thiệu
- ❌ Không có hình ảnh 360 độ
- ❌ Không có bộ sưu tập/combo
- ❌ Không có hướng dẫn bảo quản
- ❌ Không có độ tuổi phù hợp
- ❌ Variant form còn đơn giản (thiếu image upload per variant)

### 2.2. Frontend - Hiện Tại

**Điểm Mạnh:**
- ✅ Product gallery với variant support
- ✅ Variant selector (size, color)
- ✅ Size guide modal
- ✅ Add to cart
- ✅ Related posts
- ✅ SEO (JSON-LD schema)

**Điểm Yếu:**
- ❌ Thiếu thông tin chi tiết sản phẩm (chất liệu, kích thước, trọng lượng)
- ❌ Không có video giới thiệu
- ❌ Không có hình ảnh 360 độ
- ❌ Không có tính năng quà tặng (gift wrapping, gift message)
- ❌ Không có bộ sưu tập/combo
- ❌ Không có tabbed content (mô tả, đặc điểm, đánh giá, hướng dẫn)
- ❌ Không có zoom image
- ❌ Không có social sharing với preview
- ❌ Không có "Sản phẩm thường mua cùng"

---

## 3. Yêu Cầu Nâng Cấp

### 3.1. CMS (Admin) - Yêu Cầu Mới

#### A. Thông Tin Chi Tiết Sản Phẩm

| Trường | Type | Mô Tả | Bắt Buộc |
|--------|------|-------|-----------|
| `material` | `string` | Chất liệu (VD: "Bông gòn cao cấp, vải lông mềm") | ✅ |
| `dimensions` | `object` | Kích thước thực tế (length, width, height) | ✅ |
| `weight` | `number` | Trọng lượng (gram) | ✅ |
| `ageRange` | `string` | Độ tuổi phù hợp (VD: "3+", "0-12 tháng") | ✅ |
| `careInstructions` | `string` | Hướng dẫn bảo quản (HTML) | ❌ |
| `safetyInfo` | `string` | Thông tin an toàn | ❌ |
| `warranty` | `string` | Bảo hành (VD: "6 tháng") | ❌ |

#### B. Tính Năng Quà Tặng

| Trường | Type | Mô Tả | Bắt Buộc |
|--------|------|-------|-----------|
| `giftWrapping` | `boolean` | Có hỗ trợ gói quà | ❌ |
| `giftWrappingOptions` | `array` | Các loại gói quà (VD: ["Hộp giấy", "Túi vải", "Hộp cao cấp"]) | ❌ |
| `giftMessageEnabled` | `boolean` | Cho phép ghi lời chúc | ❌ |
| `giftMessageTemplate` | `string` | Template lời chúc mặc định | ❌ |
| `specialOccasions` | `array` | Dịp đặc biệt (VD: ["Valentine", "Sinh nhật", "8/3"]) | ❌ |

#### C. Media Mở Rộng

| Trường | Type | Mô Tả | Bắt Buộc |
|--------|------|-------|-----------|
| `videoUrl` | `string` | Video giới thiệu (YouTube/Vimeo) | ❌ |
| `videoThumbnail` | `string` | Thumbnail video | ❌ |
| `images360` | `array` | Hình ảnh 360 độ (array of URLs) | ❌ |
| `lifestyleImages` | `array` | Hình ảnh lifestyle (array of URLs) | ❌ |

#### D. Bộ Sưu Tập & Combo

| Trường | Type | Mô Tả | Bắt Buộc |
|--------|------|-------|-----------|
| `collection` | `string` | Bộ sưu tập (VD: "Teddy Classic", "Valentine 2025") | ❌ |
| `relatedProducts` | `array` | Sản phẩm liên quan (product IDs) | ❌ |
| `comboProducts` | `array` | Combo/Set sản phẩm | ❌ |
| `bundleDiscount` | `number` | Giảm giá khi mua combo (%) | ❌ |

#### E. Variant Mở Rộng

| Trường | Type | Mô Tả | Bắt Buộc |
|--------|------|-------|-----------|
| `image` | `string` | Ảnh riêng cho variant | ❌ |
| `weight` | `number` | Trọng lượng variant (gram) | ❌ |
| `dimensions` | `object` | Kích thước variant | ❌ |
| `isPopular` | `boolean` | Variant phổ biến | ❌ |

### 3.2. Frontend - Yêu Cầu Mới

#### A. UI/UX Cải Thiện

- ✅ **Tabbed Content:** Mô tả, Đặc điểm, Đánh giá, Hướng dẫn
- ✅ **Image Zoom:** Zoom ảnh khi hover/click
- ✅ **360 View:** Xem sản phẩm 360 độ
- ✅ **Video Player:** Video giới thiệu sản phẩm
- ✅ **Sticky Add to Cart:** Button sticky trên mobile
- ✅ **Quick View Modal:** Xem nhanh từ listing page

#### B. Tính Năng Quà Tặng

- ✅ **Gift Wrapping Selector:** Chọn loại gói quà
- ✅ **Gift Message Input:** Nhập lời chúc
- ✅ **Special Occasion Badge:** Hiển thị dịp đặc biệt
- ✅ **Gift Preview:** Xem trước gói quà

#### C. Social & Sharing

- ✅ **Social Share Buttons:** Facebook, Zalo, Copy link
- ✅ **Share Preview:** Preview khi share
- ✅ **Wishlist:** Thêm vào yêu thích

#### D. Cross-sell & Upsell

- ✅ **Related Products:** Sản phẩm liên quan
- ✅ **Frequently Bought Together:** Thường mua cùng
- ✅ **Combo Products:** Combo/Set sản phẩm
- ✅ **Collection View:** Xem bộ sưu tập

#### E. Thông Tin Chi Tiết

- ✅ **Product Specs Table:** Bảng thông số kỹ thuật
- ✅ **Care Instructions:** Hướng dẫn bảo quản
- ✅ **Safety Info:** Thông tin an toàn
- ✅ **Warranty Info:** Thông tin bảo hành

---

## 4. Chi Tiết Implementation

### 4.1. Database Schema Changes

#### A. Mở Rộng Product Interface

```typescript
// src/lib/schemas/product.ts

export interface Product {
  // ... existing fields ...
  
  // NEW: Chi tiết sản phẩm
  material?: string; // Chất liệu
  dimensions?: {
    length: number; // cm
    width: number; // cm
    height: number; // cm
  };
  weight?: number; // gram
  ageRange?: string; // "3+", "0-12 tháng"
  careInstructions?: string; // HTML
  safetyInfo?: string; // HTML
  warranty?: string; // "6 tháng"
  
  // NEW: Tính năng quà tặng
  giftWrapping?: boolean;
  giftWrappingOptions?: string[]; // ["Hộp giấy", "Túi vải", "Hộp cao cấp"]
  giftMessageEnabled?: boolean;
  giftMessageTemplate?: string;
  specialOccasions?: string[]; // ["Valentine", "Sinh nhật", "8/3"]
  
  // NEW: Media mở rộng
  videoUrl?: string; // YouTube/Vimeo URL
  videoThumbnail?: string;
  images360?: string[]; // Array of image URLs
  lifestyleImages?: string[]; // Array of image URLs
  
  // NEW: Bộ sưu tập & Combo
  collection?: string; // Collection name
  relatedProducts?: string[]; // Product IDs
  comboProducts?: Array<{
    productId: string;
    productName: string;
    discount?: number; // Percentage
  }>;
  bundleDiscount?: number; // Percentage
  
  // ... existing fields ...
}

export interface ProductVariant {
  // ... existing fields ...
  
  // NEW: Variant mở rộng
  image?: string; // Variant-specific image
  weight?: number; // gram
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isPopular?: boolean; // Popular variant flag
  
  // ... existing fields ...
}
```

#### B. Zod Schema Updates

```typescript
// src/lib/schemas/product.ts

export const productSchema = z.object({
  // ... existing fields ...
  
  // NEW: Chi tiết sản phẩm
  material: z.string().optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
  weight: z.number().min(0).optional(),
  ageRange: z.string().optional(),
  careInstructions: z.string().optional(),
  safetyInfo: z.string().optional(),
  warranty: z.string().optional(),
  
  // NEW: Tính năng quà tặng
  giftWrapping: z.boolean().optional(),
  giftWrappingOptions: z.array(z.string()).optional(),
  giftMessageEnabled: z.boolean().optional(),
  giftMessageTemplate: z.string().optional(),
  specialOccasions: z.array(z.string()).optional(),
  
  // NEW: Media mở rộng
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoThumbnail: z.string().url().optional().or(z.literal('')),
  images360: z.array(z.string().url()).optional(),
  lifestyleImages: z.array(z.string().url()).optional(),
  
  // NEW: Bộ sưu tập & Combo
  collection: z.string().optional(),
  relatedProducts: z.array(z.string()).optional(),
  comboProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    discount: z.number().min(0).max(100).optional(),
  })).optional(),
  bundleDiscount: z.number().min(0).max(100).optional(),
  
  // ... existing fields ...
});

export const variantSchema = z.object({
  // ... existing fields ...
  
  // NEW: Variant mở rộng
  image: z.string().url().optional().or(z.literal('')),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }).optional(),
  isPopular: z.boolean().optional(),
  
  // ... existing fields ...
});
```

---

### 4.2. CMS (Admin) - Component Updates

#### A. ProductFormV3 - Thêm Sections Mới

**File:** `src/components/admin/ProductFormV3.tsx`

**Thêm Sections:**

1. **Product Details Section** (Card mới)
   - Material input
   - Dimensions (length, width, height)
   - Weight input
   - Age range select
   - Care instructions (Rich text editor)
   - Safety info (Rich text editor)
   - Warranty input

2. **Gift Features Section** (Card mới)
   - Gift wrapping toggle
   - Gift wrapping options (multi-select)
   - Gift message enabled toggle
   - Gift message template (textarea)
   - Special occasions (multi-select với suggestions)

3. **Media Extended Section** (Card mới)
   - Video URL input (YouTube/Vimeo)
   - Video thumbnail upload
   - 360 images upload (multiple)
   - Lifestyle images upload (multiple)

4. **Collection & Combo Section** (Card mới)
   - Collection select/input
   - Related products selector (search + multi-select)
   - Combo products builder (add/remove combo items)
   - Bundle discount input

5. **Variant Form Enhancement**
   - Image upload per variant
   - Weight input per variant
   - Dimensions input per variant
   - "Popular" checkbox per variant

**Layout:**
- Sử dụng Accordion để group các sections
- Sidebar: Thêm "Gift Features" box
- Main content: Thêm 4 cards mới

#### B. New Components

**1. ProductDetailsSection.tsx**
```typescript
// src/components/admin/products/ProductDetailsSection.tsx
// Form section cho thông tin chi tiết sản phẩm
```

**2. GiftFeaturesSection.tsx**
```typescript
// src/components/admin/products/GiftFeaturesSection.tsx
// Form section cho tính năng quà tặng
```

**3. MediaExtendedSection.tsx**
```typescript
// src/components/admin/products/MediaExtendedSection.tsx
// Form section cho media mở rộng (video, 360, lifestyle)
```

**4. CollectionComboSection.tsx**
```typescript
// src/components/admin/products/CollectionComboSection.tsx
// Form section cho bộ sưu tập & combo
```

**5. VariantFormEnhanced.tsx**
```typescript
// src/components/admin/products/VariantFormEnhanced.tsx
// Enhanced variant form với image upload, weight, dimensions
```

**6. RelatedProductsSelector.tsx**
```typescript
// src/components/admin/products/RelatedProductsSelector.tsx
// Component để chọn sản phẩm liên quan (search + multi-select)
```

**7. ComboProductsBuilder.tsx**
```typescript
// src/components/admin/products/ComboProductsBuilder.tsx
// Component để build combo products với discount
```

---

### 4.3. Frontend - Component Updates

#### A. ProductDetailPage - Thêm Tabs & Sections

**File:** `src/app/(shop)/products/[slug]/page.tsx`

**Thay đổi chính:**

1. **Tabbed Content Layout**
   - Tab 1: "Mô tả" - Description, specs, care instructions
   - Tab 2: "Đặc điểm" - Features, material, dimensions, weight
   - Tab 3: "Đánh giá" - Reviews, ratings
   - Tab 4: "Hướng dẫn" - Care instructions, safety info, warranty

2. **Product Gallery Enhancement**
   - Image zoom on hover/click
   - 360 view button (nếu có images360)
   - Video thumbnail + play button (nếu có videoUrl)
   - Lifestyle images carousel

3. **Gift Features Section**
   - Gift wrapping selector (nếu giftWrapping = true)
   - Gift message input (nếu giftMessageEnabled = true)
   - Special occasion badges

4. **Product Specs Table**
   - Material, dimensions, weight, age range
   - Warranty, safety info

5. **Related Products Section**
   - Related products grid
   - Frequently bought together
   - Combo products with discount

6. **Social Sharing**
   - Share buttons (Facebook, Zalo, Copy link)
   - Share preview với Open Graph tags

#### B. New Components

**1. ProductTabs.tsx**
```typescript
// src/components/product/ProductTabs.tsx
// Tabbed content component (Mô tả, Đặc điểm, Đánh giá, Hướng dẫn)
```

**2. ProductSpecsTable.tsx**
```typescript
// src/components/product/ProductSpecsTable.tsx
// Bảng thông số kỹ thuật sản phẩm
```

**3. GiftFeaturesSection.tsx**
```typescript
// src/components/product/GiftFeaturesSection.tsx
// Section tính năng quà tặng (gift wrapping, message)
```

**4. Product360View.tsx**
```typescript
// src/components/product/Product360View.tsx
// Component xem sản phẩm 360 độ
```

**5. ProductVideoPlayer.tsx**
```typescript
// src/components/product/ProductVideoPlayer.tsx
// Video player cho video giới thiệu
```

**6. ImageZoom.tsx**
```typescript
// src/components/product/ImageZoom.tsx
// Image zoom component (hover/click to zoom)
```

**7. RelatedProducts.tsx**
```typescript
// src/components/product/RelatedProducts.tsx
// Related products grid
```

**8. FrequentlyBoughtTogether.tsx**
```typescript
// src/components/product/FrequentlyBoughtTogether.tsx
// "Thường mua cùng" section
```

**9. ComboProducts.tsx**
```typescript
// src/components/product/ComboProducts.tsx
// Combo/Set products với discount
```

**10. SocialShare.tsx**
```typescript
// src/components/product/SocialShare.tsx
// Social sharing buttons
```

**11. ProductGalleryEnhanced.tsx**
```typescript
// src/components/product/ProductGalleryEnhanced.tsx
// Enhanced gallery với zoom, 360, video support
```

---

## 5. Database Schema Changes

### 5.1. Migration Script

**File:** `scripts/migrate-product-schema.ts`

```typescript
// Script để migrate existing products
// - Add default values cho new fields
// - Migrate variant images nếu có
// - Update related products format
```

### 5.2. Indexes

**New Indexes:**
- `collection` - Index cho collection field
- `specialOccasions` - Index cho special occasions array
- `relatedProducts` - Index cho related products array

---

## 6. API Routes

### 6.1. Existing Routes - Updates

**File:** `src/app/api/admin/products/route.ts`
- Update POST handler để accept new fields
- Validate new fields với Zod schema

**File:** `src/app/api/admin/products/[id]/route.ts`
- Update PUT handler để accept new fields
- Validate new fields với Zod schema

**File:** `src/app/api/products/route.ts`
- Update GET handler để return new fields
- Filter by collection, specialOccasions

### 6.2. New Routes

**1. GET `/api/products/related?productId=xxx`**
- Lấy sản phẩm liên quan
- Based on category, tags, collection

**2. GET `/api/products/combo?productId=xxx`**
- Lấy combo products
- Calculate bundle discount

**3. GET `/api/products/collection?name=xxx`**
- Lấy sản phẩm trong collection

**4. POST `/api/products/share`**
- Generate share preview
- Return Open Graph data

---

## 7. Components

### 7.1. Admin Components (New)

| Component | File | Purpose |
|-----------|------|---------|
| ProductDetailsSection | `src/components/admin/products/ProductDetailsSection.tsx` | Form section cho thông tin chi tiết |
| GiftFeaturesSection | `src/components/admin/products/GiftFeaturesSection.tsx` | Form section cho tính năng quà tặng |
| MediaExtendedSection | `src/components/admin/products/MediaExtendedSection.tsx` | Form section cho media mở rộng |
| CollectionComboSection | `src/components/admin/products/CollectionComboSection.tsx` | Form section cho bộ sưu tập & combo |
| VariantFormEnhanced | `src/components/admin/products/VariantFormEnhanced.tsx` | Enhanced variant form |
| RelatedProductsSelector | `src/components/admin/products/RelatedProductsSelector.tsx` | Selector cho sản phẩm liên quan |
| ComboProductsBuilder | `src/components/admin/products/ComboProductsBuilder.tsx` | Builder cho combo products |

### 7.2. Frontend Components (New)

| Component | File | Purpose |
|-----------|------|---------|
| ProductTabs | `src/components/product/ProductTabs.tsx` | Tabbed content |
| ProductSpecsTable | `src/components/product/ProductSpecsTable.tsx` | Bảng thông số kỹ thuật |
| GiftFeaturesSection | `src/components/product/GiftFeaturesSection.tsx` | Section tính năng quà tặng |
| Product360View | `src/components/product/Product360View.tsx` | 360 view component |
| ProductVideoPlayer | `src/components/product/ProductVideoPlayer.tsx` | Video player |
| ImageZoom | `src/components/product/ImageZoom.tsx` | Image zoom |
| RelatedProducts | `src/components/product/RelatedProducts.tsx` | Related products grid |
| FrequentlyBoughtTogether | `src/components/product/FrequentlyBoughtTogether.tsx` | "Thường mua cùng" |
| ComboProducts | `src/components/product/ComboProducts.tsx` | Combo products |
| SocialShare | `src/components/product/SocialShare.tsx` | Social sharing |
| ProductGalleryEnhanced | `src/components/product/ProductGalleryEnhanced.tsx` | Enhanced gallery |

### 7.3. Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| ProductCard | `src/components/product/ProductCard.tsx` | Update để support new fields |
| VariantSelector | `src/components/product/VariantSelector.tsx` | Update để support variant images |

---

## 8. Timeline & Phân Công

### Phase 1: Database & Schema (2 ngày)

**Day 1:**
- ✅ Update Product interface
- ✅ Update Zod schemas
- ✅ Create migration script
- ✅ Test migration

**Day 2:**
- ✅ Add database indexes
- ✅ Update API routes validation
- ✅ Test API với new fields

### Phase 2: CMS (Admin) - 5 ngày

**Day 3-4: ProductFormV3 Updates**
- ✅ Add ProductDetailsSection
- ✅ Add GiftFeaturesSection
- ✅ Add MediaExtendedSection
- ✅ Update variant form

**Day 5: New Admin Components**
- ✅ RelatedProductsSelector
- ✅ ComboProductsBuilder
- ✅ VariantFormEnhanced

**Day 6: Integration & Testing**
- ✅ Integrate all sections vào ProductFormV3
- ✅ Test form submission
- ✅ Test validation

**Day 7: Polish & Documentation**
- ✅ UI/UX polish
- ✅ Error handling
- ✅ Documentation

### Phase 3: Frontend - 6 ngày

**Day 8-9: Product Detail Page Updates**
- ✅ Add ProductTabs component
- ✅ Add ProductSpecsTable
- ✅ Add GiftFeaturesSection
- ✅ Update ProductGallery

**Day 10: Media Components**
- ✅ Product360View
- ✅ ProductVideoPlayer
- ✅ ImageZoom
- ✅ ProductGalleryEnhanced

**Day 11: Cross-sell Components**
- ✅ RelatedProducts
- ✅ FrequentlyBoughtTogether
- ✅ ComboProducts

**Day 12: Social & Polish**
- ✅ SocialShare component
- ✅ SEO updates (Open Graph)
- ✅ UI/UX polish
- ✅ Mobile responsive

**Day 13: Testing & Bug Fixes**
- ✅ E2E testing
- ✅ Bug fixes
- ✅ Performance optimization

### Phase 4: Final Testing & Deployment (2 ngày)

**Day 14:**
- ✅ Integration testing
- ✅ Performance testing
- ✅ Security audit
- ✅ Documentation update

**Day 15:**
- ✅ Deployment
- ✅ Monitoring
- ✅ User feedback

---

## 9. Testing Checklist

### 9.1. CMS (Admin) Testing

- [ ] Tạo sản phẩm mới với đầy đủ fields
- [ ] Chỉnh sửa sản phẩm existing
- [ ] Validate tất cả fields
- [ ] Upload images (gallery, 360, lifestyle)
- [ ] Upload video
- [ ] Tạo variants với images
- [ ] Chọn related products
- [ ] Tạo combo products
- [ ] Test form validation
- [ ] Test form submission
- [ ] Test error handling

### 9.2. Frontend Testing

- [ ] Hiển thị product detail page
- [ ] Tabbed content hoạt động
- [ ] Image zoom hoạt động
- [ ] 360 view hoạt động
- [ ] Video player hoạt động
- [ ] Gift features hiển thị đúng
- [ ] Related products hiển thị
- [ ] Combo products hiển thị
- [ ] Social sharing hoạt động
- [ ] Add to cart với gift options
- [ ] Mobile responsive
- [ ] SEO (JSON-LD, Open Graph)

### 9.3. API Testing

- [ ] GET `/api/products` với new fields
- [ ] POST `/api/admin/products` với new fields
- [ ] PUT `/api/admin/products/[id]` với new fields
- [ ] GET `/api/products/related`
- [ ] GET `/api/products/combo`
- [ ] GET `/api/products/collection`
- [ ] Error handling
- [ ] Validation

### 9.4. Performance Testing

- [ ] Page load time < 2s
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Bundle size check
- [ ] Database query optimization

### 9.5. Security Testing

- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication/Authorization
- [ ] File upload security

---

## 10. Success Metrics

### 10.1. Technical Metrics

- ✅ All tests passing
- ✅ Page load time < 2s
- ✅ Bundle size < 300KB
- ✅ Lighthouse score > 90
- ✅ Zero security vulnerabilities

### 10.2. Business Metrics

- ✅ Tăng tỷ lệ chuyển đổi 20%
- ✅ Tăng thời gian trên trang 30%
- ✅ Tăng add to cart rate 15%
- ✅ Tăng gift wrapping usage 25%

---

## 11. Notes & Considerations

### 11.1. Backward Compatibility

- ✅ Existing products sẽ có default values cho new fields
- ✅ Migration script sẽ handle existing data
- ✅ API sẽ return new fields với default values nếu null

### 11.2. Performance

- ✅ Lazy load 360 images
- ✅ Lazy load video player
- ✅ Image optimization (next/image)
- ✅ Code splitting cho new components

### 11.3. SEO

- ✅ Structured data (JSON-LD) với new fields
- ✅ Open Graph tags cho social sharing
- ✅ Meta descriptions với new info
- ✅ Alt text cho all images

### 11.4. Accessibility

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast

---

## 12. Future Enhancements

### 12.1. Phase 2 Features (Future)

- [ ] AR/VR preview
- [ ] Customization tool (màu sắc, kích thước)
- [ ] Product comparison
- [ ] Wishlist với sharing
- [ ] Product reviews system
- [ ] Q&A section
- [ ] Live chat support
- [ ] Product recommendations (AI)

### 12.2. Analytics

- [ ] Track gift wrapping usage
- [ ] Track video views
- [ ] Track 360 view usage
- [ ] Track combo purchases
- [ ] A/B testing cho layouts

---

**Document Version:** 1.0  
**Last Updated:** 5 tháng 12, 2025  
**Status:** Draft - Ready for Review  
**Next Steps:** Review & Approval → Start Phase 1

