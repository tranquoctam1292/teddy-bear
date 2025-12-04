// SEO Schema - Shared between Product and Post
import type { ObjectId } from 'mongodb';

/**
 * SEO Configuration Schema
 * Advanced SEO settings for products and posts
 */
export interface SEOConfig {
  canonicalUrl?: string; // Override canonical URL to avoid duplicate content
  robots?: string; // Robots meta tag: "index, follow" | "noindex, follow" | "noindex, nofollow"
  focusKeyword?: string; // Primary keyword for SEO tracking
  altText?: string; // Alt text for featured image (if different from title/name)
}

/**
 * Default SEO values
 */
export const DEFAULT_SEO: SEOConfig = {
  robots: 'index, follow',
};

/**
 * Robots options for dropdown
 */
export const ROBOTS_OPTIONS = [
  { value: 'index, follow', label: 'Index, Follow' },
  { value: 'noindex, follow', label: 'Noindex, Follow' },
  { value: 'noindex, nofollow', label: 'Noindex, Nofollow' },
] as const;



