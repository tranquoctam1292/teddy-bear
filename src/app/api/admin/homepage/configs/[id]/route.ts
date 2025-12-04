// Admin API: Single Homepage Configuration CRUD
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/homepage/configs/:id
 * Get specific configuration
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

    const config = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({
      config: { ...config, _id: config._id.toString() },
    });
  } catch (error) {
    console.error('Error fetching homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/homepage/configs/:id
 * Update configuration
 */
export async function PATCH(
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

    const body = await request.json();
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Check if config exists
    const existingConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!existingConfig) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Update config
    const updateData = {
      ...body,
      updatedBy: session.user.id,
      updatedAt: new Date(),
    };

    // Don't allow changing these fields via PATCH
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.createdBy;
    delete updateData.version;

    const result = await homepageConfigs.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: updateData,
        $inc: { version: 1 }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Fetch updated config
    const updatedConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Configuration updated successfully',
      config: { ...updatedConfig, _id: updatedConfig!._id.toString() },
    });
  } catch (error) {
    console.error('Error updating homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/homepage/configs/:id
 * Delete configuration (only if not published)
 */
export async function DELETE(
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

    // Don't allow deleting published configs
    if (config.status === 'published') {
      return NextResponse.json(
        { error: 'Cannot delete published configuration. Unpublish it first.' },
        { status: 400 }
      );
    }

    // Delete config
    const result = await homepageConfigs.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Configuration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}

