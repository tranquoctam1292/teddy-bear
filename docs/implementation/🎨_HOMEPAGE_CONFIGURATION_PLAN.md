# 🎨 Homepage Configuration System - Implementation Plan

**Project:** Teddy Shop CMS  
**Feature:** Homepage Configuration & Builder  
**Purpose:** Marketing-optimized, SEO-friendly, Drag & Drop homepage  
**Priority:** High  
**Estimated Effort:** 40-60 hours  
**Date:** December 4, 2025

---

## 📋 TABLE OF CONTENTS

1. [Feature Overview](#feature-overview)
2. [Requirements Analysis](#requirements-analysis)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [Admin UI Design](#admin-ui)
6. [Frontend Implementation](#frontend)
7. [SEO Optimization](#seo)
8. [Performance Strategy](#performance)
9. [Implementation Roadmap](#roadmap)
10. [Testing Plan](#testing)

---

## 1. FEATURE OVERVIEW

### 🎯 Goals

**Primary:**

- ✅ Flexible homepage configuration without coding
- ✅ Drag & drop section builder
- ✅ Marketing campaign support
- ✅ A/B testing ready
- ✅ SEO optimized
- ✅ Mobile responsive

**Secondary:**

- ✅ Reusable sections/templates
- ✅ Real-time preview
- ✅ Version control
- ✅ Analytics integration
- ✅ Performance optimized

### 🎨 Key Features

**1. Section Builder**

- Drag & drop interface
- Pre-built section templates
- Custom section creation
- Section ordering
- Conditional display rules

**2. Content Blocks**

- Hero banners
- Product showcases
- Category grids
- Blog posts
- Testimonials
- Call-to-action (CTA)
- Custom HTML/React components

**3. Marketing Tools**

- Promo banners
- Countdown timers
- Pop-ups/modals
- Newsletter signup
- Social proof widgets
- Special offers

**4. SEO Features**

- Meta tags management
- Schema.org markup
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Structured data

---

## 2. REQUIREMENTS ANALYSIS

### 👥 User Stories

#### As a Marketing Manager:

```
✅ I want to update homepage content without developer
✅ I want to create promotional campaigns quickly
✅ I want to schedule content changes
✅ I want to track homepage performance
✅ I want to A/B test different layouts
```

#### As a Developer:

```
✅ I want clean, maintainable code
✅ I want reusable components
✅ I want easy to extend system
✅ I want good performance
✅ I want type safety
```

#### As a SEO Specialist:

```
✅ I want to control all meta tags
✅ I want structured data support
✅ I want fast page load
✅ I want mobile optimization
✅ I want crawlability
```

### 📊 Functional Requirements

**FR-1: Section Management**

- Create, edit, delete sections
- Reorder sections (drag & drop)
- Enable/disable sections
- Schedule section visibility
- Clone sections

**FR-2: Content Configuration**

- WYSIWYG editor for text
- Image upload & management
- Link management
- Button customization
- Color/style controls

**FR-3: Layout Options**

- Multiple layout templates
- Grid system (columns)
- Spacing controls
- Alignment options
- Responsive breakpoints

**FR-4: SEO Management**

- Page title & description
- Keywords management
- Schema.org markup
- OG & Twitter meta
- Alt text for images

**FR-5: Preview & Publishing**

- Real-time preview
- Mobile preview
- Publish/unpublish
- Version history
- Rollback capability

### ⚙️ Non-Functional Requirements

**NFR-1: Performance**

- Page load < 2s (LCP)
- First paint < 1s (FCP)
- Smooth animations (60fps)
- Optimized images

**NFR-2: Usability**

- Intuitive drag & drop
- Clear visual feedback
- Responsive design
- Accessibility (WCAG 2.1)

**NFR-3: Security**

- Admin-only access
- Input sanitization
- XSS prevention
- CSRF protection

**NFR-4: Scalability**

- Support 50+ sections
- Handle high traffic
- Efficient caching
- CDN ready

---

## 3. DATABASE SCHEMA

### Collections

#### 3.1 Homepage Configuration Collection

```typescript
interface HomepageConfig {
  _id: ObjectId;

  // Metadata
  name: string; // "Summer Sale 2024"
  slug: string; // "summer-sale-2024"
  description?: string;

  // Status
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;
  expiresAt?: Date;

  // Sections
  sections: HomepageSection[];

  // SEO
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    noindex?: boolean;
    nofollow?: boolean;
  };

  // Schema.org
  schemaMarkup?: {
    '@type': 'WebPage' | 'CollectionPage' | 'ItemPage';
    breadcrumb?: any;
    offers?: any[];
    aggregateRating?: any;
  };

  // Analytics
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    trackingScripts?: string[];
  };

  // A/B Testing
  isVariant?: boolean;
  originalConfigId?: string; // If this is a variant
  variantWeight?: number; // 0-100 (percentage)

  // Version Control
  version: number;
  previousVersionId?: string;

  // Settings
  settings?: {
    layout?: 'full-width' | 'contained' | 'boxed';
    maxWidth?: number; // px
    backgroundColor?: string;
    customCSS?: string;
    customJS?: string;
  };

  // Timestamps
  createdBy: string; // User ID
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HomepageSection {
  id: string; // Unique section ID (UUID)
  type: SectionType;
  name: string; // "Hero Banner", "Featured Products"

  // Position & Display
  order: number;
  enabled: boolean;

  // Visibility Rules
  visibility?: {
    startDate?: Date;
    endDate?: Date;
    devices?: ('desktop' | 'tablet' | 'mobile')[];
    userTypes?: ('all' | 'authenticated' | 'guest')[];
  };

  // Layout
  layout: {
    type: 'full-width' | 'contained' | 'split';
    columns?: number;
    gap?: number; // px or rem
    padding?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    backgroundColor?: string;
    backgroundImage?: string;
  };

  // Content
  content: SectionContent;

  // Styling
  styles?: {
    customClass?: string;
    customCSS?: string;
    animation?: {
      type?: 'fade' | 'slide' | 'zoom' | 'none';
      duration?: number;
      delay?: number;
    };
  };

  // Analytics
  analytics?: {
    trackClicks?: boolean;
    trackViews?: boolean;
    eventName?: string;
  };
}

type SectionType =
  | 'hero-banner'
  | 'hero-slider'
  | 'featured-products'
  | 'product-grid'
  | 'category-showcase'
  | 'blog-posts'
  | 'testimonials'
  | 'features-list'
  | 'cta-banner'
  | 'newsletter'
  | 'video-embed'
  | 'image-gallery'
  | 'countdown-timer'
  | 'social-feed'
  | 'custom-html'
  | 'spacer';

interface SectionContent {
  // Varies by section type
  [key: string]: any;
}

// Example: Hero Banner Content
interface HeroBannerContent extends SectionContent {
  heading: string;
  subheading?: string;
  description?: string;
  image: string;
  imageAlt: string;
  imageMobile?: string; // Different image for mobile

  // CTA Buttons
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

  // Text Alignment
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;

  // Overlay
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

// Example: Featured Products Content
interface FeaturedProductsContent extends SectionContent {
  heading?: string;
  subheading?: string;

  // Product Selection
  productSelection: 'manual' | 'automatic' | 'category' | 'tag';
  productIds?: string[]; // Manual selection
  category?: string; // Category-based
  tag?: string; // Tag-based
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc';
  limit?: number; // Max products to show

  // Display Options
  columns?: number; // Products per row
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;

  // View More
  viewMoreButton?: {
    text: string;
    link: string;
  };
}
```

#### 3.2 Section Templates Collection

```typescript
interface SectionTemplate {
  _id: ObjectId;

  // Template Info
  name: string;
  description?: string;
  thumbnail?: string; // Preview image
  category: 'hero' | 'products' | 'content' | 'marketing' | 'custom';

  // Template Data
  type: SectionType;
  defaultContent: SectionContent;
  defaultLayout: any;
  defaultStyles?: any;

  // Usage Stats
  usageCount?: number;

  // Status
  status: 'active' | 'inactive';
  isPremium?: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. API DESIGN

### 4.1 Homepage Configuration APIs

#### GET /api/admin/homepage/configs

```typescript
// List all homepage configurations
// Auth: Admin only
// Query: status, page, limit, search

Response: {
  configs: HomepageConfig[];
  total: number;
  page: number;
  limit: number;
}
```

#### GET /api/admin/homepage/configs/active

```typescript
// Get currently active configuration
// Auth: Admin only

Response: {
  config: HomepageConfig;
}
```

#### POST /api/admin/homepage/configs

```typescript
// Create new configuration
// Auth: Admin only
// Body: HomepageConfig data

Response: {
  message: string;
  config: HomepageConfig;
}
```

#### GET /api/admin/homepage/configs/:id

```typescript
// Get specific configuration
// Auth: Admin only

Response: {
  config: HomepageConfig;
}
```

#### PATCH /api/admin/homepage/configs/:id

```typescript
// Update configuration
// Auth: Admin only
// Body: Partial HomepageConfig

Response: {
  message: string;
  config: HomepageConfig;
}
```

#### POST /api/admin/homepage/configs/:id/publish

```typescript
// Publish configuration (make it active)
// Auth: Admin only

Response: {
  message: string;
  config: HomepageConfig;
}
```

#### POST /api/admin/homepage/configs/:id/duplicate

```typescript
// Clone configuration
// Auth: Admin only

Response: {
  message: string;
  config: HomepageConfig;
}
```

#### POST /api/admin/homepage/configs/:id/preview

```typescript
// Generate preview token
// Auth: Admin only

Response: {
  previewUrl: string;
  token: string;
  expiresAt: Date;
}
```

#### DELETE /api/admin/homepage/configs/:id

```typescript
// Delete configuration (only if not published)
// Auth: Admin only

Response: {
  message: string;
}
```

### 4.2 Section Templates APIs

#### GET /api/admin/homepage/templates

```typescript
// Get all section templates
// Auth: Admin only
// Query: category, search

Response: {
  templates: SectionTemplate[];
}
```

#### POST /api/admin/homepage/templates

```typescript
// Create custom template
// Auth: Admin only

Response: {
  template: SectionTemplate;
}
```

### 4.3 Public APIs

#### GET /api/homepage

```typescript
// Get active homepage configuration (public)
// No auth required
// Returns only published config with enabled sections

Response: {
  config: HomepageConfig;
  sections: HomepageSection[];
}
```

#### GET /api/homepage/preview/:token

```typescript
// Preview unpublished config
// Token-based auth (generated by admin)

Response: {
  config: HomepageConfig;
  sections: HomepageSection[];
}
```

---

## 5. ADMIN UI DESIGN

### 5.1 Homepage Manager Page (`/admin/homepage`)

**Layout:**

```
┌─────────────────────────────────────────────┐
│ [+ New Configuration]  [Active: Summer Sale]│
├─────────────────────────────────────────────┤
│ Search: [_________________] [Filter ▼]      │
├─────────────────────────────────────────────┤
│ Name              Status    Updated   Actions│
│ Summer Sale 2024  ● Active  2h ago    [...] │
│ Winter Campaign   Draft     1d ago    [...] │
│ Black Friday      Archived  30d ago   [...] │
└─────────────────────────────────────────────┘
```

**Features:**

- List all configurations
- Quick status view
- Search & filter
- Duplicate/delete actions
- Preview link
- Publish button

### 5.2 Configuration Builder (`/admin/homepage/:id/edit`)

**Layout:**

```
┌───────────────┬─────────────────────────────────────┐
│               │ [Preview] [Publish] [Save Draft]    │
│ Sections      ├─────────────────────────────────────┤
│               │                                      │
│ [+ Add]       │         LIVE PREVIEW                 │
│               │                                      │
│ ▦ Hero        │   ┌────────────────────────┐        │
│ ⋮⋮            │   │   Hero Banner          │        │
│               │   └────────────────────────┘        │
│ ▦ Products    │                                      │
│ ⋮⋮            │   ┌────────────────────────┐        │
│               │   │  Featured Products      │        │
│ ▦ Blog        │   └────────────────────────┘        │
│ ⋮⋮            │                                      │
│               │                                      │
│ SEO Settings  │                                      │
│ Analytics     │                                      │
│               │                                      │
└───────────────┴─────────────────────────────────────┘
```

**Features:**

- Left sidebar: Section list (drag to reorder)
- Center: Live preview
- Right panel: Section editor (opens on select)
- Top toolbar: Actions

### 5.3 Section Editor (Right Panel)

**Tabs:**

```
[Content] [Layout] [Style] [Visibility] [Analytics]

┌─────────────────────────────────────────┐
│ Content Tab                              │
├─────────────────────────────────────────┤
│ Section Name: [Hero Banner___________]  │
│                                          │
│ Heading: [Welcome to Teddy Shop____]    │
│                                          │
│ Subheading: [Quality toys for kids_]    │
│                                          │
│ Background Image:                        │
│ ┌────────────┐  [Upload] [Change]      │
│ │   [img]    │                          │
│ └────────────┘                          │
│                                          │
│ Primary Button:                          │
│   Text: [Shop Now________]              │
│   Link: [/products_______]              │
│   Style: ● Primary ○ Secondary          │
│                                          │
└─────────────────────────────────────────┘
```

### 5.4 Add Section Modal

**Template Gallery:**

```
┌─────────────────────────────────────────────┐
│ Add Section                          [✕]    │
├─────────────────────────────────────────────┤
│ Categories: [All] [Hero] [Products] [Blog]  │
├─────────────────────────────────────────────┤
│                                              │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│ │ Hero │  │Slider│  │Banner│  │ Full │    │
│ │Banner│  │ Hero │  │ CTA  │  │Width │    │
│ └──────┘  └──────┘  └──────┘  └──────┘    │
│                                              │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│ │Prod. │  │ Prod.│  │Categ.│  │ Blog │    │
│ │ Grid │  │Slider│  │ Grid │  │ Posts│    │
│ └──────┘  └──────┘  └──────┘  └──────┘    │
│                                              │
└─────────────────────────────────────────────┘
```

### 5.5 SEO Settings Panel

```
┌─────────────────────────────────────────────┐
│ SEO Settings                                 │
├─────────────────────────────────────────────┤
│ Page Title: [_________________________]     │
│ Character count: 45/60                       │
│                                              │
│ Meta Description:                            │
│ [________________________________________]   │
│ [________________________________________]   │
│ Character count: 120/160                     │
│                                              │
│ Focus Keyword: [teddy shop___________]      │
│                                              │
│ Open Graph:                                  │
│   OG Title: [_________________________]     │
│   OG Description: [___________________]     │
│   OG Image: [Upload____________] [Change]   │
│                                              │
│ Schema.org:                                  │
│   Type: ▼ WebPage                           │
│   [✓] Include Organization                  │
│   [✓] Include Breadcrumb                    │
│                                              │
│ Advanced:                                    │
│   Canonical URL: [_____________________]    │
│   [ ] No Index                              │
│   [ ] No Follow                             │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 6. FRONTEND IMPLEMENTATION

### 6.1 Homepage Component Architecture

```typescript
// src/app/page.tsx
export default async function HomePage() {
  // Fetch active homepage config
  const config = await getActiveHomepageConfig();

  if (!config) {
    return <DefaultHomepage />;
  }

  return (
    <>
      {/* SEO */}
      <HomepageSEO config={config} />

      {/* Sections */}
      <HomepageRenderer config={config} />

      {/* Analytics */}
      <HomepageAnalytics config={config} />
    </>
  );
}

// src/components/homepage/HomepageRenderer.tsx
export function HomepageRenderer({ config }: { config: HomepageConfig }) {
  const visibleSections = config.sections
    .filter(section => section.enabled)
    .filter(section => isSectionVisible(section))
    .sort((a, b) => a.order - b.order);

  return (
    <div className={cn('homepage', config.settings?.layout)}>
      {visibleSections.map(section => (
        <SectionRenderer
          key={section.id}
          section={section}
        />
      ))}
    </div>
  );
}

// src/components/homepage/SectionRenderer.tsx
export function SectionRenderer({ section }: { section: HomepageSection }) {
  // Map section type to component
  const Component = SECTION_COMPONENTS[section.type];

  if (!Component) {
    console.warn(`Unknown section type: ${section.type}`);
    return null;
  }

  return (
    <section
      id={section.id}
      className={cn(
        'homepage-section',
        section.styles?.customClass
      )}
      style={{
        backgroundColor: section.layout.backgroundColor,
        padding: getPaddingStyle(section.layout.padding),
      }}
    >
      <Component
        content={section.content}
        layout={section.layout}
      />
    </section>
  );
}
```

### 6.2 Section Components

```typescript
// src/components/homepage/sections/HeroBanner.tsx
export function HeroBanner({
  content,
  layout
}: SectionComponentProps<HeroBannerContent>) {
  return (
    <div className="hero-banner">
      {/* Background Image */}
      <div className="hero-background">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          priority
          className="object-cover"
        />
        {content.overlay?.enabled && (
          <div
            className="hero-overlay"
            style={{
              backgroundColor: content.overlay.color,
              opacity: content.overlay.opacity,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className={cn('hero-content', `text-${content.textAlign}`)}>
        {content.heading && (
          <h1 className="hero-heading">
            {content.heading}
          </h1>
        )}

        {content.subheading && (
          <h2 className="hero-subheading">
            {content.subheading}
          </h2>
        )}

        {content.description && (
          <p className="hero-description">
            {content.description}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="hero-actions">
          {content.primaryButton && (
            <Button
              asChild
              variant={content.primaryButton.style || 'default'}
              size="lg"
            >
              <Link
                href={content.primaryButton.link}
                target={content.primaryButton.openInNewTab ? '_blank' : undefined}
              >
                {content.primaryButton.text}
              </Link>
            </Button>
          )}

          {content.secondaryButton && (
            <Button
              asChild
              variant={content.secondaryButton.style || 'outline'}
              size="lg"
            >
              <Link
                href={content.secondaryButton.link}
                target={content.secondaryButton.openInNewTab ? '_blank' : undefined}
              >
                {content.secondaryButton.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// src/components/homepage/sections/FeaturedProducts.tsx
export async function FeaturedProducts({
  content,
  layout,
}: SectionComponentProps<FeaturedProductsContent>) {
  // Fetch products based on selection method
  const products = await getProducts(content);

  return (
    <div className="featured-products">
      {content.heading && (
        <h2 className="section-heading">{content.heading}</h2>
      )}

      {content.subheading && (
        <p className="section-subheading">{content.subheading}</p>
      )}

      <div
        className="products-grid"
        style={{
          gridTemplateColumns: `repeat(${content.columns || 4}, 1fr)`,
        }}
      >
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            showPrice={content.showPrice}
            showRating={content.showRating}
            showAddToCart={content.showAddToCart}
          />
        ))}
      </div>

      {content.viewMoreButton && (
        <div className="text-center mt-6">
          <Button asChild variant="outline">
            <Link href={content.viewMoreButton.link}>
              {content.viewMoreButton.text}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 6.3 Section Component Registry

```typescript
// src/components/homepage/sections/index.ts
import { HeroBanner } from './HeroBanner';
import { HeroSlider } from './HeroSlider';
import { FeaturedProducts } from './FeaturedProducts';
import { ProductGrid } from './ProductGrid';
import { CategoryShowcase } from './CategoryShowcase';
import { BlogPosts } from './BlogPosts';
import { Testimonials } from './Testimonials';
import { FeaturesList } from './FeaturesList';
import { CTABanner } from './CTABanner';
import { Newsletter } from './Newsletter';
import { VideoEmbed } from './VideoEmbed';
import { ImageGallery } from './ImageGallery';
import { CountdownTimer } from './CountdownTimer';
import { SocialFeed } from './SocialFeed';
import { CustomHTML } from './CustomHTML';
import { Spacer } from './Spacer';

export const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<any>> = {
  'hero-banner': HeroBanner,
  'hero-slider': HeroSlider,
  'featured-products': FeaturedProducts,
  'product-grid': ProductGrid,
  'category-showcase': CategoryShowcase,
  'blog-posts': BlogPosts,
  testimonials: Testimonials,
  'features-list': FeaturesList,
  'cta-banner': CTABanner,
  newsletter: Newsletter,
  'video-embed': VideoEmbed,
  'image-gallery': ImageGallery,
  'countdown-timer': CountdownTimer,
  'social-feed': SocialFeed,
  'custom-html': CustomHTML,
  spacer: Spacer,
};
```

---

## 7. SEO OPTIMIZATION

### 7.1 Meta Tags Generation

```typescript
// src/lib/seo/homepage-seo.ts
export function generateHomepageSEO(config: HomepageConfig) {
  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords?.join(', '),

    openGraph: {
      title: config.seo.ogTitle || config.seo.title,
      description: config.seo.ogDescription || config.seo.description,
      images: config.seo.ogImage ? [{ url: config.seo.ogImage }] : [],
      type: 'website',
    },

    twitter: {
      card: config.seo.twitterCard || 'summary_large_image',
      title: config.seo.ogTitle || config.seo.title,
      description: config.seo.ogDescription || config.seo.description,
      images: config.seo.ogImage ? [config.seo.ogImage] : [],
    },

    alternates: {
      canonical: config.seo.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL,
    },

    robots: {
      index: !config.seo.noindex,
      follow: !config.seo.nofollow,
    },
  };
}
```

### 7.2 Schema.org Markup

```typescript
// src/lib/seo/homepage-schema.ts
export function generateHomepageSchema(config: HomepageConfig) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': config.schemaMarkup?.['@type'] || 'WebPage',
    name: config.seo.title,
    description: config.seo.description,
    url: process.env.NEXT_PUBLIC_SITE_URL,
  };

  // Organization
  schema.publisher = {
    '@type': 'Organization',
    name: process.env.NEXT_PUBLIC_SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    },
  };

  // Products (if featured products section exists)
  const productsSection = config.sections.find((s) => s.type === 'featured-products' && s.enabled);

  if (productsSection) {
    schema.mainEntity = {
      '@type': 'ItemList',
      name: 'Featured Products',
      // ... product list
    };
  }

  return schema;
}
```

---

## 8. PERFORMANCE STRATEGY

### 8.1 Image Optimization

```typescript
// Use Next.js Image component
<Image
  src={content.image}
  alt={content.imageAlt}
  width={1920}
  height={1080}
  priority={section.order === 0} // Priority for first section
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>
```

### 8.2 Caching Strategy

```typescript
// ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

// Or on-demand revalidation after publish
import { revalidatePath } from 'next/cache';

async function publishHomepage(id: string) {
  // Update database
  await updateHomepageConfig(id, { status: 'published' });

  // Revalidate homepage
  revalidatePath('/');

  return { success: true };
}
```

### 8.3 Code Splitting

```typescript
// Dynamic imports for heavy components
const HeroSlider = dynamic(() => import('./sections/HeroSlider'), {
  loading: () => <Skeleton className="h-[600px]" />,
  ssr: true,
});

const VideoEmbed = dynamic(() => import('./sections/VideoEmbed'), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false, // Client-side only
});
```

### 8.4 Critical CSS

```typescript
// Inline critical CSS for above-the-fold content
export function HomepageStyles({ config }: { config: HomepageConfig }) {
  const criticalCSS = generateCriticalCSS(config);

  return (
    <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
  );
}
```

---

## 9. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2) - 20 hours

**Week 1:**

- [x] Database schema design
- [x] Type definitions (TypeScript)
- [x] API route stubs
- [x] Basic CRUD operations
- [x] Testing setup

**Week 2:**

- [ ] Admin UI scaffolding
- [ ] Homepage list page
- [ ] Basic create/edit form
- [ ] Preview functionality
- [ ] Publish/unpublish

**Deliverables:**

- Working CRUD for homepage configs
- Basic admin interface
- API documentation

---

### Phase 2: Section Builder (Week 3-4) - 20 hours

**Week 3:**

- [ ] Section types implementation (5 core types)
  - Hero Banner
  - Featured Products
  - Category Showcase
  - Blog Posts
  - CTA Banner
- [ ] Section editor UI
- [ ] Drag & drop ordering
- [ ] Section templates

**Week 4:**

- [ ] Live preview
- [ ] Section content forms
- [ ] Image upload integration
- [ ] Layout controls
- [ ] Style customization

**Deliverables:**

- Working section builder
- 5 section types
- Drag & drop interface
- Real-time preview

---

### Phase 3: Frontend Rendering (Week 5) - 10 hours

- [ ] Homepage renderer component
- [ ] Section component registry
- [ ] Responsive layouts
- [ ] SEO implementation
- [ ] Schema.org markup
- [ ] Performance optimization

**Deliverables:**

- Fully functional homepage
- SEO optimized
- Mobile responsive
- Fast loading (<2s LCP)

---

### Phase 4: Advanced Features (Week 6-7) - 10 hours

- [ ] A/B testing support
- [ ] Version control
- [ ] Scheduled publishing
- [ ] Analytics integration
- [ ] Custom sections
- [ ] Advanced SEO settings

**Deliverables:**

- Complete feature set
- Production ready
- Documented

---

### Phase 5: Testing & Polish (Week 8) - 10 hours

- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Bug fixes
- [ ] Documentation

**Deliverables:**

- Fully tested system
- 90%+ test coverage
- Complete documentation
- Ready for launch

---

## 10. TESTING PLAN

### 10.1 Unit Tests

```typescript
// Homepage config validation
describe('HomepageConfig', () => {
  test('validates required fields', () => {
    const config = { name: 'Test' };
    expect(() => validateConfig(config)).toThrow();
  });

  test('generates correct slug', () => {
    const config = { name: 'Summer Sale 2024' };
    expect(generateSlug(config.name)).toBe('summer-sale-2024');
  });
});

// Section rendering
describe('SectionRenderer', () => {
  test('renders hero banner correctly', () => {
    const section = {
      type: 'hero-banner',
      content: { heading: 'Welcome' },
    };

    const { getByText } = render(<SectionRenderer section={section} />);
    expect(getByText('Welcome')).toBeInTheDocument();
  });
});
```

### 10.2 Integration Tests

```typescript
// API endpoints
describe('Homepage API', () => {
  test('GET /api/admin/homepage/configs returns list', async () => {
    const response = await fetch('/api/admin/homepage/configs');
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.configs)).toBe(true);
  });

  test('POST /api/admin/homepage/configs creates new config', async () => {
    const newConfig = {
      name: 'Test Config',
      sections: [],
      seo: { title: 'Test', description: 'Test' },
    };

    const response = await fetch('/api/admin/homepage/configs', {
      method: 'POST',
      body: JSON.stringify(newConfig),
    });

    expect(response.status).toBe(201);
  });
});
```

### 10.3 E2E Tests

```typescript
// Playwright tests
test('create and publish homepage', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Go to homepage manager
  await page.goto('/admin/homepage');

  // Create new config
  await page.click('text=New Configuration');
  await page.fill('[name="name"]', 'E2E Test Config');

  // Add hero section
  await page.click('text=Add Section');
  await page.click('text=Hero Banner');
  await page.fill('[name="heading"]', 'Welcome to E2E Test');

  // Save
  await page.click('text=Save Draft');
  await expect(page.locator('text=Saved successfully')).toBeVisible();

  // Publish
  await page.click('text=Publish');
  await expect(page.locator('text=Published successfully')).toBeVisible();

  // Verify on homepage
  await page.goto('/');
  await expect(page.locator('text=Welcome to E2E Test')).toBeVisible();
});
```

### 10.4 Performance Tests

```typescript
// Lighthouse CI
test('homepage loads fast', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      fcp: performance.getEntriesByName('first-contentful-paint')[0].startTime,
      lcp: // Get LCP
      cls: // Get CLS
    };
  });

  expect(metrics.fcp).toBeLessThan(1000); // < 1s
  expect(metrics.lcp).toBeLessThan(2000); // < 2s
});
```

---

## 📊 SUCCESS METRICS

### Technical Metrics

| Metric            | Target  | Current |
| ----------------- | ------- | ------- |
| Page Load (LCP)   | < 2s    | TBD     |
| First Paint (FCP) | < 1s    | TBD     |
| API Response      | < 200ms | TBD     |
| Build Time        | < 30s   | TBD     |
| Test Coverage     | > 90%   | TBD     |

### Business Metrics

| Metric                   | Target    |
| ------------------------ | --------- |
| Time to Update Homepage  | < 5 min   |
| Marketing Campaign Setup | < 15 min  |
| Page Load Speed          | < 2s      |
| Mobile Performance       | 90+ score |
| SEO Score                | 95+       |

---

## 🎯 RISKS & MITIGATION

### Risk 1: Performance Degradation

**Impact:** High  
**Probability:** Medium  
**Mitigation:**

- Implement aggressive caching (ISR)
- Use CDN for images
- Code splitting
- Monitor performance metrics

### Risk 2: Complex UI/UX

**Impact:** Medium  
**Probability:** Medium  
**Mitigation:**

- User testing early
- Iterate based on feedback
- Provide help documentation
- Video tutorials

### Risk 3: SEO Issues

**Impact:** High  
**Probability:** Low  
**Mitigation:**

- Follow Google guidelines
- Regular SEO audits
- Testing before launch
- Monitor search rankings

### Risk 4: Data Loss

**Impact:** High  
**Probability:** Low  
**Mitigation:**

- Version control system
- Auto-save drafts
- Database backups
- Rollback capability

---

## 📚 DOCUMENTATION REQUIREMENTS

### Developer Docs

1. API documentation
2. Component library
3. Schema documentation
4. Extension guide

### User Docs

1. Getting started guide
2. Section builder tutorial
3. SEO best practices
4. Video tutorials

### Admin Docs

1. System architecture
2. Database schema
3. Deployment guide
4. Troubleshooting

---

## 🚀 NEXT STEPS

### Immediate (This Week)

1. [ ] Review this plan
2. [ ] Get stakeholder approval
3. [ ] Set up development environment
4. [ ] Create project board
5. [ ] Assign tasks

### Short-term (Week 1-2)

1. [ ] Start Phase 1 implementation
2. [ ] Daily standups
3. [ ] Weekly demos
4. [ ] Continuous testing

### Long-term (Week 3-8)

1. [ ] Complete all phases
2. [ ] Beta testing
3. [ ] Launch preparation
4. [ ] Production deployment

---

**Plan Created:** December 4, 2025  
**Estimated Duration:** 8 weeks  
**Estimated Effort:** 70 hours  
**Priority:** High  
**Status:** ✅ Ready to Start

---

**🎨 HOMEPAGE CONFIGURATION SYSTEM - READY TO BUILD! 🚀**
