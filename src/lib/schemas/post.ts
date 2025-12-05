// Blog Post Schema
import type { ObjectId } from 'mongodb';
import { z } from 'zod';
import type { SEOConfig } from './seo';
import type { PostAuthorInfo } from '../types/author';

/**
 * Linked Product Schema
 * For product linking in blog posts
 */
export interface LinkedProduct {
  productId: string;
  position: 'inline' | 'sidebar' | 'bottom';
  displayType: 'card' | 'spotlight' | 'cta';
  customMessage?: string;
}

/**
 * Table of Contents Item Schema
 */
export interface TOCItem {
  id: string;
  text: string;
  level: number; // 1-6 (H1-H6)
  anchor: string; // URL anchor
}

/**
 * Video Schema
 */
export interface PostVideo {
  url: string;
  type: 'youtube' | 'vimeo';
  thumbnail?: string;
  transcript?: string;
}

/**
 * Comparison Table Schema
 */
export interface ComparisonTable {
  products: string[]; // Product IDs
  features: {
    name: string;
    values: Record<string, string | number | boolean>;
  }[];
  displayOptions?: {
    showImages?: boolean;
    showPrices?: boolean;
    highlightBest?: boolean;
  };
}

/**
 * Post Template Type
 */
export type PostTemplate = 'default' | 'gift-guide' | 'review' | 'care-guide' | 'story';

/**
 * Blog Post Schema
 * For SEO-friendly blog content management with Content-Commerce features
 */
export interface Post {
  _id?: ObjectId;
  id: string; // Unique identifier
  title: string;
  slug: string; // URL-friendly identifier for SEO
  excerpt?: string; // Short description for previews
  content: string; // Rich text content (HTML)

  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  seo?: SEOConfig; // Advanced SEO configuration

  // Media
  featuredImage?: string; // URL to featured image
  images?: string[]; // Array of image URLs used in content

  // Categorization
  category?: string; // e.g., "news", "tips", "stories"
  tags: string[]; // Array of tags

  // Status & Publishing
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date; // When the post was published
  author?: string; // Author name or ID (legacy)

  // Author Info (E-E-A-T SEO)
  authorInfo?: PostAuthorInfo; // New author system

  // Analytics
  views?: number; // Number of views
  likes?: number; // Number of likes

  // 🆕 Content-Commerce Features (Phase 1)
  // Product linking
  linkedProducts?: LinkedProduct[];

  // Template system
  template?: PostTemplate; // Default: 'default'
  templateData?: Record<string, unknown>; // Template-specific data

  // Reading time (auto-calculated)
  readingTime?: number; // Minutes

  // Table of contents (auto-generated)
  tableOfContents?: TOCItem[];

  // Video content
  videos?: PostVideo[];

  // Comparison table
  comparisonTable?: ComparisonTable;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post Summary (for listing pages)
 */
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  status: Post['status'];
  featuredImage?: string;
  publishedAt?: Date;
  views?: number;
  readingTime?: number; // 🆕
  template?: PostTemplate; // 🆕
  createdAt: Date;
}

// ============================================
// Zod Validation Schemas
// ============================================

/**
 * Linked Product Zod Schema
 */
export const linkedProductSchema = z.object({
  productId: z.string().min(1, 'Product ID là bắt buộc'),
  position: z.enum(['inline', 'sidebar', 'bottom'], {
    errorMap: () => ({ message: 'Position phải là inline, sidebar hoặc bottom' }),
  }),
  displayType: z.enum(['card', 'spotlight', 'cta'], {
    errorMap: () => ({ message: 'Display type phải là card, spotlight hoặc cta' }),
  }),
  customMessage: z.string().optional(),
});

/**
 * TOC Item Zod Schema
 */
export const tocItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  level: z.number().int().min(1).max(6),
  anchor: z.string(),
});

/**
 * Post Video Zod Schema
 */
export const postVideoSchema = z.object({
  url: z.string().url('URL không hợp lệ'),
  type: z.enum(['youtube', 'vimeo'], {
    errorMap: () => ({ message: 'Video type phải là youtube hoặc vimeo' }),
  }),
  thumbnail: z.string().url('Thumbnail URL không hợp lệ').optional(),
  transcript: z.string().optional(),
});

/**
 * Comparison Table Feature Schema
 */
export const comparisonFeatureSchema = z.object({
  name: z.string().min(1, 'Feature name là bắt buộc'),
  values: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

/**
 * Comparison Table Zod Schema
 */
export const comparisonTableSchema = z.object({
  products: z.array(z.string()).min(2, 'Cần ít nhất 2 sản phẩm để so sánh'),
  features: z.array(comparisonFeatureSchema).min(1, 'Cần ít nhất 1 feature'),
  displayOptions: z
    .object({
      showImages: z.boolean().optional(),
      showPrices: z.boolean().optional(),
      highlightBest: z.boolean().optional(),
    })
    .optional(),
});

/**
 * Post Template Zod Schema
 */
export const postTemplateSchema = z.enum(
  ['default', 'gift-guide', 'review', 'care-guide', 'story'],
  {
    errorMap: () => ({
      message: 'Template phải là default, gift-guide, review, care-guide hoặc story',
    }),
  }
);

/**
 * Main Post Zod Schema for API validation
 * Used in API routes for create/update operations
 */
export const postSchema = z.object({
  // Required fields
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  slug: z
    .string()
    .min(1, 'Slug là bắt buộc')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'Status phải là draft, published hoặc archived' }),
  }),

  // Optional fields
  excerpt: z.string().max(500, 'Excerpt không được quá 500 ký tự').optional(),
  metaTitle: z.string().max(60, 'Meta title không được quá 60 ký tự').optional(),
  metaDescription: z.string().max(160, 'Meta description không được quá 160 ký tự').optional(),
  keywords: z.array(z.string()).optional(),
  featuredImage: z.string().url('Featured image URL không hợp lệ').optional().or(z.literal('')),
  images: z.array(z.string().url('Image URL không hợp lệ')).optional(),
  category: z.string().max(50, 'Category không được quá 50 ký tự').optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date().optional(),
  author: z.string().optional(),
  views: z.number().int().min(0, 'Views phải là số nguyên dương').optional(),
  likes: z.number().int().min(0, 'Likes phải là số nguyên dương').optional(),

  // 🆕 New fields (Phase 1)
  linkedProducts: z.array(linkedProductSchema).optional(),
  template: postTemplateSchema.default('default'),
  templateData: z.record(z.unknown()).optional(),
  readingTime: z.number().int().min(0, 'Reading time phải là số nguyên dương').optional(),
  tableOfContents: z.array(tocItemSchema).optional(),
  videos: z.array(postVideoSchema).optional(),
  comparisonTable: comparisonTableSchema.optional(),

  // SEO config (nested object)
  seo: z
    .object({
      canonicalUrl: z.string().url('Canonical URL không hợp lệ').optional().or(z.literal('')),
      robots: z.enum(['index, follow', 'noindex, follow', 'noindex, nofollow']).optional(),
      focusKeyword: z.string().optional(),
      altText: z.string().optional(),
    })
    .optional(),

  // Author info (nested object - validation handled separately)
  authorInfo: z.any().optional(), // PostAuthorInfo validation is in author.ts
});

/**
 * Post Form Data Type (for API requests)
 */
export type PostFormData = z.infer<typeof postSchema>;

/**
 * Partial Post Schema (for updates)
 * All fields optional except validation rules
 */
export const postUpdateSchema = postSchema.partial().extend({
  // Slug is optional in updates, but if provided, must be valid
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .optional(),
  // Status is optional in updates
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

/**
 * Post Update Form Data Type
 */
export type PostUpdateFormData = z.infer<typeof postUpdateSchema>;
