// Link Suggestions API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import {
  findLinkOpportunities,
  analyzeLinkDistribution,
  analyzeAnchorText,
  detectBrokenLinksSync,
} from '@/lib/seo/link-analyzer';

/**
 * POST /api/admin/seo/link-suggestions
 * Find link opportunities and analyze links
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
    const { content, entityType, entityId, brokenUrls } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    const { products, posts } = await getCollections();

    // Get available links (products and posts)
    const [allProducts, allPosts] = await Promise.all([
      products
        .find({ isActive: true })
        .project({ name: 1, slug: 1, category: 1, tags: 1 })
        .limit(100)
        .toArray(),
      posts
        .find({ status: 'published' })
        .project({ title: 1, slug: 1, category: 1, tags: 1 })
        .limit(100)
        .toArray(),
    ]);

    // Format for link analyzer
    const availableLinks = [
      ...allProducts.map((p: any) => ({
        type: 'product' as const,
        title: p.name,
        slug: p.slug,
        keywords: p.tags || [],
        category: p.category,
      })),
      ...allPosts.map((p: any) => ({
        type: 'post' as const,
        title: p.title,
        slug: p.slug,
        keywords: p.tags || [],
        category: p.category,
      })),
    ];

    // Find link opportunities
    const opportunities = findLinkOpportunities(content, availableLinks);

    // Analyze link distribution
    const distribution = analyzeLinkDistribution(content);

    // Analyze anchor texts
    const anchorTextAnalysis: any[] = [];
    // Extract links and analyze anchor texts (sample first 10)
    const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    let count = 0;
    while ((match = linkRegex.exec(content)) !== null && count < 10) {
      const url = match[1];
      const anchorText = match[2].replace(/<[^>]+>/g, '').trim();
      if (anchorText) {
        anchorTextAnalysis.push(analyzeAnchorText(anchorText, url));
      }
      count++;
    }

    // Detect broken links
    const brokenLinks = detectBrokenLinksSync(content, brokenUrls || []);

    return NextResponse.json({
      success: true,
      data: {
        opportunities,
        distribution,
        anchorTextAnalysis,
        brokenLinks,
      },
    });
  } catch (error) {
    console.error('Error analyzing link suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seo/link-suggestions/check-broken
 * Check if URLs are broken (server-side check)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const urls = searchParams.get('urls');

    if (!urls) {
      return NextResponse.json(
        { error: 'Missing required parameter: urls (comma-separated)' },
        { status: 400 }
      );
    }

    const urlList = urls.split(',').map(u => u.trim()).filter(u => u);
    const results: Array<{ url: string; status: number; broken: boolean }> = [];

    // Check each URL (internal only for now)
    for (const url of urlList) {
      // Only check internal URLs
      if (url.startsWith('/') || url.startsWith('#')) {
        // For internal URLs, check if they exist in database
        const { products, posts } = await getCollections();
        const slug = url.split('/').pop()?.split('#')[0] || '';

        if (url.includes('/products/')) {
          const product = await products.findOne({ slug, isActive: true });
          results.push({
            url,
            status: product ? 200 : 404,
            broken: !product,
          });
        } else if (url.includes('/blog/') || url.includes('/posts/')) {
          const post = await posts.findOne({ slug, status: 'published' });
          results.push({
            url,
            status: post ? 200 : 404,
            broken: !post,
          });
        } else {
          // Assume page exists (could be enhanced with pages collection)
          results.push({
            url,
            status: 200,
            broken: false,
          });
        }
      } else {
        // External URLs - would need actual HTTP check
        // For now, assume they're valid
        results.push({
          url,
          status: 200,
          broken: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        brokenCount: results.filter(r => r.broken).length,
      },
    });
  } catch (error) {
    console.error('Error checking broken links:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}





