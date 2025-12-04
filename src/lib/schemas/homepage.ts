// Zod Validation Schemas for Homepage Configuration
import { z } from 'zod';

/**
 * SEO Schema
 */
export const seoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(60, 'Title should not exceed 60 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(160, 'Description should not exceed 160 characters'),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  ogTitle: z.string().max(60).optional(),
  ogDescription: z.string().max(160).optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
});

/**
 * Button Schema
 */
export const buttonSchema = z.object({
  text: z.string().min(1, 'Button text is required'),
  link: z.string().min(1, 'Button link is required'),
  style: z.enum(['primary', 'secondary', 'outline']).optional(),
  openInNewTab: z.boolean().optional(),
});

/**
 * Overlay Schema
 */
export const overlaySchema = z.object({
  enabled: z.boolean(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

/**
 * Section Layout Schema
 */
export const sectionLayoutSchema = z.object({
  type: z.enum(['full-width', 'contained', 'split']),
  columns: z.number().int().min(1).max(12).optional(),
  gap: z.number().min(0).optional(),
  padding: z.object({
    top: z.number().min(0).optional(),
    bottom: z.number().min(0).optional(),
    left: z.number().min(0).optional(),
    right: z.number().min(0).optional(),
  }).optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().url().optional().or(z.literal('')),
});

/**
 * Hero Banner Content Schema
 */
export const heroBannerContentSchema = z.object({
  heading: z.string().min(1, 'Heading is required').max(100),
  subheading: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url('Invalid image URL'),
  imageAlt: z.string().min(1, 'Image alt text is required'),
  imageMobile: z.string().url().optional().or(z.literal('')),
  primaryButton: buttonSchema.optional(),
  secondaryButton: buttonSchema.optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  textColor: z.string().optional(),
  overlay: overlaySchema.optional(),
});

/**
 * Featured Products Content Schema
 */
export const featuredProductsContentSchema = z.object({
  heading: z.string().max(100).optional(),
  subheading: z.string().max(200).optional(),
  productSelection: z.enum(['manual', 'automatic', 'category', 'tag']),
  productIds: z.array(z.string()).optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(['newest', 'popular', 'price-asc', 'price-desc']).optional(),
  limit: z.number().int().min(1).max(20).default(8),
  columns: z.number().int().min(1).max(6).default(4),
  showPrice: z.boolean().default(true),
  showRating: z.boolean().default(true),
  showAddToCart: z.boolean().default(true),
  viewMoreButton: buttonSchema.optional(),
});

/**
 * Category Showcase Content Schema
 */
export const categoryShowcaseContentSchema = z.object({
  heading: z.string().max(100).optional(),
  subheading: z.string().max(200).optional(),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().url(),
      link: z.string(),
    })
  ).min(1, 'At least one category is required'),
  layout: z.enum(['grid', 'slider']).default('grid'),
  columns: z.number().int().min(2).max(6).default(4),
  showCount: z.boolean().default(true),
});

/**
 * Blog Posts Content Schema
 */
export const blogPostsContentSchema = z.object({
  heading: z.string().max(100).optional(),
  subheading: z.string().max(200).optional(),
  postSelection: z.enum(['recent', 'featured', 'category', 'manual']),
  category: z.string().optional(),
  postIds: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(12).default(6),
  layout: z.enum(['grid', 'list', 'slider']).default('grid'),
  columns: z.number().int().min(1).max(4).default(3),
  showExcerpt: z.boolean().default(true),
  showAuthor: z.boolean().default(true),
  showDate: z.boolean().default(true),
  showImage: z.boolean().default(true),
  viewMoreButton: buttonSchema.optional(),
});

/**
 * CTA Banner Content Schema
 */
export const ctaBannerContentSchema = z.object({
  heading: z.string().min(1, 'Heading is required').max(100),
  description: z.string().max(300).optional(),
  backgroundImage: z.string().url().optional().or(z.literal('')),
  backgroundColor: z.string().optional(),
  button: buttonSchema,
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  textColor: z.string().optional(),
  overlay: overlaySchema.optional(),
});

/**
 * Section Schema (Base)
 */
export const sectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'hero-banner',
    'hero-slider',
    'featured-products',
    'product-grid',
    'category-showcase',
    'blog-posts',
    'testimonials',
    'features-list',
    'cta-banner',
    'newsletter',
    'video-embed',
    'image-gallery',
    'countdown-timer',
    'social-feed',
    'custom-html',
    'spacer',
  ]),
  name: z.string().min(1, 'Section name is required'),
  order: z.number().int().min(0),
  enabled: z.boolean().default(true),
  visibility: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    devices: z.array(z.enum(['desktop', 'tablet', 'mobile'])).optional(),
  }).optional(),
  layout: sectionLayoutSchema,
  content: z.any(), // Validated based on section type
  styles: z.object({
    customClass: z.string().optional(),
    animation: z.object({
      type: z.enum(['fade', 'slide', 'zoom', 'none']).optional(),
      duration: z.number().min(0).max(5000).optional(),
      delay: z.number().min(0).max(5000).optional(),
    }).optional(),
  }).optional(),
});

/**
 * Homepage Config Schema
 */
export const homepageConfigSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).default('draft'),
  sections: z.array(sectionSchema).default([]),
  seo: seoSchema,
  settings: z.object({
    layout: z.enum(['full-width', 'contained', 'boxed']).optional(),
    maxWidth: z.number().int().min(768).max(1920).optional(),
    backgroundColor: z.string().optional(),
  }).optional(),
});

/**
 * Validate section content based on type
 */
export function validateSectionContent(type: SectionType, content: any) {
  const schemas: Record<string, z.ZodType<any>> = {
    'hero-banner': heroBannerContentSchema,
    'featured-products': featuredProductsContentSchema,
    'category-showcase': categoryShowcaseContentSchema,
    'blog-posts': blogPostsContentSchema,
    'cta-banner': ctaBannerContentSchema,
  };

  const schema = schemas[type];
  if (!schema) {
    return content; // No validation for this type yet
  }

  return schema.parse(content);
}

/**
 * Generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Type exports
 */
export type HomepageConfigFormData = z.infer<typeof homepageConfigSchema>;
export type SectionFormData = z.infer<typeof sectionSchema>;

