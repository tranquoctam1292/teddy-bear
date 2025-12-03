// SEO Settings Schema
import type { ObjectId } from 'mongodb';
import type { OrganizationSchema } from '@/lib/seo/schemas';

/**
 * SEO Settings Schema
 * Global SEO configuration for the website
 */
export interface SEOSettings {
  _id?: ObjectId;
  id: 'global'; // Single document with id='global'
  
  // General Settings
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  siteLanguage: string; // e.g., 'vi', 'en'
  siteLocale: string; // e.g., 'vi_VN', 'en_US'
  
  // Sitemap Settings
  sitemapEnabled: boolean;
  sitemapLastGenerated?: Date;
  sitemapUrl?: string; // e.g., '/sitemap.xml'
  sitemapIncludeProducts: boolean;
  sitemapIncludePosts: boolean;
  sitemapIncludePages: boolean;
  sitemapChangeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  sitemapPriority: {
    products: number; // 0.0 - 1.0
    posts: number;
    pages: number;
  };
  
  // Robots.txt Settings
  robotsTxtContent?: string; // Custom robots.txt content
  robotsTxtCustom: boolean; // Use custom content or auto-generate
  robotsTxtSitemapUrl?: string; // Sitemap URL in robots.txt
  
  // Schema Markup Settings
  organizationSchema?: OrganizationSchema;
  websiteSchema?: {
    '@context': string;
    '@type': 'WebSite';
    name: string;
    url: string;
    potentialAction?: {
      '@type': 'SearchAction';
      target: string;
      'query-input': string;
    };
  };
  enableBreadcrumbSchema: boolean;
  enableProductSchema: boolean;
  enablePostSchema: boolean;
  enableLocalBusinessSchema: boolean;
  
  // Social Media Settings
  facebookAppId?: string;
  facebookPageUrl?: string;
  twitterHandle?: string; // e.g., '@emotionalhouse'
  instagramHandle?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialProfiles?: string[]; // Array of social media URLs
  
  // Analytics & Tracking
  googleAnalyticsId?: string; // GA4 Measurement ID
  googleSearchConsole?: string; // Verification code
  googleTagManager?: string; // GTM Container ID
  facebookPixelId?: string;
  microsoftClarityId?: string;
  
  // Redirect Settings
  redirectsEnabled: boolean;
  autoRedirect404: boolean; // Auto-create redirects from 404s
  redirectDefaultType: '301' | '302' | '307' | '308';
  ignore404Patterns?: string[]; // URL patterns to ignore for 404 logging
  
  // Advanced Settings
  breadcrumbsEnabled: boolean;
  internalLinkingEnabled: boolean;
  imageSeoEnabled: boolean;
  autoGenerateMetaDescriptions: boolean;
  autoGenerateAltText: boolean;
  
  // Performance Settings
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableMinification: boolean;
  
  // Security Settings
  enableHttps: boolean;
  enableSecurityHeaders: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default SEO Settings
 */
export const DEFAULT_SEO_SETTINGS: Omit<SEOSettings, '_id' | 'id' | 'siteName' | 'siteDescription' | 'siteKeywords' | 'createdAt' | 'updatedAt'> = {
  siteLanguage: 'vi',
  siteLocale: 'vi_VN',
  sitemapEnabled: true,
  sitemapIncludeProducts: true,
  sitemapIncludePosts: true,
  sitemapIncludePages: true,
  sitemapChangeFrequency: 'weekly',
  sitemapPriority: {
    products: 0.8,
    posts: 0.6,
    pages: 0.7,
  },
  robotsTxtCustom: false,
  enableBreadcrumbSchema: true,
  enableProductSchema: true,
  enablePostSchema: true,
  enableLocalBusinessSchema: true,
  redirectsEnabled: true,
  autoRedirect404: false,
  redirectDefaultType: '301',
  breadcrumbsEnabled: true,
  internalLinkingEnabled: true,
  imageSeoEnabled: true,
  autoGenerateMetaDescriptions: false,
  autoGenerateAltText: false,
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableMinification: true,
  enableHttps: true,
  enableSecurityHeaders: true,
};

