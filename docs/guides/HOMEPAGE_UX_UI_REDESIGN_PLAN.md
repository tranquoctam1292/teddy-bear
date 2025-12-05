# 🎨 PLAN THIẾT KẾ LẠI GIAO DIỆN HOMEPAGE - CHUẨN UX/UI

**Ngày tạo:** December 5, 2025  
**Phiên bản:** 1.0  
**Mục tiêu:** Thiết kế lại HomePage với UX/UI hiện đại, chuyên nghiệp, tối ưu conversion

---

## 📋 MỤC LỤC

1. [Phân tích hiện trạng](#1-phân-tích-hiện-trạng)
2. [Mục tiêu UX/UI](#2-mục-tiêu-uxui)
3. [Design System](#3-design-system)
4. [Layout Architecture](#4-layout-architecture)
5. [Component Improvements](#5-component-improvements)
6. [Responsive Design](#6-responsive-design)
7. [Performance Optimization](#7-performance-optimization)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### ✅ Điểm mạnh hiện tại

- **Hệ thống section linh hoạt:** 15 section types, drag & drop builder
- **SEO tốt:** Schema.org, metadata, ISR caching
- **Performance:** Dynamic imports, bundle optimization (-44%)
- **Responsive cơ bản:** Mobile-friendly với Tailwind breakpoints

### ❌ Vấn đề cần cải thiện

#### 1.1 Visual Hierarchy

| Vấn đề                          | Mô tả                                          | Impact    |
| ------------------------------- | ---------------------------------------------- | --------- |
| **Thiếu container constraints** | Sections full-width, khó đọc trên màn hình lớn | ⚠️ Medium |
| **Spacing không nhất quán**     | Padding/margin khác nhau giữa sections         | ⚠️ Medium |
| **Typography scale**            | Font sizes không có hierarchy rõ ràng          | ⚠️ Low    |
| **Color contrast**              | Một số text trên background không đủ contrast  | 🔴 High   |

#### 1.2 User Experience

| Vấn đề              | Mô tả                                   | Impact    |
| ------------------- | --------------------------------------- | --------- |
| **Hero section**    | Thiếu visual impact, CTA không nổi bật  | 🔴 High   |
| **Product cards**   | Layout đơn điệu, thiếu hover effects    | ⚠️ Medium |
| **Navigation flow** | Không có breadcrumbs, scroll indicators | ⚠️ Low    |
| **Loading states**  | Thiếu skeletons cho async sections      | ⚠️ Medium |

#### 1.3 Design Consistency

| Vấn đề             | Mô tả                                            | Impact    |
| ------------------ | ------------------------------------------------ | --------- |
| **Color palette**  | Pink theme chưa được áp dụng nhất quán           | ⚠️ Medium |
| **Button styles**  | Nhiều variant khác nhau, không thống nhất        | ⚠️ Low    |
| **Card designs**   | Product cards vs Feature cards khác style        | ⚠️ Medium |
| **Spacing system** | Không có spacing scale chuẩn (4px, 8px, 16px...) | ⚠️ Medium |

---

## 2. MỤC TIÊU UX/UI

### 🎯 Core Principles

1. **Clarity First** - Nội dung dễ đọc, hierarchy rõ ràng
2. **Consistency** - Design system thống nhất toàn bộ homepage
3. **Conversion Focus** - Tối ưu cho mục tiêu: Browse → Add to Cart → Checkout
4. **Performance** - Fast loading, smooth animations
5. **Accessibility** - WCAG 2.1 AA compliance

### 📊 Success Metrics

| Metric                  | Hiện tại | Mục tiêu | Cải thiện |
| ----------------------- | -------- | -------- | --------- |
| **Bounce Rate**         | -        | < 40%    | -         |
| **Time on Page**        | -        | > 2 phút | -         |
| **Scroll Depth**        | -        | > 75%    | -         |
| **CTR Hero CTA**        | -        | > 5%     | -         |
| **Product Card Clicks** | -        | > 8%     | -         |
| **Lighthouse Score**    | 92       | 95+      | +3        |
| **Accessibility Score** | -        | 100      | -         |

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette (Refined)

#### Primary Colors (Pink Theme)

```css
/* Primary Pink - Brand Color */
--pink-50: #fdf2f8; /* Backgrounds */
--pink-100: #fce7f3; /* Light backgrounds */
--pink-200: #fbcfe8; /* Borders, dividers */
--pink-500: #ec4899; /* Primary actions */
--pink-600: #db2777; /* Hover states */
--pink-700: #be185d; /* Active states */

/* Accent Colors */
--cream-50: #fefbf7; /* Neutral backgrounds */
--cream-100: #fdf6ed; /* Card backgrounds */
--brown-600: #8b7355; /* Text accents */
```

#### Semantic Colors

```css
/* Success */
--green-50: #f0fdf4;
--green-500: #22c55e;
--green-600: #16a34a;

/* Warning */
--yellow-50: #fefce8;
--yellow-500: #eab308;
--yellow-600: #ca8a04;

/* Error */
--red-50: #fef2f2;
--red-500: #ef4444;
--red-600: #dc2626;

/* Neutral */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-500: #6b7280;
--gray-900: #111827;
```

### 3.2 Typography Scale

```css
/* Font Families */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-display: 'Inter', var(--font-sans); /* For headings */

/* Font Sizes */
--text-xs: 0.75rem; /* 12px - Captions */
--text-sm: 0.875rem; /* 14px - Body small */
--text-base: 1rem; /* 16px - Body */
--text-lg: 1.125rem; /* 18px - Body large */
--text-xl: 1.25rem; /* 20px - Subheadings */
--text-2xl: 1.5rem; /* 24px - H4 */
--text-3xl: 1.875rem; /* 30px - H3 */
--text-4xl: 2.25rem; /* 36px - H2 */
--text-5xl: 3rem; /* 48px - H1 */
--text-6xl: 3.75rem; /* 60px - Hero H1 */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 3.3 Spacing System (8px Grid)

```css
/* Spacing Scale */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */

/* Section Padding */
--section-padding-mobile: var(--space-12); /* 48px */
--section-padding-desktop: var(--space-20); /* 80px */
```

### 3.4 Border Radius

```css
--radius-sm: 0.25rem; /* 4px - Small elements */
--radius-md: 0.375rem; /* 6px - Default */
--radius-lg: 0.5rem; /* 8px - Cards */
--radius-xl: 0.75rem; /* 12px - Large cards */
--radius-2xl: 1rem; /* 16px - Hero sections */
--radius-full: 9999px; /* Pills, badges */
```

### 3.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 3.6 Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px; /* Small tablets */
--breakpoint-md: 768px; /* Tablets */
--breakpoint-lg: 1024px; /* Desktop */
--breakpoint-xl: 1280px; /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

---

## 4. LAYOUT ARCHITECTURE

### 4.1 Container System

#### Max-Width Containers

```typescript
// Container variants for different content types
const CONTAINER_VARIANTS = {
  'full-width': 'w-full', // Hero sections, banners
  narrow: 'max-w-4xl mx-auto', // Text content, forms
  standard: 'max-w-7xl mx-auto', // Product grids, features
  wide: 'max-w-[1400px] mx-auto', // Large galleries
} as const;
```

**Áp dụng:**

- **Hero Sections:** `full-width` (100vw)
- **Text Content:** `narrow` (max-w-4xl = 896px)
- **Product Grids:** `standard` (max-w-7xl = 1280px)
- **Image Galleries:** `wide` (max-w-[1400px] = 1400px)

### 4.2 Section Spacing

```typescript
// Consistent vertical spacing between sections
const SECTION_SPACING = {
  mobile: 'py-12', // 48px top/bottom
  tablet: 'py-16', // 64px top/bottom
  desktop: 'py-20', // 80px top/bottom
} as const;
```

### 4.3 Grid System

```typescript
// Responsive grid patterns
const GRID_PATTERNS = {
  // Product grids
  products: {
    mobile: 'grid-cols-2 gap-4',
    tablet: 'sm:grid-cols-3 gap-6',
    desktop: 'lg:grid-cols-4 gap-8',
  },
  // Feature lists
  features: {
    mobile: 'grid-cols-1 gap-6',
    tablet: 'md:grid-cols-2 gap-8',
    desktop: 'lg:grid-cols-3 gap-10',
  },
  // Blog posts
  blog: {
    mobile: 'grid-cols-1 gap-6',
    tablet: 'md:grid-cols-2 gap-8',
    desktop: 'lg:grid-cols-3 gap-10',
  },
} as const;
```

---

## 5. COMPONENT IMPROVEMENTS

### 5.1 Hero Section (Priority: HIGH)

#### Current Issues:

- ❌ Text quá dài, khó scan
- ❌ CTA buttons không đủ nổi bật
- ❌ Thiếu visual hierarchy
- ❌ Background image có thể che text

#### Redesign Plan:

**A. Hero Banner Component**

```typescript
// Enhanced HeroBanner with better UX
interface EnhancedHeroBanner {
  // Layout
  layout: 'centered' | 'left-aligned' | 'split';
  containerWidth: 'full' | 'standard' | 'narrow';

  // Content
  heading: string;
  subheading?: string;
  description?: string;

  // CTAs
  primaryCTA: {
    text: string;
    href: string;
    variant: 'solid' | 'outline';
    size: 'lg' | 'xl';
  };
  secondaryCTA?: {
    text: string;
    href: string;
    variant: 'ghost' | 'outline';
  };

  // Visual
  backgroundImage?: string;
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number; // 0-1
  };
  textColor: 'light' | 'dark';

  // Trust indicators
  showTrustBadges?: boolean;
  trustBadges?: string[]; // "Free Shipping", "100% Quality", etc.
}
```

**Design Specifications:**

1. **Typography:**

   - Heading: `text-5xl md:text-6xl lg:text-7xl font-bold`
   - Subheading: `text-2xl md:text-3xl font-semibold`
   - Description: `text-lg md:text-xl text-opacity-90`

2. **CTA Buttons:**

   - Primary: `bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg shadow-lg`
   - Secondary: `bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white`

3. **Spacing:**

   - Container padding: `px-4 sm:px-6 lg:px-8`
   - Section padding: `py-20 md:py-32 lg:py-40`
   - Content gap: `space-y-6 md:space-y-8`

4. **Responsive:**
   - Mobile: Stacked layout, centered text
   - Desktop: Split layout (text left, image right)

**Files to Update:**

- `src/components/homepage/sections/HeroBanner.tsx`
- `src/components/homepage/sections/HeroSlider.tsx`

---

### 5.2 Product Cards (Priority: HIGH)

#### Current Issues:

- ❌ Layout đơn điệu
- ❌ Thiếu hover effects
- ❌ Price display không rõ ràng
- ❌ Add to cart button không nổi bật

#### Redesign Plan:

**A. Enhanced Product Card**

```typescript
interface EnhancedProductCard {
  // Layout
  variant: 'default' | 'compact' | 'featured';
  imageAspectRatio: 'square' | 'portrait' | 'landscape';

  // Content
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: 'hot' | 'new' | 'sale' | 'bestseller';

  // Actions
  showQuickView: boolean;
  showAddToCart: boolean;
  showWishlist: boolean;

  // Hover effects
  hoverEffect: 'lift' | 'zoom' | 'overlay';
}
```

**Design Specifications:**

1. **Card Structure:**

   ```
   ┌─────────────────────┐
   │   [Image + Badge]   │
   │                     │
   │   [Quick Actions]   │ (on hover)
   ├─────────────────────┤
   │   Product Name      │
   │   Price + Rating    │
   │   [Add to Cart]     │
   └─────────────────────┘
   ```

2. **Hover Effects:**

   - **Lift:** `transform translate-y-[-4px] shadow-xl`
   - **Zoom:** `scale-105 transition-transform`
   - **Overlay:** Dark overlay với quick actions

3. **Badge Styles:**

   ```css
   .badge-hot {
     @apply bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold;
   }
   .badge-new {
     @apply bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold;
   }
   .badge-sale {
     @apply bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold;
   }
   ```

4. **Price Display:**
   ```tsx
   <div className="flex items-baseline gap-2">
     <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
     {originalPrice && (
       <span className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</span>
     )}
     {discount && <span className="text-sm font-semibold text-red-600">-{discount}%</span>}
   </div>
   ```

**Files to Update:**

- `src/components/product/ProductCard.tsx`
- `src/components/shop/ProductCard.tsx` (nếu khác)

---

### 5.3 Section Headers (Priority: MEDIUM)

#### Current Issues:

- ❌ Headers không nhất quán
- ❌ Thiếu visual separation
- ❌ "View All" link không rõ ràng

#### Redesign Plan:

**A. Standardized Section Header**

```typescript
interface SectionHeader {
  heading: string;
  subheading?: string;
  alignment: 'left' | 'center' | 'right';
  showViewAll?: boolean;
  viewAllLink?: string;
  badge?: string; // "New", "Hot", etc.
}
```

**Design Specifications:**

```tsx
<div className="flex items-end justify-between mb-8 md:mb-12">
  <div className="flex-1">
    {badge && (
      <span className="inline-block mb-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{heading}</h2>
    {subheading && <p className="mt-2 text-lg text-gray-600">{subheading}</p>}
  </div>
  {showViewAll && (
    <Link
      href={viewAllLink}
      className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors"
    >
      Xem tất cả
      <ArrowRight className="w-4 h-4" />
    </Link>
  )}
</div>
```

**Files to Create:**

- `src/components/homepage/SectionHeader.tsx` (reusable component)

---

### 5.4 Feature Cards (Priority: MEDIUM)

#### Current Issues:

- ❌ Layout không nhất quán
- ❌ Icons không đủ nổi bật
- ❌ Text quá dài

#### Redesign Plan:

**A. Enhanced Feature Card**

```typescript
interface FeatureCard {
  icon: ReactNode;
  title: string;
  description: string;
  variant: 'default' | 'minimal' | 'highlighted';
  layout: 'vertical' | 'horizontal';
}
```

**Design Specifications:**

1. **Default Variant:**

   ```tsx
   <div className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all">
     <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
       {icon}
     </div>
     <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
     <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
   </div>
   ```

2. **Highlighted Variant:**
   - Background: `bg-gradient-to-br from-pink-50 to-pink-100`
   - Border: `border-2 border-pink-300`
   - Icon: Larger, colored

**Files to Update:**

- `src/components/homepage/sections/FeaturesList.tsx`

---

### 5.5 CTA Banners (Priority: MEDIUM)

#### Current Issues:

- ❌ Thiếu visual impact
- ❌ Text không đủ compelling
- ❌ Button không nổi bật

#### Redesign Plan:

**A. Enhanced CTA Banner**

```typescript
interface CTABanner {
  // Content
  heading: string;
  description?: string;
  ctaText: string;
  ctaLink: string;

  // Visual
  background: 'gradient' | 'solid' | 'image';
  backgroundColor?: string;
  backgroundImage?: string;

  // Layout
  alignment: 'left' | 'center' | 'right';
  containerWidth: 'narrow' | 'standard' | 'wide';
}
```

**Design Specifications:**

1. **Gradient Background:**

   ```css
   background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
   ```

2. **Button Style:**
   ```tsx
   <Button
     size="lg"
     className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold shadow-xl"
   >
     {ctaText}
   </Button>
   ```

**Files to Update:**

- `src/components/homepage/sections/CTABanner.tsx`

---

## 6. RESPONSIVE DESIGN

### 6.1 Mobile-First Approach

#### Breakpoint Strategy

```typescript
// Mobile-first responsive utilities
const RESPONSIVE_CLASSES = {
  // Container padding
  containerPadding: 'px-4 sm:px-6 lg:px-8',

  // Section padding
  sectionPadding: 'py-12 md:py-16 lg:py-20',

  // Typography
  heading: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  subheading: 'text-xl sm:text-2xl md:text-3xl',
  body: 'text-base sm:text-lg',

  // Grids
  productGrid: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  featureGrid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
} as const;
```

### 6.2 Touch Targets

**Minimum Sizes (WCAG):**

- Buttons: `min-h-[44px] min-w-[44px]`
- Links: `min-h-[44px]` (with padding)
- Inputs: `min-h-[44px]`

### 6.3 Mobile Optimizations

1. **Hero Section:**

   - Stacked layout (text above image)
   - Larger touch targets
   - Simplified CTAs (1 primary button)

2. **Product Cards:**

   - 2 columns on mobile
   - Larger images
   - Full-width "Add to Cart" button

3. **Navigation:**
   - Sticky header
   - Bottom navigation bar (optional)
   - Hamburger menu

---

## 7. PERFORMANCE OPTIMIZATION

### 7.1 Image Optimization

```typescript
// Next.js Image component với optimization
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  priority={isAboveFold} // true for hero images
  loading={isAboveFold ? 'eager' : 'lazy'}
  placeholder="blur"
  blurDataURL={blurDataUrl}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 7.2 Lazy Loading

```typescript
// Lazy load sections below fold
import dynamic from 'next/dynamic';

const ProductGrid = dynamic(() => import('./sections/ProductGrid'), {
  loading: () => <ProductGridSkeleton />,
  ssr: true, // Server Component
});
```

### 7.3 Animation Performance

```typescript
// Use CSS transforms instead of position changes
const hoverEffect = {
  transform: 'translateY(-4px)',
  transition: 'transform 0.2s ease-out',
};

// Use will-change for animated elements
const animatedElement = {
  willChange: 'transform',
};
```

---

## 8. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)

**Mục tiêu:** Thiết lập Design System và Layout Architecture

#### Tasks:

1. **Tạo Design Tokens**

   - [x] Tạo file `src/styles/design-tokens.css`
   - [x] Định nghĩa color palette, typography, spacing
   - [x] Update `tailwind.config.ts` với custom tokens

2. **Container System**

   - [x] Tạo `src/components/homepage/Container.tsx` component
   - [x] Implement container variants (narrow, standard, wide, full)
   - [x] Update `FeaturedProducts.tsx` và `ProductGrid.tsx` để sử dụng Container

3. **Section Header Component**
   - [x] Tạo `src/components/homepage/SectionHeader.tsx`
   - [x] Implement variants (left, center, right)
   - [x] Add "View All" link support

**Deliverables:**

- ✅ Design tokens file (`src/styles/design-tokens.css`)
- ✅ Container component (`src/components/homepage/Container.tsx`)
- ✅ SectionHeader component (`src/components/homepage/SectionHeader.tsx`)
- ✅ Updated sections (`FeaturedProducts.tsx`, `ProductGrid.tsx`)
- ✅ Documentation (`src/components/homepage/README.md`)

---

### Phase 2: Hero Sections (Week 2)

**Mục tiêu:** Redesign Hero Banner và Hero Slider

#### Tasks:

1. **Hero Banner Redesign**

   - [ ] Update `HeroBanner.tsx` với layout variants
   - [ ] Implement overlay system với opacity controls
   - [ ] Add trust badges support
   - [ ] Improve CTA button styles
   - [ ] Add responsive breakpoints

2. **Hero Slider Redesign**
   - [ ] Update `HeroSlider.tsx` với navigation dots
   - [ ] Add autoplay với pause on hover
   - [ ] Implement smooth transitions
   - [ ] Add keyboard navigation (arrow keys)

**Deliverables:**

- Enhanced HeroBanner component
- Enhanced HeroSlider component
- Documentation

---

### Phase 3: Product Sections (Week 3)

**Mục tiêu:** Redesign Product Cards và Product Grids

#### Tasks:

1. **Product Card Redesign**

   - [ ] Update `ProductCard.tsx` với variants
   - [ ] Implement hover effects (lift, zoom, overlay)
   - [ ] Add badge system (hot, new, sale)
   - [ ] Improve price display với discount
   - [ ] Add quick view button
   - [ ] Optimize image loading

2. **Product Grid Improvements**

   - [ ] Update `ProductGrid.tsx` với responsive grid
   - [ ] Add loading skeletons
   - [ ] Implement infinite scroll (optional)
   - [ ] Add filter UI (nếu cần)

3. **Featured Products**
   - [ ] Update `FeaturedProducts.tsx` với SectionHeader
   - [ ] Improve grid layout
   - [ ] Add "View More" button styling

**Deliverables:**

- Enhanced ProductCard component
- Updated ProductGrid component
- Loading skeletons

---

### Phase 4: Content Sections (Week 4)

**Mục tiêu:** Redesign Feature Lists, Testimonials, Blog Posts

#### Tasks:

1. **Feature List Redesign**

   - [ ] Update `FeaturesList.tsx` với card variants
   - [ ] Improve icon display
   - [ ] Add horizontal layout option
   - [ ] Implement hover effects

2. **Testimonials Redesign**

   - [ ] Update `Testimonials.tsx` với card design
   - [ ] Add avatar images
   - [ ] Implement star ratings display
   - [ ] Add carousel navigation

3. **Blog Posts Redesign**
   - [ ] Update `BlogPosts.tsx` với card layout
   - [ ] Add featured image
   - [ ] Improve typography
   - [ ] Add reading time indicator

**Deliverables:**

- Enhanced FeaturesList component
- Enhanced Testimonials component
- Enhanced BlogPosts component

---

### Phase 5: Marketing Sections (Week 5)

**Mục tiêu:** Redesign CTA Banners, Newsletter, Countdown Timer

#### Tasks:

1. **CTA Banner Redesign**

   - [ ] Update `CTABanner.tsx` với gradient backgrounds
   - [ ] Improve button styling
   - [ ] Add animation effects
   - [ ] Implement layout variants

2. **Newsletter Redesign**

   - [ ] Update `Newsletter.tsx` với modern form design
   - [ ] Add success/error states
   - [ ] Improve input styling
   - [ ] Add privacy notice

3. **Countdown Timer**
   - [ ] Update `CountdownTimer.tsx` với better typography
   - [ ] Add pulse animation
   - [ ] Improve mobile display

**Deliverables:**

- Enhanced CTABanner component
- Enhanced Newsletter component
- Enhanced CountdownTimer component

---

### Phase 6: Polish & Optimization (Week 6)

**Mục tiêu:** Final touches, performance optimization, accessibility

#### Tasks:

1. **Accessibility Audit**

   - [ ] Add ARIA labels to all interactive elements
   - [ ] Ensure keyboard navigation
   - [ ] Test with screen readers
   - [ ] Fix color contrast issues
   - [ ] Add focus indicators

2. **Performance Optimization**

   - [ ] Optimize images với next/image
   - [ ] Implement lazy loading cho below-fold sections
   - [ ] Add loading skeletons
   - [ ] Optimize animations với CSS transforms

3. **Cross-browser Testing**

   - [ ] Test trên Chrome, Firefox, Safari, Edge
   - [ ] Test trên mobile devices (iOS, Android)
   - [ ] Fix browser-specific issues

4. **Documentation**
   - [ ] Update component documentation
   - [ ] Create style guide
   - [ ] Document design decisions

**Deliverables:**

- Accessibility report
- Performance metrics
- Style guide document
- Updated documentation

---

## 9. DESIGN PATTERNS & BEST PRACTICES

### 9.1 Component Composition

```typescript
// Pattern: Compose sections từ smaller components
<SectionContainer variant="standard" padding="large">
  <SectionHeader
    heading="Sản phẩm nổi bật"
    subheading="Khám phá bộ sưu tập đa dạng"
    showViewAll
    viewAllLink="/products"
  />
  <ProductGrid products={products} columns={4} variant="default" />
</SectionContainer>
```

### 9.2 Responsive Images

```typescript
// Pattern: Responsive image với sizes attribute
<Image
  src={imageUrl}
  alt={altText}
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="w-full h-auto rounded-lg"
/>
```

### 9.3 Loading States

```typescript
// Pattern: Skeleton loaders cho async content
{
  isLoading ? <ProductGridSkeleton columns={4} /> : <ProductGrid products={products} />;
}
```

### 9.4 Error States

```typescript
// Pattern: Graceful error handling
{
  error ? (
    <div className="text-center py-12">
      <p className="text-gray-600">Không thể tải sản phẩm</p>
      <Button onClick={retry}>Thử lại</Button>
    </div>
  ) : (
    <ProductGrid products={products} />
  );
}
```

---

## 10. ACCESSIBILITY REQUIREMENTS

### 10.1 WCAG 2.1 AA Compliance

| Requirement             | Implementation                                   |
| ----------------------- | ------------------------------------------------ |
| **Color Contrast**      | Text: 4.5:1, Large text: 3:1                     |
| **Keyboard Navigation** | All interactive elements accessible via keyboard |
| **Screen Readers**      | ARIA labels, semantic HTML                       |
| **Focus Indicators**    | Visible focus rings on all interactive elements  |
| **Alt Text**            | All images have descriptive alt text             |

### 10.2 Semantic HTML

```typescript
// Use semantic HTML elements
<header>...</header>
<main>...</main>
<section aria-label="Featured Products">...</section>
<article>...</article>
<footer>...</footer>
```

### 10.3 ARIA Labels

```typescript
// Add ARIA labels for screen readers
<button aria-label="Add to cart" aria-describedby="product-name">
  <ShoppingCart />
</button>
```

---

## 11. TESTING STRATEGY

### 11.1 Visual Testing

- [ ] Screenshot testing với Percy/Chromatic
- [ ] Cross-browser visual regression
- [ ] Mobile device testing

### 11.2 Performance Testing

- [ ] Lighthouse audits (target: 95+)
- [ ] Core Web Vitals monitoring
- [ ] Bundle size analysis

### 11.3 Accessibility Testing

- [ ] axe DevTools scans
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA, JAWS)

### 11.4 User Testing

- [ ] A/B testing cho CTA buttons
- [ ] Heatmap analysis (Hotjar/Microsoft Clarity)
- [ ] User feedback collection

---

## 12. SUCCESS CRITERIA

### 12.1 Design Quality

- ✅ Consistent design system across all sections
- ✅ Professional, modern appearance
- ✅ Clear visual hierarchy
- ✅ Accessible (WCAG 2.1 AA)

### 12.2 Performance

- ✅ Lighthouse Score: 95+
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3s
- ✅ Bundle size: < 250KB (initial load)

### 12.3 User Experience

- ✅ Bounce rate: < 40%
- ✅ Time on page: > 2 minutes
- ✅ Scroll depth: > 75%
- ✅ CTA click-through: > 5%

---

## 13. RESOURCES & REFERENCES

### 13.1 Design Inspiration

- **Shopify Homepage:** Clean, conversion-focused
- **Apple Product Pages:** Minimal, elegant
- **Stripe Homepage:** Professional, trustworthy
- **GitHub Settings:** Clean forms, good spacing

### 13.2 Design Tools

- **Figma:** Design mockups
- **Tailwind CSS:** Utility-first styling
- **Radix UI:** Accessible primitives
- **Lucide Icons:** Icon library

### 13.3 Documentation

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)

---

## 14. NEXT STEPS

### Immediate Actions (This Week)

1. ✅ Review và approve plan này
2. ✅ Set up design tokens file
3. ✅ Create Container component
4. ✅ Start Phase 1 implementation

### Short-term (Next 2 Weeks)

1. Complete Phase 1 & 2 (Foundation + Hero Sections)
2. Get stakeholder feedback
3. Iterate on design

### Long-term (Next 6 Weeks)

1. Complete all phases
2. Launch redesigned homepage
3. Monitor metrics và iterate

---

**Document Status:** ✅ Ready for Implementation  
**Next Review:** After Phase 1 completion  
**Maintained By:** Frontend Team + UX Designer
