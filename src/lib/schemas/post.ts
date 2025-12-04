// Blog Post Schema
import type { ObjectId } from 'mongodb';
import type { SEOConfig } from './seo';
import type { PostAuthorInfo } from '../types/author';

/**
 * Blog Post Schema
 * For SEO-friendly blog content management
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
  createdAt: Date;
}



