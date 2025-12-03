/**
 * Sitemap XML Route
 * 
 * Generates XML sitemap for the website
 * Accessible at: /sitemap.xml
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import {
  generateSitemapXML,
  generateSitemapIndexXML,
  type SitemapUrl,
  type SitemapIndexEntry,
  formatSitemapDate,
  calculatePriority,
  calculateChangeFreq,
} from '@/lib/seo/sitemap-generator';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const MAX_URLS_PER_SITEMAP = 50000; // Sitemap protocol limit

/**
 * GET /sitemap.xml
 * Generate main sitemap or sitemap index
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'products', 'posts', 'pages', or null for index

    // If type is specified, generate specific sitemap
    if (type === 'products') {
      return generateProductsSitemap();
    } else if (type === 'posts') {
      return generatePostsSitemap();
    } else if (type === 'pages') {
      return generatePagesSitemap();
    }

    // Otherwise, generate sitemap index
    return generateSitemapIndex();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

/**
 * Generate sitemap index
 */
async function generateSitemapIndex(): Promise<NextResponse> {
  const sitemaps: SitemapIndexEntry[] = [];
  const now = formatSitemapDate(new Date());

  // Add sitemaps for each type
  sitemaps.push({
    loc: `${SITE_URL}/sitemap.xml?type=products`,
    lastmod: now,
  });

  sitemaps.push({
    loc: `${SITE_URL}/sitemap.xml?type=posts`,
    lastmod: now,
  });

  sitemaps.push({
    loc: `${SITE_URL}/sitemap.xml?type=pages`,
    lastmod: now,
  });

  const xml = generateSitemapIndexXML(sitemaps);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Generate products sitemap
 */
async function generateProductsSitemap(): Promise<NextResponse> {
  const { products } = await getCollections();

  // Fetch all active products
  const allProducts = await products
    .find({ isActive: true })
    .sort({ updatedAt: -1 })
    .toArray();

  const urls: SitemapUrl[] = [];

  for (const product of allProducts) {
    if (!product.slug) continue;

    const url: SitemapUrl = {
      loc: `${SITE_URL}/products/${product.slug}`,
      priority: calculatePriority('product', product.isHot, product.isActive),
      changefreq: calculateChangeFreq('product', product.updatedAt),
    };

    if (product.updatedAt) {
      url.lastmod = formatSitemapDate(product.updatedAt);
    } else if (product.createdAt) {
      url.lastmod = formatSitemapDate(product.createdAt);
    }

    urls.push(url);
  }

  // If too many URLs, we should split into multiple sitemaps
  // For now, we'll just generate one sitemap
  if (urls.length > MAX_URLS_PER_SITEMAP) {
    // TODO: Implement sitemap splitting
    console.warn(`Warning: Sitemap has ${urls.length} URLs, exceeding limit of ${MAX_URLS_PER_SITEMAP}`);
  }

  const xml = generateSitemapXML(urls);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Generate posts sitemap
 */
async function generatePostsSitemap(): Promise<NextResponse> {
  const { posts } = await getCollections();

  // Fetch all published posts
  const allPosts = await posts
    .find({ status: 'published' })
    .sort({ updatedAt: -1 })
    .toArray();

  const urls: SitemapUrl[] = [];

  for (const post of allPosts) {
    if (!post.slug) continue;

    const url: SitemapUrl = {
      loc: `${SITE_URL}/blog/${post.slug}`,
      priority: calculatePriority('post', undefined, undefined, post.status),
      changefreq: calculateChangeFreq('post', post.updatedAt),
    };

    if (post.updatedAt) {
      url.lastmod = formatSitemapDate(post.updatedAt);
    } else if (post.publishedAt) {
      url.lastmod = formatSitemapDate(post.publishedAt);
    } else if (post.createdAt) {
      url.lastmod = formatSitemapDate(post.createdAt);
    }

    urls.push(url);
  }

  if (urls.length > MAX_URLS_PER_SITEMAP) {
    console.warn(`Warning: Sitemap has ${urls.length} URLs, exceeding limit of ${MAX_URLS_PER_SITEMAP}`);
  }

  const xml = generateSitemapXML(urls);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Generate pages sitemap
 */
async function generatePagesSitemap(): Promise<NextResponse> {
  // Static pages
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
    lastmod: formatSitemapDate(new Date()), // Use current date for static pages
  }));

  const xml = generateSitemapXML(urls);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

