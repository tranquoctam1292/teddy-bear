// Redirect Rule API Routes (Individual)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { RedirectRule, RedirectType, MatchType, RedirectStatus } from '@/lib/schemas/redirect-rule';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/redirects/[id]
 * Get single redirect rule
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

    const { redirectRules } = await getCollections();
    const { id } = params;

    const redirect = await redirectRules.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (!redirect) {
      return NextResponse.json(
        { error: 'Redirect rule not found' },
        { status: 404 }
      );
    }

    const { _id, ...redirectData } = redirect as any;
    return NextResponse.json({
      success: true,
      data: {
        redirect: {
          ...redirectData,
          id: redirectData.id || _id.toString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching redirect:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/redirects/[id]
 * Update redirect rule
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

    const { redirectRules } = await getCollections();
    const { id } = params;
    const body = await request.json();

    const {
      source,
      destination,
      type,
      matchType,
      status,
      priority,
      conditions,
      notes,
      expiresAt,
    } = body;

    // Find existing redirect
    const existingRedirect = await redirectRules.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (!existingRedirect) {
      return NextResponse.json(
        { error: 'Redirect rule not found' },
        { status: 404 }
      );
    }

    // Validate redirect type if provided
    if (type && !['301', '302', '307', '308'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid redirect type. Must be 301, 302, 307, or 308' },
        { status: 400 }
      );
    }

    // Validate match type if provided
    if (matchType && !['exact', 'regex', 'prefix'].includes(matchType)) {
      return NextResponse.json(
        { error: 'Invalid match type. Must be exact, regex, or prefix' },
        { status: 400 }
      );
    }

    // Validate regex if matchType is regex and source is provided
    if (matchType === 'regex' && source) {
      try {
        new RegExp(source);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid regex pattern' },
          { status: 400 }
        );
      }
    }

    // Check for duplicate if source or matchType changed
    if (source || matchType) {
      const newSource = source || existingRedirect.source;
      const newMatchType = matchType || existingRedirect.matchType;

      const duplicate = await redirectRules.findOne({
        source: newSource,
        matchType: newMatchType,
        $or: [
          { id: { $ne: id } },
          { _id: { $ne: new ObjectId(id) } },
        ],
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Redirect rule already exists for this source and match type' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (source !== undefined) updateData.source = source;
    if (destination !== undefined) updateData.destination = destination;
    if (type !== undefined) updateData.type = type;
    if (matchType !== undefined) updateData.matchType = matchType;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (conditions !== undefined) updateData.conditions = conditions;
    if (notes !== undefined) updateData.notes = notes;
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await redirectRules.updateOne(
      {
        $or: [
          { id },
          { _id: new ObjectId(id) },
        ],
      },
      { $set: updateData }
    );

    // Fetch updated redirect
    const updatedRedirect = await redirectRules.findOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    const { _id, ...redirectData } = updatedRedirect as any;
    return NextResponse.json({
      success: true,
      data: {
        redirect: {
          ...redirectData,
          id: redirectData.id || _id.toString(),
        },
        message: 'Redirect rule updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating redirect rule:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/redirects/[id]
 * Delete redirect rule
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

    const { redirectRules } = await getCollections();
    const { id } = params;

    const result = await redirectRules.deleteOne({
      $or: [
        { id },
        { _id: new ObjectId(id) },
      ],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Redirect rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Redirect rule deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting redirect rule:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




