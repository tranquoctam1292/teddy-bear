// SEO Schema - Shared between Product and Post

/**
 * Robots meta tag options
 */
export type RobotsOption = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';

/**
 * SEO Configuration Schema
 * Advanced SEO settings for products and posts
 */
export interface SEOConfig {
  canonicalUrl?: string; // Override canonical URL to avoid duplicate content
  robots?: RobotsOption; // Robots meta tag: strict union type
  focusKeyword?: string; // Primary keyword for SEO tracking
  altText?: string; // Alt text for featured image (if different from title/name)
}

/**
 * Default SEO values
 */
export const DEFAULT_SEO: SEOConfig = {
  robots: 'index, follow' as RobotsOption,
};

/**
 * Robots options for dropdown
 */
export const ROBOTS_OPTIONS = [
  { value: 'index, follow', label: 'Index, Follow' },
  { value: 'noindex, follow', label: 'Noindex, Follow' },
  { value: 'noindex, nofollow', label: 'Noindex, Nofollow' },
] as const;



