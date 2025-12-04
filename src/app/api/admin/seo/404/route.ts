// 404 Error Log API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Error404Log, Error404Status } from '@/lib/schemas/error-404-log';
import { ObjectId } from 'mongodb';

/**
 * Normalize URL for 404 tracking
 */
function normalize404Url(url: string): string {
  try {
    const urlObj = new URL(url, 'http://localhost');
    return urlObj.pathname.toLowerCase().replace(/\/$/, '') || '/';
  } catch {
    return url.toLowerCase().replace(/\/$/, '') || '/';
  }
}

/**
 * GET /api/admin/seo/404
 * Get all 404 errors with filtering
 */
export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const status = searchParams.get('status') as Error404Status | null;
    const resolved = searchParams.get('resolved');
    const likelyCause = searchParams.get('likelyCause');
    const url = searchParams.get('url');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const sort = searchParams.get('sort') || 'lastSeen'; // lastSeen, count, firstSeen
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (resolved !== null) {
      query.resolved = resolved === 'true';
    }

    if (likelyCause) {
      query.likelyCause = likelyCause;
    }

    if (url) {
      query.url = { $regex: url, $options: 'i' };
    }

    // Build sort
    const sortObj: any = {};
    sortObj[sort] = order;
    // Secondary sort by count if sorting by date
    if (sort === 'lastSeen' || sort === 'firstSeen') {
      sortObj.count = -1;
    }

    // Get total count
    const total = await error404Log.countDocuments(query);

    // Fetch 404 errors
    const errors = await error404Log
      .find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format errors
    const formattedErrors = errors.map((doc: any) => {
      const { _id, ...errorData } = doc;
      return {
        ...errorData,
        id: errorData.id || _id.toString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        errors: formattedErrors,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching 404 errors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/404
 * Log a new 404 error or update existing one
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      url,
      referer,
      userAgent,
      ip,
    } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing required field: url' },
        { status: 400 }
      );
    }

    const { error404Log } = await getCollections();
    const normalizedUrl = normalize404Url(url);

    // Check if 404 error already exists
    const existingError = await error404Log.findOne({
      normalizedUrl,
    });

    if (existingError) {
      // Update existing error
      await error404Log.updateOne(
        { normalizedUrl },
        {
          $set: {
            lastSeen: new Date(),
            updatedAt: new Date(),
          },
          $inc: {
            count: 1,
          },
          // Update referer/userAgent if provided and different
          ...(referer && referer !== existingError.referer
            ? { referer }
            : {}),
          ...(userAgent && userAgent !== existingError.userAgent
            ? { userAgent }
            : {}),
        }
      );

      const updated = await error404Log.findOne({ normalizedUrl });
      const { _id, ...errorData } = updated as any;
      return NextResponse.json({
        success: true,
        data: {
          error: {
            ...errorData,
            id: errorData.id || _id.toString(),
          },
          message: '404 error logged',
        },
      });
    }

    // Create new 404 error log
    const errorData: Error404Log = {
      id: new ObjectId().toString(),
      url,
      normalizedUrl,
      referer,
      userAgent,
      ip, // Note: Consider privacy implications
      count: 1,
      firstSeen: new Date(),
      lastSeen: new Date(),
      status: 'active',
      resolved: false,
      likelyCause: 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await error404Log.insertOne(errorData as any);

    const { _id, ...formattedError } = errorData as any;
    return NextResponse.json(
      {
        success: true,
        data: {
          error: {
            ...formattedError,
            id: formattedError.id || _id?.toString(),
          },
          message: '404 error logged',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging 404 error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




