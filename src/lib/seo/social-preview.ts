/**
 * Social Media Preview Utilities
 * Generate and validate Open Graph and Twitter Card metadata
 */

export interface OpenGraphData {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogSiteName?: string;
  ogLocale?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleTag?: string[];
}

export interface TwitterCardData {
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

export interface SocialPreviewData {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  publishedTime?: string;
  author?: string;
}

/**
 * Generate Open Graph data from content
 */
export function generateOpenGraphData(data: SocialPreviewData): OpenGraphData {
  return {
    ogTitle: data.title,
    ogDescription: data.description,
    ogImage: data.image,
    ogUrl: data.url,
    ogType: data.type || 'website',
    ogSiteName: data.siteName || 'The Emotional House',
    ogLocale: 'vi_VN',
    articlePublishedTime: data.publishedTime,
    articleAuthor: data.author,
  };
}

/**
 * Generate Twitter Card data from content
 */
export function generateTwitterCardData(data: SocialPreviewData): TwitterCardData {
  return {
    twitterCard: 'summary_large_image',
    twitterTitle: data.title,
    twitterDescription: data.description,
    twitterImage: data.image,
    twitterSite: '@emotionalhouse',
  };
}

/**
 * Validate Open Graph data
 */
export function validateOpenGraph(data: OpenGraphData): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.ogTitle) {
    errors.push('Missing og:title');
  } else if (data.ogTitle.length > 60) {
    warnings.push('og:title should be ≤ 60 characters for optimal display');
  }

  if (!data.ogDescription) {
    errors.push('Missing og:description');
  } else if (data.ogDescription.length > 160) {
    warnings.push('og:description should be ≤ 160 characters for optimal display');
  }

  if (!data.ogImage) {
    warnings.push('Missing og:image - recommended for better social sharing');
  } else {
    // Validate image dimensions
    // Note: Actual validation would require image loading
    warnings.push('Ensure og:image is at least 1200x630px for best results');
  }

  if (!data.ogUrl) {
    warnings.push('Missing og:url - recommended for canonical URL');
  }

  // Type-specific validations
  if (data.ogType === 'article') {
    if (!data.articlePublishedTime) {
      warnings.push('article:published_time recommended for articles');
    }
    if (!data.articleAuthor) {
      warnings.push('article:author recommended for articles');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate Twitter Card data
 */
export function validateTwitterCard(data: TwitterCardData): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.twitterCard) {
    errors.push('Missing twitter:card');
  }

  if (!data.twitterTitle) {
    errors.push('Missing twitter:title');
  } else if (data.twitterTitle.length > 70) {
    warnings.push('twitter:title should be ≤ 70 characters');
  }

  if (!data.twitterDescription) {
    warnings.push('Missing twitter:description - recommended');
  } else if (data.twitterDescription.length > 200) {
    warnings.push('twitter:description should be ≤ 200 characters');
  }

  if (data.twitterCard === 'summary_large_image' && !data.twitterImage) {
    warnings.push('twitter:image recommended for summary_large_image card');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Optimize image for social sharing
 */
export function optimizeImageForSocial(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    format?: 'jpg' | 'png' | 'webp';
  }
): string {
  // For now, return original URL
  // In production, this could integrate with image optimization service
  // like Cloudinary, Imgix, or Next.js Image Optimization
  
  const width = options?.width || 1200;
  const height = options?.height || 630;
  const format = options?.format || 'jpg';

  // If using Next.js Image Optimization
  if (imageUrl.startsWith('/')) {
    // Return optimized URL (would need actual implementation)
    return imageUrl;
  }

  // For external URLs, could add query params if service supports it
  return imageUrl;
}

/**
 * Generate social preview URL for testing
 */
export function generateSocialPreviewUrl(
  url: string,
  platform: 'facebook' | 'twitter' | 'linkedin'
): string {
  const encodedUrl = encodeURIComponent(url);
  
  switch (platform) {
    case 'facebook':
      return `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`;
    case 'twitter':
      return `https://cards-dev.twitter.com/validator?url=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}`;
    default:
      return url;
  }
}

/**
 * Extract social data from HTML meta tags
 */
export function extractSocialDataFromHTML(html: string): {
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
} {
  const openGraph: OpenGraphData = {};
  const twitter: TwitterCardData = {};

  // Extract Open Graph tags
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch) openGraph.ogTitle = ogTitleMatch[1];

  const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  if (ogDescriptionMatch) openGraph.ogDescription = ogDescriptionMatch[1];

  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch) openGraph.ogImage = ogImageMatch[1];

  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  if (ogUrlMatch) openGraph.ogUrl = ogUrlMatch[1];

  const ogTypeMatch = html.match(/<meta\s+property=["']og:type["']\s+content=["']([^"']+)["']/i);
  if (ogTypeMatch) openGraph.ogType = ogTypeMatch[1] as any;

  // Extract Twitter Card tags
  const twitterCardMatch = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i);
  if (twitterCardMatch) twitter.twitterCard = twitterCardMatch[1] as any;

  const twitterTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
  if (twitterTitleMatch) twitter.twitterTitle = twitterTitleMatch[1];

  const twitterDescriptionMatch = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
  if (twitterDescriptionMatch) twitter.twitterDescription = twitterDescriptionMatch[1];

  const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
  if (twitterImageMatch) twitter.twitterImage = twitterImageMatch[1];

  return { openGraph, twitter };
}





