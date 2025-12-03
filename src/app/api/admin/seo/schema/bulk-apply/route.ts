// Bulk Apply Schema API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { validateSchema } from '@/lib/seo/schema-builder';

/**
 * POST /api/admin/seo/schema/bulk-apply
 * Apply schema to multiple products/posts
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
    const { schema, entityType, entityIds, autoGenerate } = body;

    if (!schema || !entityType) {
      return NextResponse.json(
        { error: 'Missing required fields: schema, entityType' },
        { status: 400 }
      );
    }

    // Validate schema
    const validation = validateSchema(schema);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid schema',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { products, posts } = await getCollections();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    if (entityType === 'product') {
      const targetIds = entityIds || [];
      const query = targetIds.length > 0
        ? { id: { $in: targetIds } }
        : { isActive: true };

      const productList = await products.find(query).toArray();

      for (const product of productList) {
        try {
          // Store schema in product document
          await products.updateOne(
            { id: product.id },
            {
              $set: {
                'seo.schema': schema,
                updatedAt: new Date(),
              },
            }
          );
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Product ${product.id}: ${error.message}`);
        }
      }
    } else if (entityType === 'post') {
      const targetIds = entityIds || [];
      const query = targetIds.length > 0
        ? { id: { $in: targetIds } }
        : { status: 'published' };

      const postList = await posts.find(query).toArray();

      for (const post of postList) {
        try {
          // Store schema in post document
          await posts.updateOne(
            { id: post.id },
            {
              $set: {
                'seo.schema': schema,
                updatedAt: new Date(),
              },
            }
          );
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`Post ${post.id}: ${error.message}`);
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid entityType. Must be "product" or "post"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...results,
        total: results.success + results.failed,
        message: `Applied schema to ${results.success} ${entityType}(s)`,
      },
    });
  } catch (error) {
    console.error('Error bulk applying schema:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


