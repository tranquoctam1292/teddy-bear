// Create Redirect from 404 Error API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { RedirectRule } from '@/lib/schemas/redirect-rule';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/seo/404/create-redirect
 * Create a redirect rule from a 404 error
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
    const {
      errorId,
      destination,
      type = '301',
      matchType = 'exact',
      priority = 0,
      notes,
    } = body;

    if (!errorId || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: errorId, destination' },
        { status: 400 }
      );
    }

    const { error404Log, redirectRules } = await getCollections();

    // Find the 404 error
    const error404 = await error404Log.findOne({
      $or: [
        { id: errorId },
        { _id: new ObjectId(errorId) },
      ],
    });

    if (!error404) {
      return NextResponse.json(
        { error: '404 error not found' },
        { status: 404 }
      );
    }

    const source = error404.url;

    // Check if redirect already exists
    const existingRedirect = await redirectRules.findOne({
      source,
      matchType: matchType || 'exact',
    });

    if (existingRedirect) {
      return NextResponse.json(
        { error: 'Redirect rule already exists for this source' },
        { status: 400 }
      );
    }

    // Create redirect rule
    const redirectData: RedirectRule = {
      id: new ObjectId().toString(),
      source,
      destination,
      type: type as any,
      matchType: (matchType || 'exact') as any,
      status: 'active',
      priority: priority || 0,
      notes: notes || `Created from 404 error: ${error404.url}`,
      createdBy: session.user?.email || session.user?.name || 'admin',
      createdFrom404: true,
      hitCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await redirectRules.insertOne(redirectData as any);

    // Update 404 error to mark as resolved
    await error404Log.updateOne(
      {
        $or: [
          { id: errorId },
          { _id: new ObjectId(errorId) },
        ],
      },
      {
        $set: {
          status: 'resolved',
          resolved: true,
          resolvedAt: new Date(),
          resolvedBy: session.user?.email || session.user?.name || 'admin',
          redirectTo: destination,
          redirectRuleId: redirectData.id,
          updatedAt: new Date(),
        },
      }
    );

    const { _id, ...formattedRedirect } = redirectData as any;
    return NextResponse.json(
      {
        success: true,
        data: {
          redirect: {
            ...formattedRedirect,
            id: formattedRedirect.id || _id?.toString(),
          },
          message: 'Redirect rule created and 404 error resolved',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating redirect from 404:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



