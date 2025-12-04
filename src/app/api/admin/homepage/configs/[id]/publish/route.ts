// Admin API: Publish Homepage Configuration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/admin/homepage/configs/:id/publish
 * Publish configuration (make it active on homepage)
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

    // Check if config exists
    const config = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Start transaction to ensure atomicity
    // 1. Unpublish all other configs
    await homepageConfigs.updateMany(
      { status: 'published' },
      {
        $set: {
          status: 'archived',
          archivedAt: new Date(),
        },
      }
    );

    // 2. Publish this config
    await homepageConfigs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'published',
          publishedAt: new Date(),
          updatedBy: session.user.id,
          updatedAt: new Date(),
        },
        $inc: { version: 1 },
      }
    );

    // 3. Revalidate homepage to use new config
    revalidatePath('/');
    revalidatePath('/api/homepage');

    // Fetch updated config
    const updatedConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Configuration published successfully',
      config: { ...updatedConfig, _id: updatedConfig!._id.toString() },
    });
  } catch (error) {
    console.error('Error publishing homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to publish configuration' },
      { status: 500 }
    );
  }
}

