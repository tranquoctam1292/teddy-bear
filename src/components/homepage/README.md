# Homepage Components - Phase 1: Foundation

**Date:** December 5, 2025  
**Status:** ✅ Complete

## Components

### Container Component

Container component cung cấp max-width constraints nhất quán cho homepage sections.

**Location:** `src/components/homepage/container.tsx`

**Usage:**

```tsx
import { Container } from '@/components/homepage/container';

// Standard container (max-w-7xl = 1280px) - cho product grids, features
<Container variant="standard" padding="desktop">
  {/* Content */}
</Container>

// Narrow container (max-w-4xl = 896px) - cho text content, forms
<Container variant="narrow" padding="desktop">
  {/* Content */}
</Container>

// Wide container (max-w-[1400px]) - cho large galleries
<Container variant="wide" padding="desktop">
  {/* Content */}
</Container>

// Full-width - cho hero sections, banners
<Container variant="full-width" padding="none">
  {/* Content */}
</Container>
```

**Variants:**

- `full-width`: `w-full` - Hero sections, banners
- `narrow`: `max-w-4xl mx-auto` - Text content, forms
- `standard`: `max-w-7xl mx-auto` - Product grids, features (default)
- `wide`: `max-w-[1400px] mx-auto` - Large galleries

**Padding Options:**

- `none`: No padding
- `mobile`: `px-4` only
- `tablet`: `px-4 sm:px-6`
- `desktop`: `px-4 sm:px-6 lg:px-8` (default)
- `all`: Same as desktop

---

### SectionHeader Component

Standardized header component cho homepage sections với consistent styling.

**Location:** `src/components/homepage/section-header.tsx`

**Usage:**

```tsx
import { SectionHeader } from '@/components/homepage/section-header';

// Basic header
<SectionHeader
  heading="Sản phẩm nổi bật"
  subheading="Khám phá bộ sưu tập đa dạng"
/>

// With View All link
<SectionHeader
  heading="Sản phẩm Hot"
  subheading="Những sản phẩm được yêu thích nhất"
  showViewAll
  viewAllLink="/products?filter=hot"
  viewAllText="Xem tất cả"
/>

// With badge
<SectionHeader
  heading="Sản phẩm mới"
  badge="New"
  alignment="center"
/>

// Right-aligned
<SectionHeader
  heading="Featured Collection"
  alignment="right"
/>
```

**Props:**

- `heading` (required): Section heading text
- `subheading` (optional): Subheading text below heading
- `alignment` (optional): `'left' | 'center' | 'right'` (default: `'left'`)
- `showViewAll` (optional): Show "View All" link (default: `false`)
- `viewAllLink` (optional): URL for "View All" link (default: `'/products'`)
- `viewAllText` (optional): Text for "View All" link (default: `'Xem tất cả'`)
- `badge` (optional): Badge text (e.g., "New", "Hot")
- `className` (optional): Additional CSS classes

---

## Design Tokens

**Location:** `src/styles/design-tokens.css`

Design tokens được import vào `globals.css` và có thể sử dụng trong Tailwind config.

**Available Tokens:**

- **Colors:** Pink palette, semantic colors (green, yellow, red, gray)
- **Typography:** Font sizes (xs to 7xl), font weights, line heights
- **Spacing:** 8px grid system (4px to 96px)
- **Border Radius:** sm, md, lg, xl, 2xl, full
- **Shadows:** sm, md, lg, xl, 2xl
- **Breakpoints:** sm, md, lg, xl, 2xl

**Usage in Tailwind:**

```tsx
// Colors
className = 'bg-pink-500 text-pink-600';

// Typography
className = 'text-5xl font-bold leading-tight';

// Spacing
className = 'py-section-mobile md:py-section-desktop';

// Border Radius
className = 'rounded-lg';

// Shadows
className = 'shadow-xl';
```

---

## Examples

### Featured Products Section

```tsx
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';

<Container variant="standard" padding="desktop">
  <SectionHeader
    heading="Sản phẩm nổi bật"
    subheading="Khám phá bộ sưu tập đa dạng"
    showViewAll
    viewAllLink="/products"
  />
  {/* Product grid */}
</Container>;
```

### Hero Section

```tsx
<Container variant="full-width" padding="none">
  {/* Hero content */}
</Container>
```

---

## Migration Guide

### Before (Old Pattern):

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="mb-8 text-center">
    <h2 className="text-3xl font-bold">Heading</h2>
    <p className="text-lg text-gray-600">Subheading</p>
  </div>
  {/* Content */}
</div>
```

### After (New Pattern):

```tsx
<Container variant="standard" padding="desktop">
  <SectionHeader heading="Heading" subheading="Subheading" alignment="center" />
  {/* Content */}
</Container>
```

---

## Benefits

1. **Consistency:** Tất cả sections sử dụng cùng container widths và spacing
2. **Maintainability:** Dễ thay đổi design system ở một nơi
3. **Responsive:** Padding tự động responsive theo breakpoints
4. **Type Safety:** TypeScript interfaces đảm bảo props đúng
5. **Accessibility:** SectionHeader có ARIA labels cho screen readers

---

**Next Steps:** Phase 2 - Hero Sections Redesign
