// Auto-redirect from 404s API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/seo/404/auto-redirect
 * Automatically create redirects from 404 errors
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
    const {
      errorIds,
      autoMatch = true, // Try to auto-match similar URLs
      redirectType = '301',
    } = body;

    if (!errorIds || errorIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: errorIds' },
        { status: 400 }
      );
    }

    const { error404Log, redirectRules, products, posts, pages } = await getCollections();
    const results: any[] = [];

    // Get 404 errors
    const errors = await error404Log
      .find({
        id: { $in: errorIds },
        status: 'active',
      })
      .toArray();

    for (const error of errors) {
      try {
        let destination: string | null = null;

        // Try to auto-match
        if (autoMatch) {
          const url = error.url;
          
          // Try to find similar product/post/page
          // Extract slug from URL
          const slugMatch = url.match(/\/([^\/]+)$/);
          if (slugMatch) {
            const slug = slugMatch[1];

            // Check products
            const product = await products.findOne({ slug });
            if (product) {
              destination = `/products/${product.slug}`;
            } else {
              // Check posts
              const post = await posts.findOne({ slug });
              if (post) {
                destination = `/posts/${post.slug}`;
              } else {
                // Check pages
                const page = await pages.findOne({ slug });
                if (page) {
                  destination = `/pages/${page.slug}`;
                }
              }
            }
          }
        }

        // If no auto-match, require manual destination
        if (!destination && !body.destinations?.[error.id]) {
          results.push({
            errorId: error.id,
            success: false,
            error: 'No auto-match found. Provide destination manually.',
          });
          continue;
        }

        destination = destination || body.destinations?.[error.id];

        // Check if redirect already exists
        const existingRedirect = await redirectRules.findOne({
          source: error.url,
        });

        if (existingRedirect) {
          results.push({
            errorId: error.id,
            success: false,
            error: 'Redirect already exists',
          });
          continue;
        }

        // Create redirect
        const redirectData = {
          id: new ObjectId().toString(),
          source: error.url,
          destination,
          type: redirectType,
          matchType: 'exact',
          status: 'active',
          priority: 0,
          notes: `Auto-created from 404 error`,
          createdBy: session.user?.email || 'system',
          createdFrom404: true,
          hitCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await redirectRules.insertOne(redirectData as any);

        // Mark 404 as resolved
        await error404Log.updateOne(
          { id: error.id },
          {
            $set: {
              status: 'resolved',
              resolved: true,
              resolvedAt: new Date(),
              resolvedBy: 'system',
              redirectTo: destination,
              redirectRuleId: redirectData.id,
              updatedAt: new Date(),
            },
          }
        );

        results.push({
          errorId: error.id,
          success: true,
          redirectId: redirectData.id,
          destination,
        });
      } catch (error) {
        console.error(`Error auto-redirecting ${error.id}:`, error);
        results.push({
          errorId: error.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successful = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful,
          failed: results.length - successful,
        },
      },
    });
  } catch (error) {
    console.error('Error auto-redirecting from 404s:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



