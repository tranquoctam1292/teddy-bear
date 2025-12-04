// Admin API: Schedule Homepage Configuration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/homepage/configs/:id/schedule
 * Schedule configuration to publish at specific date/time
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
    const { scheduledAt, expiresAt } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { error: 'scheduledAt is required' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    const now = new Date();

    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: 'Scheduled date must be in the future' },
        { status: 400 }
      );
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Check if config exists
    const config = await homepageConfigs.findOne({ _id: new ObjectId(id) });
    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    // Update config
    const updateData: any = {
      status: 'scheduled',
      scheduledAt: scheduledDate,
      updatedBy: session.user.id,
      updatedAt: now,
    };

    if (expiresAt) {
      const expiresDate = new Date(expiresAt);
      if (expiresDate <= scheduledDate) {
        return NextResponse.json(
          { error: 'Expiration date must be after scheduled date' },
          { status: 400 }
        );
      }
      updateData.expiresAt = expiresDate;
    }

    await homepageConfigs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateData,
        $inc: { version: 1 },
      }
    );

    // Get updated config
    const updatedConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Configuration scheduled successfully',
      config: { ...updatedConfig, _id: updatedConfig!._id.toString() },
    });
  } catch (error) {
    console.error('Error scheduling configuration:', error);
    return NextResponse.json(
      { error: 'Failed to schedule configuration' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/homepage/configs/:id/schedule
 * Cancel scheduled publishing
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

    // Update config
    await homepageConfigs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'draft',
          scheduledAt: null,
          expiresAt: null,
          updatedBy: session.user.id,
          updatedAt: new Date(),
        },
      }
    );

    const updatedConfig = await homepageConfigs.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Schedule cancelled successfully',
      config: { ...updatedConfig, _id: updatedConfig!._id.toString() },
    });
  } catch (error) {
    console.error('Error cancelling schedule:', error);
    return NextResponse.json(
      { error: 'Failed to cancel schedule' },
      { status: 500 }
    );
  }
}

