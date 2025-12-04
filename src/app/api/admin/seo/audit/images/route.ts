import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// GET /api/admin/seo/audit/images - Audit all images for alt text
export async function GET(request: NextRequest) {
  try {
    const { posts, products, pages, media } = await getCollections();

    const issues: any[] = [];

    // Check media library
    const mediaFiles = await media.find({ type: 'image' }).toArray();
    mediaFiles.forEach((file: any) => {
      if (!file.alt || file.alt.trim() === '') {
        issues.push({
          type: 'media',
          id: file._id?.toString(),
          url: file.url,
          filename: file.filename,
          issue: 'Missing alt text',
          severity: 'high',
        });
      }
    });

    // Check products
    const allProducts = await products.find({}).toArray();
    allProducts.forEach((product: any) => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img: any, index: number) => {
          if (typeof img === 'string' || !img.alt) {
            issues.push({
              type: 'product',
              id: product._id?.toString(),
              name: product.name,
              imageIndex: index,
              issue: 'Product image missing alt text',
              severity: 'medium',
            });
          }
        });
      }
    });

    // Check posts (scan content for img tags)
    const allPosts = await posts.find({}).toArray();
    allPosts.forEach((post: any) => {
      const imgRegex = /<img[^>]*>/g;
      const matches = post.content?.match(imgRegex) || [];
      
      matches.forEach((imgTag: string) => {
        if (!imgTag.includes('alt=') || imgTag.includes('alt=""')) {
          issues.push({
            type: 'post',
            id: post._id?.toString(),
            title: post.title,
            issue: 'Image in content missing alt text',
            severity: 'medium',
          });
        }
      });
    });

    // Calculate stats
    const stats = {
      totalImages: mediaFiles.length,
      totalIssues: issues.length,
      byType: {
        media: issues.filter(i => i.type === 'media').length,
        product: issues.filter(i => i.type === 'product').length,
        post: issues.filter(i => i.type === 'post').length,
      },
      bySeverity: {
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
      },
    };

    return NextResponse.json({
      success: true,
      stats,
      issues: issues.slice(0, 100), // Limit to 100 for performance
    });
  } catch (error) {
    console.error('Error auditing images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to audit images' },
      { status: 500 }
    );
  }
}


