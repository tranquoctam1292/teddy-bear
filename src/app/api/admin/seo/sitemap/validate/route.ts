/**
 * Sitemap Validation API Route
 * 
 * POST: Validate sitemap XML
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import {
  generateSitemapXML,
  generateSitemapIndexXML,
  type SitemapUrl,
  formatSitemapDate,
  calculatePriority,
  calculateChangeFreq,
} from '@/lib/seo/sitemap-generator';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface ValidationError {
  line?: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats: {
    totalUrls: number;
    products: number;
    posts: number;
    pages: number;
  };
}

/**
 * Validate sitemap XML structure
 */
function validateSitemapXML(xml: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Basic XML validation
  if (!xml || xml.trim().length === 0) {
    errors.push({
      message: 'Sitemap XML is empty',
      severity: 'error',
    });
    return {
      isValid: false,
      errors,
      warnings,
      stats: { totalUrls: 0, products: 0, posts: 0, pages: 0 },
    };
  }

  // Check for XML declaration
  if (!xml.includes('<?xml')) {
    warnings.push({
      message: 'Missing XML declaration',
      severity: 'warning',
    });
  }

  // Check for sitemap namespace
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push({
      message: 'Missing sitemap namespace declaration',
      severity: 'error',
    });
  }

  // Count URLs
  const urlMatches = xml.match(/<url>/g);
  const totalUrls = urlMatches ? urlMatches.length : 0;

  // Check for required elements
  const locMatches = xml.match(/<loc>/g);
  if (!locMatches || locMatches.length === 0) {
    errors.push({
      message: 'No URLs found in sitemap',
      severity: 'error',
    });
  }

  // Validate URL format
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  const urls: string[] = [];
  
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1];
    urls.push(url);
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.push({
        message: `Invalid URL format: ${url}`,
        severity: 'error',
      });
    }
    
    if (url.length > 2048) {
      errors.push({
        message: `URL too long (max 2048 characters): ${url.substring(0, 50)}...`,
        severity: 'error',
      });
    }
  }

  // Count by type
  const products = urls.filter(u => u.includes('/products/')).length;
  const posts = urls.filter(u => u.includes('/blog/')).length;
  const pages = urls.filter(u => !u.includes('/products/') && !u.includes('/blog/')).length;

  // Check sitemap size (max 50MB uncompressed)
  const sizeInMB = new Blob([xml]).size / (1024 * 1024);
  if (sizeInMB > 50) {
    errors.push({
      message: `Sitemap size exceeds 50MB limit: ${sizeInMB.toFixed(2)}MB`,
      severity: 'error',
    });
  }

  // Check URL count (max 50,000 URLs per sitemap)
  if (totalUrls > 50000) {
    errors.push({
      message: `Sitemap contains too many URLs: ${totalUrls} (max 50,000)`,
      severity: 'error',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalUrls,
      products,
      posts,
      pages,
    },
  };
}

/**
 * POST /api/admin/seo/sitemap/validate
 * Validate sitemap
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type } = body; // 'index', 'products', 'posts', 'pages', or 'all'

    const results: Record<string, ValidationResult> = {};

    // Generate and validate sitemap index
    if (!type || type === 'index' || type === 'all') {
      const { products, posts } = await getCollections();
      
      const productCount = await products.countDocuments({ isActive: true });
      const postCount = await posts.countDocuments({ status: 'published' });
      
      const sitemaps: Array<{ loc: string; lastmod: string }> = [];
      const now = formatSitemapDate(new Date());
      
      if (productCount > 0) {
        sitemaps.push({
          loc: `${SITE_URL}/sitemap.xml?type=products`,
          lastmod: now,
        });
      }
      
      if (postCount > 0) {
        sitemaps.push({
          loc: `${SITE_URL}/sitemap.xml?type=posts`,
          lastmod: now,
        });
      }
      
      sitemaps.push({
        loc: `${SITE_URL}/sitemap.xml?type=pages`,
        lastmod: now,
      });
      
      const indexXML = generateSitemapIndexXML(sitemaps);
      results.index = validateSitemapXML(indexXML);
    }

    // Generate and validate individual sitemaps
    if (type === 'products' || type === 'all') {
      const { products } = await getCollections();
      const allProducts = await products
        .find({ isActive: true })
        .sort({ updatedAt: -1 })
        .toArray();

      const urls: SitemapUrl[] = allProducts.map(product => ({
        loc: `${SITE_URL}/products/${product.slug}`,
        priority: calculatePriority('product', product.isHot, product.isActive),
        changefreq: calculateChangeFreq('product', product.updatedAt),
        lastmod: product.updatedAt ? formatSitemapDate(product.updatedAt) : undefined,
      }));

      const xml = generateSitemapXML(urls);
      results.products = validateSitemapXML(xml);
    }

    if (type === 'posts' || type === 'all') {
      const { posts } = await getCollections();
      const allPosts = await posts
        .find({ status: 'published' })
        .sort({ updatedAt: -1 })
        .toArray();

      const urls: SitemapUrl[] = allPosts.map(post => ({
        loc: `${SITE_URL}/blog/${post.slug}`,
        priority: calculatePriority('post', undefined, undefined, post.status),
        changefreq: calculateChangeFreq('post', post.updatedAt),
        lastmod: post.updatedAt ? formatSitemapDate(post.updatedAt) : undefined,
      }));

      const xml = generateSitemapXML(urls);
      results.posts = validateSitemapXML(xml);
    }

    if (type === 'pages' || type === 'all') {
      const staticPages = [
        { path: '', priority: 1.0, changefreq: 'daily' as const },
        { path: 'products', priority: 0.9, changefreq: 'daily' as const },
        { path: 'blog', priority: 0.8, changefreq: 'daily' as const },
        { path: 'store', priority: 0.7, changefreq: 'monthly' as const },
        { path: 'about', priority: 0.6, changefreq: 'monthly' as const },
        { path: 'contact', priority: 0.6, changefreq: 'monthly' as const },
      ];

      const urls: SitemapUrl[] = staticPages.map(page => ({
        loc: `${SITE_URL}/${page.path}`,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: formatSitemapDate(new Date()),
      }));

      const xml = generateSitemapXML(urls);
      results.pages = validateSitemapXML(xml);
    }

    // Overall validation status
    const allValid = Object.values(results).every(r => r.isValid);
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = Object.values(results).reduce((sum, r) => sum + r.warnings.length, 0);

    return NextResponse.json({
      success: allValid,
      results,
      summary: {
        allValid,
        totalErrors,
        totalWarnings,
        sitemapsChecked: Object.keys(results).length,
      },
    });
  } catch (error) {
    console.error('Error validating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to validate sitemap' },
      { status: 500 }
    );
  }
}


