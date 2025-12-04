// Admin API: Homepage Configuration Versions
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/homepage/configs/:id/versions
 * Get version history for a configuration
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
    const versions = db.collection('homepage_config_versions');

    // Get all versions for this config
    const versionHistory = await versions
      .find({ configId: id })
      .sort({ createdAt: -1 })
      .limit(20) // Last 20 versions
      .toArray();

    return NextResponse.json({
      versions: versionHistory.map((v) => ({
        ...v,
        _id: v._id.toString(),
      })),
      total: versionHistory.length,
    });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/homepage/configs/:id/versions
 * Save current state as new version
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
    const versions = db.collection('homepage_config_versions');

    // Get current config
    const config = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Create version snapshot
    const versionData = {
      configId: id,
      versionNumber: config.version || 1,
      name: config.name,
      slug: config.slug,
      sections: config.sections,
      seo: config.seo,
      settings: config.settings,
      status: config.status,
      createdBy: session.user.id,
      createdAt: new Date(),
      note: 'Manual save',
    };

    const result = await versions.insertOne(versionData);

    return NextResponse.json(
      {
        message: 'Version saved successfully',
        version: {
          ...versionData,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving version:', error);
    return NextResponse.json(
      { error: 'Failed to save version' },
      { status: 500 }
    );
  }
}

