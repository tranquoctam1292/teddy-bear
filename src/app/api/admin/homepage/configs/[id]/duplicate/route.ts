// Admin API: Duplicate Homepage Configuration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/homepage/configs/:id/duplicate
 * Clone configuration
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
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Get original config
    const originalConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!originalConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Create duplicate
    const { _id, createdAt, updatedAt, publishedAt, ...configData } = originalConfig;

    const duplicateConfig = {
      ...configData,
      name: `${originalConfig.name} - Copy`,
      slug: `${originalConfig.slug}-copy-${Date.now()}`,
      status: 'draft',
      version: 1,
      originalConfigId: originalConfig._id.toString(),
      createdBy: session.user.id,
      updatedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await homepageConfigs.insertOne(duplicateConfig);

    return NextResponse.json(
      {
        message: 'Configuration duplicated successfully',
        config: {
          ...duplicateConfig,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error duplicating homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate configuration' },
      { status: 500 }
    );
  }
}

