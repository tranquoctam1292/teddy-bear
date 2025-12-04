// Homepage Configuration Types
import { ObjectId } from 'mongodb';

/**
 * Section Types Available
 */
export type SectionType =
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

/**
 * Homepage Configuration
 */
export interface HomepageConfig {
  _id?: ObjectId;
  id?: string;

  // Metadata
  name: string;
  slug: string;
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

  // Version Control
  version: number;
  previousVersionId?: string;

  // Settings
  settings?: {
    layout?: 'full-width' | 'contained' | 'boxed';
    maxWidth?: number;
    backgroundColor?: string;
  };

  // Timestamps
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Homepage Section
 */
export interface HomepageSection {
  id: string; // UUID
  type: SectionType;
  name: string;

  // Position & Display
  order: number;
  enabled: boolean;

  // Visibility Rules
  visibility?: {
    startDate?: Date;
    endDate?: Date;
    devices?: ('desktop' | 'tablet' | 'mobile')[];
  };

  // Layout
  layout: {
    type: 'full-width' | 'contained' | 'split';
    columns?: number;
    gap?: number;
    padding?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    backgroundColor?: string;
    backgroundImage?: string;
  };

  // Content (varies by section type)
  content: SectionContent;

  // Styling
  styles?: {
    customClass?: string;
    animation?: {
      type?: 'fade' | 'slide' | 'zoom' | 'none';
      duration?: number;
      delay?: number;
    };
  };
}

/**
 * Base Section Content (extended by specific types)
 */
export interface SectionContent {
  [key: string]: any;
}

/**
 * Hero Banner Section
 */
export interface HeroBannerContent extends SectionContent {
  heading: string;
  subheading?: string;
  description?: string;
  image: string;
  imageAlt: string;
  imageMobile?: string;

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

  // Text Styling
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;

  // Overlay
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

/**
 * Featured Products Section
 */
export interface FeaturedProductsContent extends SectionContent {
  heading?: string;
  subheading?: string;

  // Product Selection
  productSelection: 'manual' | 'automatic' | 'category' | 'tag';
  productIds?: string[]; // Manual
  category?: string; // Category-based
  tag?: string; // Tag-based
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc';
  limit?: number;

  // Display Options
  columns?: number;
  showPrice?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;

  // View More
  viewMoreButton?: {
    text: string;
    link: string;
  };
}

/**
 * Category Showcase Section
 */
export interface CategoryShowcaseContent extends SectionContent {
  heading?: string;
  subheading?: string;

  // Categories
  categories: Array<{
    id: string;
    name: string;
    image: string;
    link: string;
  }>;

  // Display
  layout: 'grid' | 'slider';
  columns?: number;
  showCount?: boolean; // Show product count
}

/**
 * Blog Posts Section
 */
export interface BlogPostsContent extends SectionContent {
  heading?: string;
  subheading?: string;

  // Post Selection
  postSelection: 'recent' | 'featured' | 'category' | 'manual';
  category?: string;
  postIds?: string[];
  limit?: number;

  // Display
  layout: 'grid' | 'list' | 'slider';
  columns?: number;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showImage?: boolean;

  // View More
  viewMoreButton?: {
    text: string;
    link: string;
  };
}

/**
 * CTA Banner Section
 */
export interface CTABannerContent extends SectionContent {
  heading: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;

  // CTA Button
  button: {
    text: string;
    link: string;
    style?: 'primary' | 'secondary' | 'outline';
  };

  // Layout
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;

  // Overlay
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

/**
 * Section Template
 */
export interface SectionTemplate {
  _id?: ObjectId;
  id?: string;

  // Template Info
  name: string;
  description?: string;
  thumbnail?: string;
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

/**
 * Section Component Props
 */
export interface SectionComponentProps<T extends SectionContent = SectionContent> {
  section: HomepageSection;
  content: T;
  layout: HomepageSection['layout'];
  isPreview?: boolean;
}

/**
 * Section Editor Props
 */
export interface SectionEditorProps {
  section: HomepageSection;
  onChange: (section: HomepageSection) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

