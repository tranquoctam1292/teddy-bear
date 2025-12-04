// Admin API: A/B Testing Variants
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/homepage/configs/:id/variant
 * Create A/B testing variant
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, variantWeight } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    if (!variantWeight || variantWeight < 0 || variantWeight > 100) {
      return NextResponse.json(
        { error: 'Variant weight must be between 0 and 100' },
        { status: 400 }
      );
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Get original config
    const originalConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!originalConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Check total weight of existing variants
    const existingVariants = await homepageConfigs
      .find({ originalConfigId: id })
      .toArray();

    const totalExistingWeight = existingVariants.reduce(
      (sum, v) => sum + (v.variantWeight || 0),
      0
    );

    if (totalExistingWeight + variantWeight > 100) {
      return NextResponse.json(
        { error: `Total variant weight cannot exceed 100%. Current: ${totalExistingWeight}%` },
        { status: 400 }
      );
    }

    // Create variant (clone original)
    const { _id, createdAt, updatedAt, publishedAt, ...configData } = originalConfig;

    const variantConfig = {
      ...configData,
      name: name || `${originalConfig.name} - Variant`,
      slug: `${originalConfig.slug}-variant-${Date.now()}`,
      status: 'draft',
      isVariant: true,
      originalConfigId: id,
      variantWeight: variantWeight,
      version: 1,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await homepageConfigs.insertOne(variantConfig);

    return NextResponse.json(
      {
        message: 'Variant created successfully',
        variant: {
          ...variantConfig,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating variant:', error);
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/homepage/configs/:id/variant
 * Get all variants for a configuration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Get all variants
    const variants = await homepageConfigs
      .find({ originalConfigId: id })
      .toArray();

    return NextResponse.json({
      variants: variants.map((v) => ({
        ...v,
        _id: v._id.toString(),
      })),
      total: variants.length,
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}

