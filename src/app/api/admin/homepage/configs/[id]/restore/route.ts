// Admin API: Restore Homepage Configuration from Version
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/homepage/configs/:id/restore
 * Restore configuration from a specific version
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
    const { versionId } = body;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(versionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');
    const versions = db.collection('homepage_config_versions');

    // Get version to restore
    const version = await versions.findOne({ _id: new ObjectId(versionId) });
    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    // Get current config (to save as backup)
    const currentConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!currentConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Save current state as version before restoring
    await versions.insertOne({
      configId: id,
      versionNumber: currentConfig.version || 1,
      name: currentConfig.name,
      slug: currentConfig.slug,
      sections: currentConfig.sections,
      seo: currentConfig.seo,
      settings: currentConfig.settings,
      status: currentConfig.status,
      createdBy: session.user.id,
      createdAt: new Date(),
      note: 'Auto-save before restore',
    });

    // Restore from version
    await homepageConfigs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          sections: version.sections,
          seo: version.seo,
          settings: version.settings,
          updatedBy: session.user.id,
          updatedAt: new Date(),
        },
        $inc: { version: 1 },
      }
    );

    // Get updated config
    const restoredConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Configuration restored successfully',
      config: { ...restoredConfig, _id: restoredConfig!._id.toString() },
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}

