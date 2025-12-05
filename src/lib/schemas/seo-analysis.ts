// SEO Analysis Schema
import type { ObjectId } from 'mongodb';

/**
 * SEO Issue Type
 */
export type SEOIssueType = 'error' | 'warning' | 'info';

/**
 * SEO Issue
 */
export interface SEOIssue {
  type: SEOIssueType;
  message: string;
  field: string;
  suggestion?: string;
  fixable?: boolean; // Can be auto-fixed
}

/**
 * Focus Keyword Analysis
 */
export interface FocusKeywordAnalysis {
  keyword: string;
  density?: number; // Keyword density percentage
  inTitle?: boolean;
  inDescription?: boolean;
  inContent?: boolean;
  inURL?: boolean;
  inHeadings?: boolean; // H1, H2, etc.
  inAltText?: boolean;
  occurrences?: number; // Total occurrences in content
}

/**
 * Content Analysis
 */
export interface ContentAnalysis {
  titleLength?: number;
  descriptionLength?: number;
  contentLength?: number; // Word count
  imageCount?: number;
  imagesWithAlt?: number;
  internalLinks?: number;
  externalLinks?: number;
  headingCount?: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  paragraphCount?: number;
  averageSentenceLength?: number;
  averageParagraphLength?: number;
  readabilityScore?: number; // 0-100
}

/**
 * SEO Analysis Schema
 * Stores SEO analysis results for Products, Posts, and Pages
 */
export interface SEOAnalysis {
  _id?: ObjectId;
  id: string; // Unique identifier
  
  // Entity Information
  entityType: 'product' | 'post' | 'page';
  entityId: string; // Reference to product/post/page ID
  entitySlug: string; // URL slug
  
  // Scores (0-100)
  seoScore: number;
  readabilityScore?: number;
  overallScore: number; // Weighted average: seoScore * 0.7 + readabilityScore * 0.3
  
  // Analysis Results
  issues: SEOIssue[];
  
  // Focus Keyword Analysis
  focusKeyword?: FocusKeywordAnalysis;
  
  // Content Analysis
  contentAnalysis?: ContentAnalysis;
  
  // Schema Markup
  hasSchema?: boolean;
  schemaTypes?: string[]; // e.g., ['Product', 'Offer', 'AggregateRating']
  
  // Social Media
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  
  // Technical SEO
  hasCanonical?: boolean;
  canonicalUrl?: string;
  robotsMeta?: string;
  hasSitemap?: boolean;
  
  // Mobile & Performance
  mobileFriendly?: boolean;
  pageSpeed?: number; // 0-100 (if available)
  
  // Timestamps
  analyzedAt: Date;
  updatedAt: Date;
  previousAnalysis?: {
    seoScore: number;
    readabilityScore?: number;
    overallScore: number;
    analyzedAt: Date;
  }; // For comparison
}

/**
 * Default SEO Analysis
 */
export const DEFAULT_SEO_ANALYSIS: Partial<SEOAnalysis> = {
  seoScore: 0,
  readabilityScore: 0,
  overallScore: 0,
  issues: [],
  hasSchema: false,
  schemaTypes: [],
  mobileFriendly: true,
};





