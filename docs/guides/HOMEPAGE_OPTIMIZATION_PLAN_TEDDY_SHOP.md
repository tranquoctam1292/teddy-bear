# 📋 KẾ HOẠCH TỐI ƯU HOMEPAGE - Website Bán Gấu Bông

**Dự án:** Homepage Optimization for Teddy Shop  
**Ngày tạo:** December 5, 2025  
**Mục tiêu:** Tối ưu homepage để tăng conversion rate và engagement cho ngành bán gấu bông  
**Timeline:** 4-6 tuần (Phase 7-9)

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### Điểm Mạnh Hiện Tại

- ✅ Cấu trúc cơ bản tốt (Hero, Products, Trust Signals, Testimonials, Blog, Newsletter)
- ✅ UX/UI chất lượng cao (responsive, performance, accessibility)
- ✅ Technical foundation vững chắc (Next.js 16, TypeScript, Server Components)

### Điểm Yếu Cần Cải Thiện

| Vấn Đề | Priority | Impact | Effort |
|--------|----------|--------|--------|
| **Thiếu Category Showcase** | HIGH | ⭐⭐⭐⭐⭐ | Medium |
| **Hero messaging generic** | HIGH | ⭐⭐⭐⭐⭐ | Low |
| **Thiếu Gift Guide** | MEDIUM | ⭐⭐⭐⭐ | Medium |
| **Product Card thiếu details** | MEDIUM | ⭐⭐⭐⭐ | Low |
| **Thiếu Visual Storytelling** | LOW | ⭐⭐⭐ | High |
| **Thiếu Age Recommendation** | LOW | ⭐⭐ | Medium |

---

## 🎯 MỤC TIÊU TỐI ƯU

### Business Goals

1. **Tăng Conversion Rate:** +25% trong 3 tháng
2. **Tăng Average Order Value:** +15% thông qua cross-selling
3. **Giảm Bounce Rate:** -20% thông qua better product discovery
4. **Tăng Engagement:** +30% time on page

### User Experience Goals

1. **Dễ dàng khám phá sản phẩm:** Category showcase rõ ràng
2. **Emotional connection:** Storytelling về ý nghĩa gấu bông
3. **Gift selection:** Hướng dẫn chọn quà theo dịp
4. **Product information:** Đầy đủ thông tin (size, age, material)

---

## 🚀 PHASE 7: CATEGORY & EMOTIONAL STORYTELLING

**Timeline:** Tuần 1-2  
**Priority:** HIGH  
**Impact:** ⭐⭐⭐⭐⭐

### 7.1 Category Showcase Section

**Mục tiêu:** Giúp khách hàng dễ dàng khám phá các bộ sưu tập chính

**Deliverables:**

1. **Category Data Model** (`src/lib/mock-data.ts`)
   ```typescript
   export interface Category {
     id: string;
     name: string;
     slug: string;
     description: string;
     image: string;
     productCount: number;
     icon?: string; // Lucide icon name
     featured?: boolean;
   }
   
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
   ```

2. **Category Showcase Component** (`src/components/homepage/sections/category-showcase.tsx`)
   - Server Component
   - Grid layout: Mobile 2 cols, Tablet 3 cols, Desktop 4-6 cols
   - Card design với:
     - Category image (aspect-ratio 4:3)
     - Icon (Lucide React)
     - Category name
     - Description
     - Product count badge
     - Hover effect (scale + shadow)
   - Link đến category page

3. **Integration vào Homepage**
   - Vị trí: Sau Hero Slider, trước Features List
   - Heading: "Khám Phá Bộ Sưu Tập"
   - Subheading: "Tìm người bạn đồng hành hoàn hảo cho bạn"

**Success Metrics:**
- Category click-through rate > 15%
- Time on category pages +20%
- Cross-category browsing +30%

---

### 7.2 Emotional Hero Messaging

**Mục tiêu:** Tạo emotional connection với khách hàng

**Deliverables:**

1. **Update Hero Slides** (`src/app/(shop)/page.tsx`)
   ```typescript
   const HERO_SLIDES = [
     {
       id: '1',
       image: 'https://placehold.co/1920x800/ec4899/white?text=Emotional+Connection',
       imageAlt: 'Gấu bông - Người bạn đồng hành',
       heading: 'Mỗi Chú Gấu Là Một Kỷ Niệm Đẹp',
       subheading: 'Tìm người bạn đồng hành hoàn hảo',
       description: 'Gấu bông không chỉ là món đồ chơi, mà là người bạn thân thiết, lưu giữ những khoảnh khắc đáng nhớ trong cuộc sống.',
       primaryButton: {
         text: 'Khám Phá Bộ Sưu Tập',
         link: '/products',
         style: 'primary' as const,
       },
       secondaryButton: {
         text: 'Tìm Quà Tặng',
         link: '/gift-guide',
         style: 'outline' as const,
       },
       textAlign: 'center' as const,
       textColor: 'light',
     },
     {
       id: '2',
       image: 'https://placehold.co/1920x800/f472b6/white?text=Perfect+Gift',
       imageAlt: 'Quà tặng ý nghĩa',
       heading: 'Quà Tặng Ý Nghĩa Cho Người Thân Yêu',
       subheading: 'Món quà từ trái tim',
       description: 'Tặng gấu bông là cách thể hiện tình cảm chân thành. Mỗi chú gấu mang theo thông điệp yêu thương và sự quan tâm.',
       primaryButton: {
         text: 'Xem Gift Guide',
         link: '/gift-guide',
         style: 'primary' as const,
       },
       textAlign: 'left' as const,
       textColor: 'light',
     },
     {
       id: '3',
       image: 'https://placehold.co/1920x800/db2777/white?text=Quality+Safety',
       imageAlt: 'Chất lượng và an toàn',
       heading: 'Chất Lượng Cao Cấp - An Toàn Tuyệt Đối',
       subheading: 'Cam kết cho sức khỏe và niềm vui',
       description: 'Tất cả sản phẩm được kiểm định chất lượng, an toàn cho trẻ em, mềm mại và bền đẹp theo thời gian.',
       primaryButton: {
         text: 'Tìm Hiểu Thêm',
         link: '/about',
         style: 'primary' as const,
       },
       textAlign: 'right' as const,
       textColor: 'light',
     },
   ];
   ```

2. **Visual Updates**
   - Sử dụng images thực tế (không phải placehold.co)
   - Images thể hiện:
     - Trẻ em ôm gấu bông
     - Quà tặng được gói đẹp
     - Gấu bông trong môi trường thực tế

**Success Metrics:**
- Hero engagement rate +25%
- Emotional connection score +30% (survey)
- Conversion từ hero CTA +20%

---

## 🎁 PHASE 8: GIFT GUIDE & PRODUCT ENHANCEMENTS

**Timeline:** Tuần 3-4  
**Priority:** MEDIUM  
**Impact:** ⭐⭐⭐⭐

### 8.1 Gift Guide Section

**Mục tiêu:** Hướng dẫn khách hàng chọn quà theo dịp

**Deliverables:**

1. **Gift Guide Data Model** (`src/lib/mock-data.ts`)
   ```typescript
   export interface GiftOccasion {
     id: string;
     name: string;
     slug: string;
     description: string;
     icon: string; // Lucide icon
     image: string;
     productIds: string[]; // Recommended products
     priceRange?: {
       min: number;
       max: number;
     };
   }
   
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
   ```

2. **Gift Guide Component** (`src/components/homepage/sections/gift-guide.tsx`)
   - Server Component
   - Grid layout: Mobile 2 cols, Tablet 3 cols, Desktop 3 cols
   - Card design với:
     - Occasion image
     - Icon
     - Occasion name
     - Description
     - Price range badge
     - "Xem Gợi Ý" button
   - Link đến gift guide page với filter

3. **Integration vào Homepage**
   - Vị trí: Sau Featured Products, trước CTA Banner
   - Heading: "Tìm Quà Tặng Hoàn Hảo"
   - Subheading: "Gợi ý quà tặng theo từng dịp đặc biệt"

**Success Metrics:**
- Gift guide click-through rate > 20%
- Conversion từ gift guide +30%
- Average order value +15%

---

### 8.2 Enhanced Product Cards

**Mục tiêu:** Hiển thị đầy đủ thông tin sản phẩm ngay trên card

**Deliverables:**

1. **Update Product Interface** (`src/lib/mock-data.ts`)
   ```typescript
   export interface HomepageProduct {
     id: string;
     name: string;
     slug: string;
     price: number;
     originalPrice?: number;
     rating?: number;
     image: string;
     badge?: 'hot' | 'new' | 'sale';
     category?: string;
     // NEW FIELDS
     size?: 'S' | 'M' | 'L' | 'XL' | 'XXL';
     ageRecommendation?: '0-3' | '3-6' | '6+' | 'all';
     material?: string; // e.g., "Cotton 100%", "Polyester"
     dimensions?: {
       height: number; // cm
       width: number; // cm
     };
   }
   ```

2. **Update Product Card Component** (`src/components/homepage/sections/product-card.tsx`)
   - Thêm size badge (S/M/L/XL) ở góc trên bên phải
   - Thêm age recommendation badge (0-3, 3-6, 6+)
   - Thêm material info (tooltip hoặc expandable)
   - Thêm dimensions info (hover tooltip)
   - Visual indicators:
     - Size: Color-coded badges
     - Age: Icon badges (Baby, Child, All)
     - Material: Text badge

3. **Product Card Layout**
   ```
   [Image with badges]
   - Size badge (top-right)
   - Age badge (top-left)
   - Hot/New/Sale badge (existing)
   - Discount % (existing)
   
   [Product Info]
   - Name
   - Rating
   - Price
   - Material (small text, optional)
   - Add to Cart button
   ```

**Success Metrics:**
- Product detail page bounce rate -20%
- Quick decision rate +25%
- Product information satisfaction +30%

---

## 🎬 PHASE 9: VISUAL STORYTELLING & AGE RECOMMENDATIONS

**Timeline:** Tuần 5-6  
**Priority:** LOW  
**Impact:** ⭐⭐⭐

### 9.1 Video/Image Gallery Section

**Mục tiêu:** Showcase sản phẩm qua visual content

**Deliverables:**

1. **Video Gallery Component** (`src/components/homepage/sections/video-showcase.tsx`)
   - Client Component (video player)
   - Embed YouTube/Vimeo videos
   - Video types:
     - Unboxing videos
     - Product in use (trẻ em chơi với gấu)
     - Quality close-ups
     - Size comparison
   - Thumbnail grid với play button overlay

2. **Image Gallery Component** (đã có `ImageGallery.tsx`)
   - Enhance với:
     - Product lifestyle images
     - Quality close-ups
     - Size comparison
     - Material details

3. **Integration vào Homepage**
   - Vị trí: Sau Testimonials, trước Blog Posts
   - Heading: "Khám Phá Sản Phẩm"
   - Subheading: "Xem gấu bông trong cuộc sống thực tế"

**Success Metrics:**
- Video engagement rate > 40%
- Gallery interaction rate +25%
- Trust score +15%

---

### 9.2 Age Recommendation Section

**Mục tiêu:** Hướng dẫn chọn gấu bông theo độ tuổi

**Deliverables:**

1. **Age Recommendation Data** (`src/lib/mock-data.ts`)
   ```typescript
   export interface AgeGroup {
     id: string;
     ageRange: string;
     name: string;
     description: string;
     icon: string;
     safetyFeatures: string[];
     productIds: string[];
   }
   
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
       icon: 'Child',
       safetyFeatures: [
         'Kích thước vừa phải',
         'Màu sắc tươi sáng',
         'Dễ cầm nắm',
       ],
       productIds: ['1', '3', '6'],
     },
     {
       id: '3',
       ageRange: '6+',
       name: 'Trẻ Em & Người Lớn',
       description: 'Gấu bông đa dạng, phù hợp mọi sở thích',
       icon: 'Users',
       safetyFeatures: [
         'Đa dạng kích thước',
         'Nhiều nhân vật',
         'Chất lượng cao cấp',
       ],
       productIds: ['1', '2', '3', '4', '5', '6', '7', '8'],
     },
   ];
   ```

2. **Age Recommendation Component** (`src/components/homepage/sections/age-recommendation.tsx`)
   - Server Component
   - Tab layout hoặc accordion
   - Mỗi age group có:
     - Icon
     - Age range
     - Description
     - Safety features list
     - Recommended products grid (3-4 products)
   - Link đến filtered product page

3. **Integration vào Homepage**
   - Vị trí: Sau Gift Guide, trước Countdown Timer
   - Heading: "Chọn Gấu Bông Theo Độ Tuổi"
   - Subheading: "An toàn và phù hợp cho mọi lứa tuổi"

**Success Metrics:**
- Age filter usage +40%
- Safety concern reduction -30%
- Conversion từ age recommendation +20%

---

## 📐 LAYOUT TỐI ƯU (FINAL STRUCTURE)

### Homepage Section Order (Optimized)

```
1. Hero Slider (Emotional messaging)
   ↓
2. Category Showcase (NEW - Phase 7)
   ↓
3. Trust Signals (Features List)
   ↓
4. Featured Products (Best Sellers)
   ↓
5. Gift Guide (NEW - Phase 8)
   ↓
6. Age Recommendation (NEW - Phase 9)
   ↓
7. Promotional (CTA Banner)
   ↓
8. Urgency (Countdown Timer)
   ↓
9. Social Proof (Testimonials)
   ↓
10. Visual Storytelling (Video/Image Gallery - NEW - Phase 9)
   ↓
11. Content (Blog Posts)
   ↓
12. Retention (Newsletter)
```

**Rationale:**
- **Hero → Category:** Immediate product discovery
- **Products → Gift Guide:** Natural flow từ browsing đến gifting
- **Age Recommendation:** Address safety concerns early
- **Visual Storytelling:** Build trust after social proof
- **Newsletter:** Final retention touchpoint

---

## 📊 SUCCESS METRICS & KPIs

### Primary Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| **Conversion Rate** | 2.5% | 3.1% (+25%) | Google Analytics |
| **Average Order Value** | 350,000 VND | 402,500 VND (+15%) | E-commerce platform |
| **Bounce Rate** | 45% | 36% (-20%) | Google Analytics |
| **Time on Page** | 2:30 | 3:15 (+30%) | Google Analytics |
| **Category CTR** | N/A | >15% | Custom tracking |
| **Gift Guide CTR** | N/A | >20% | Custom tracking |

### Secondary Metrics

- **Hero Engagement Rate:** >60%
- **Product Card Interaction:** >40%
- **Video Play Rate:** >40%
- **Age Filter Usage:** >15%
- **Cross-category Browsing:** +30%

### Measurement Tools

- Google Analytics 4
- Hotjar (heatmaps, session recordings)
- Custom event tracking
- User surveys (emotional connection score)

---

## 🛠️ IMPLEMENTATION ROADMAP

### Week 1-2: Phase 7 (Category & Emotional)

**Tasks:**
- [ ] Create Category data model
- [ ] Build Category Showcase component
- [ ] Update Hero slides với emotional messaging
- [ ] Integrate vào homepage
- [ ] Test responsive design
- [ ] Deploy to staging

**Deliverables:**
- Category Showcase section
- Updated Hero slides
- Updated homepage layout

---

### Week 3-4: Phase 8 (Gift Guide & Product Enhancement)

**Tasks:**
- [ ] Create Gift Guide data model
- [ ] Build Gift Guide component
- [ ] Update Product interface với size/age/material
- [ ] Enhance Product Card component
- [ ] Integrate vào homepage
- [ ] Test product card enhancements
- [ ] Deploy to staging

**Deliverables:**
- Gift Guide section
- Enhanced Product Cards
- Updated product data model

---

### Week 5-6: Phase 9 (Visual & Age)

**Tasks:**
- [ ] Create Video Showcase component
- [ ] Enhance Image Gallery
- [ ] Create Age Recommendation data model
- [ ] Build Age Recommendation component
- [ ] Integrate vào homepage
- [ ] Final testing
- [ ] Deploy to production

**Deliverables:**
- Video/Image Gallery section
- Age Recommendation section
- Final optimized homepage

---

## 🎨 DESIGN GUIDELINES

### Visual Style

- **Colors:** Giữ nguyên Pink theme, thêm warm tones cho emotional sections
- **Typography:** Emphasize emotional words với larger font sizes
- **Images:** Real product photos, lifestyle images, không dùng placeholders
- **Icons:** Lucide React icons, consistent style

### Component Patterns

- **Cards:** Consistent border-radius, shadow, hover effects
- **Badges:** Color-coded (size, age, material)
- **Buttons:** Primary (pink), Secondary (outline), consistent sizing
- **Spacing:** 8px grid system, consistent gaps

### Responsive Breakpoints

- **Mobile:** < 640px (2 cols max)
- **Tablet:** 640px - 1024px (3 cols max)
- **Desktop:** > 1024px (4-6 cols)

---

## 🧪 TESTING STRATEGY

### Unit Tests

- Component rendering
- Data model validation
- Props handling

### Integration Tests

- Homepage assembly
- Section ordering
- Link navigation

### E2E Tests

- User journey: Hero → Category → Product
- Gift guide flow
- Age recommendation filter

### Performance Tests

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### Accessibility Tests

- WCAG 2.1 AA compliance
- Screen reader testing
- Keyboard navigation

---

## 📝 DOCUMENTATION REQUIREMENTS

### Technical Documentation

- Component API documentation
- Data model schemas
- Integration guides

### User Documentation

- Gift guide content
- Age recommendation explanations
- Category descriptions

### Marketing Documentation

- Emotional messaging guidelines
- Visual content guidelines
- Brand voice guidelines

---

## 🚀 DEPLOYMENT PLAN

### Pre-Deployment Checklist

- [ ] All components tested
- [ ] Performance optimized
- [ ] Accessibility verified
- [ ] SEO metadata updated
- [ ] Analytics tracking configured
- [ ] Images optimized (WebP format)
- [ ] CDN configured

### Deployment Strategy

1. **Staging Deployment:** Week 2, 4, 6
2. **A/B Testing:** Week 3, 5 (optional)
3. **Production Deployment:** Week 6
4. **Monitoring:** Week 7-8 (post-deployment)

### Rollback Plan

- Feature flags for new sections
- Gradual rollout (10% → 50% → 100%)
- Quick rollback capability

---

## 📈 POST-DEPLOYMENT OPTIMIZATION

### Week 7-8: Monitoring & Analysis

- Monitor key metrics
- Collect user feedback
- Analyze heatmaps
- Identify bottlenecks

### Week 9-10: Iterative Improvements

- Optimize based on data
- A/B test messaging
- Refine component designs
- Improve conversion funnels

---

## 🎯 EXPECTED OUTCOMES

### Short-term (1-2 months)

- ✅ Category discovery +30%
- ✅ Gift guide usage +25%
- ✅ Product information satisfaction +30%
- ✅ Emotional engagement +25%

### Long-term (3-6 months)

- ✅ Conversion rate +25%
- ✅ Average order value +15%
- ✅ Customer lifetime value +20%
- ✅ Brand recognition +40%

---

## 📚 RESOURCES & REFERENCES

### Design Inspiration

- Build-A-Bear Workshop homepage
- Jellycat website
- Steiff website
- Vietnamese e-commerce sites (Tiki, Shopee)

### Best Practices

- E-commerce conversion optimization
- Emotional design principles
- Gift guide UX patterns
- Age-appropriate product recommendations

---

## ✅ CONCLUSION

Kế hoạch này sẽ biến homepage từ "tốt về mặt kỹ thuật" thành "tối ưu cho ngành bán gấu bông" thông qua:

1. **Category Showcase:** Dễ dàng khám phá sản phẩm
2. **Emotional Storytelling:** Tạo connection với khách hàng
3. **Gift Guide:** Hướng dẫn chọn quà theo dịp
4. **Product Enhancements:** Đầy đủ thông tin sản phẩm
5. **Visual Storytelling:** Build trust qua video/images
6. **Age Recommendations:** Address safety concerns

**Timeline:** 4-6 tuần  
**Expected ROI:** +25% conversion rate, +15% AOV  
**Status:** Ready for implementation

---

**Kế hoạch được tạo bởi:** Senior UX/UI Consultant  
**Ngày:** December 5, 2025  
**Version:** 1.0.0

