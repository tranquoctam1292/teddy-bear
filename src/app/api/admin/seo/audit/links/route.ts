import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// GET /api/admin/seo/audit/links - Check for broken links
export async function GET(request: NextRequest) {
  try {
    const { posts, products, pages } = await getCollections();

    const brokenLinks: any[] = [];
    const linkPattern = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi;

    // Check posts
    const allPosts = await posts.find({}).toArray();
    for (const post of allPosts) {
      const matches = [...(post.content || '').matchAll(linkPattern)];
      
      for (const match of matches) {
        const url = match[1];
        
        // Skip external links for now (would need actual HTTP checks)
        if (url.startsWith('http://') || url.startsWith('https://')) {
          continue;
        }

        // Check internal links
        if (url.startsWith('/')) {
          // Simple check - in production, would verify the route exists
          if (url.includes('/undefined') || url.includes('/null')) {
            brokenLinks.push({
              type: 'post',
              id: post._id?.toString(),
              title: post.title,
              link: url,
              issue: 'Invalid internal link',
              severity: 'high',
            });
          }
        }
      }
    }

    // Check products
    const allProducts = await products.find({}).toArray();
    for (const product of allProducts) {
      const matches = [...(product.description || '').matchAll(linkPattern)];
      
      for (const match of matches) {
        const url = match[1];
        
        if (url.startsWith('/') && (url.includes('/undefined') || url.includes('/null'))) {
          brokenLinks.push({
            type: 'product',
            id: product._id?.toString(),
            name: product.name,
            link: url,
            issue: 'Invalid internal link',
            severity: 'high',
          });
        }
      }
    }

    // Check pages
    const allPages = await pages.find({}).toArray();
    for (const page of allPages) {
      const matches = [...(page.content || '').matchAll(linkPattern)];
      
      for (const match of matches) {
        const url = match[1];
        
        if (url.startsWith('/') && (url.includes('/undefined') || url.includes('/null'))) {
          brokenLinks.push({
            type: 'page',
            id: page._id?.toString(),
            title: page.title,
            link: url,
            issue: 'Invalid internal link',
            severity: 'high',
          });
        }
      }
    }

    const stats = {
      totalLinks: brokenLinks.length,
      byType: {
        post: brokenLinks.filter(l => l.type === 'post').length,
        product: brokenLinks.filter(l => l.type === 'product').length,
        page: brokenLinks.filter(l => l.type === 'page').length,
      },
    };

    return NextResponse.json({
      success: true,
      stats,
      brokenLinks: brokenLinks.slice(0, 100),
      note: 'This is a basic check. For comprehensive link checking, integrate with external services.',
    });
  } catch (error) {
    console.error('Error checking links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check links' },
      { status: 500 }
    );
  }
}


