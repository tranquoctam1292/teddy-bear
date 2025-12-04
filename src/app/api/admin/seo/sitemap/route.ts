import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// GET /api/admin/seo/sitemap - Generate XML Sitemap
export async function GET(request: NextRequest) {
  try {
    const { posts, products, pages } = await getCollections();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://teddyshop.com';

    // Get all published content
    const [publishedPosts, publishedProducts, publishedPages] = await Promise.all([
      posts.find({ status: 'published' }).toArray(),
      products.find({ status: 'published' }).toArray(),
      pages.find({ status: 'published' }).toArray(),
    ]);

    // Build sitemap URLs
    const urls = [];

    // Homepage
    urls.push({
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    });

    // Posts
    publishedPosts.forEach((post: any) => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.updatedAt || post.createdAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      });
    });

    // Products
    publishedProducts.forEach((product: any) => {
      urls.push({
        loc: `${baseUrl}/products/${product.slug}`,
        lastmod: new Date(product.updatedAt || product.createdAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      });
    });

    // Pages
    publishedPages.forEach((page: any) => {
      urls.push({
        loc: `${baseUrl}/${page.slug}`,
        lastmod: new Date(page.updatedAt || page.createdAt).toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      });
    });

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}


