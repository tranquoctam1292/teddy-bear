// Post Form Data Type
// Shared type definition for Post form across the application
import type { SEOConfig } from '@/lib/schemas/seo';
import type { PostAuthorInfo } from '@/lib/types/author';

export type PostFormData = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[]; // Array of keywords for SEO
  featuredImage?: string;
  category?: string;
  tags: string[]; // Array of tags
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date; // Publish date
  seo?: SEOConfig; // Advanced SEO configuration
  authorInfo?: PostAuthorInfo; // Author & Reviewer info (E-E-A-T SEO)
};


