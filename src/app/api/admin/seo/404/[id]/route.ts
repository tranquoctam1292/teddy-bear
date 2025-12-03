// 404 Error Log API Routes (Individual)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Error404Log, Error404Status } from '@/lib/schemas/error-404-log';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/404/[id]
 * Get single 404 error
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error404Log } = await getCollections();
    const { id } = params;

    const error = await error404Log.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (!error) {
      return NextResponse.json(
        { error: '404 error not found' },
        { status: 404 }
      );
    }

    const { _id, ...errorData } = error as any;
    return NextResponse.json({
      success: true,
      data: {
        error: {
          ...errorData,
          id: errorData.id || _id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching 404 error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/404/[id]
 * Update 404 error (mark as resolved, ignored, etc.)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error404Log } = await getCollections();
    const { id } = params;
    const body = await request.json();

    const {
      status,
      resolved,
      redirectTo,
      redirectRuleId,
      likelyCause,
      notes,
    } = body;

    // Find existing error
    const existingError = await error404Log.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (!existingError) {
      return NextResponse.json(
        { error: '404 error not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status !== undefined) {
      updateData.status = status;
      // Auto-set resolved based on status
      if (status === 'resolved') {
        updateData.resolved = true;
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = session.user?.email || session.user?.name || 'admin';
      } else if (status === 'ignored') {
        updateData.resolved = false;
      }
    }

    if (resolved !== undefined) {
      updateData.resolved = resolved;
      if (resolved) {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = session.user?.email || session.user?.name || 'admin';
        if (!updateData.status) {
          updateData.status = 'resolved';
        }
      }
    }

    if (redirectTo !== undefined) updateData.redirectTo = redirectTo;
    if (redirectRuleId !== undefined) updateData.redirectRuleId = redirectRuleId;
    if (likelyCause !== undefined) updateData.likelyCause = likelyCause;
    if (notes !== undefined) updateData.notes = notes;

    await error404Log.updateOne(
      {
        $or: [
          { id },
          { _id: new ObjectId(id) },
        ],
      },
      { $set: updateData }
    );

    // Fetch updated error
    const updatedError = await error404Log.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    const { _id, ...errorData } = updatedError as any;
    return NextResponse.json({
      success: true,
      data: {
        error: {
          ...errorData,
          id: errorData.id || _id.toString(),
        },
        message: '404 error updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating 404 error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/404/[id]
 * Delete 404 error
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { error404Log } = await getCollections();
    const { id } = params;

    const result = await error404Log.deleteOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: '404 error not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: '404 error deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting 404 error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


