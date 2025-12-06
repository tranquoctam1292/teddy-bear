// Redirect Rules API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { RedirectRule, RedirectType, MatchType, RedirectStatus } from '@/lib/schemas/redirect-rule';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/redirects
 * Get all redirect rules with filtering
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

    const { redirectRules } = await getCollections();
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const status = searchParams.get('status') as RedirectStatus | null;
    const type = searchParams.get('type') as RedirectType | null;
    const matchType = searchParams.get('matchType') as MatchType | null;
    const source = searchParams.get('source');
    const destination = searchParams.get('destination');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const sort = searchParams.get('sort') || 'priority'; // priority, createdAt, hitCount
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (matchType) {
      query.matchType = matchType;
    }

    if (source) {
      query.source = { $regex: source, $options: 'i' };
    }

    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    // Build sort
    const sortObj: any = {};
    sortObj[sort] = order;
    // Secondary sort by createdAt
    if (sort !== 'createdAt') {
      sortObj.createdAt = -1;
    }

    // Get total count
    const total = await redirectRules.countDocuments(query);

    // Fetch redirects
    const redirects = await redirectRules
      .find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format redirects
    const formattedRedirects = redirects.map((doc: any) => {
      const { _id, ...redirectData } = doc;
      return {
        ...redirectData,
        id: redirectData.id || _id.toString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        redirects: formattedRedirects,
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
    console.error('Error fetching redirects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/redirects
 * Create new redirect rule
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
      source,
      destination,
      type = '301',
      matchType = 'exact',
      status = 'active',
      priority = 0,
      conditions,
      notes,
      expiresAt,
    } = body;

    // Validation
    if (!source || !destination) {
      return NextResponse.json(
        { error: 'Missing required fields: source, destination' },
        { status: 400 }
      );
    }

    // Validate redirect type
    if (!['301', '302', '307', '308'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid redirect type. Must be 301, 302, 307, or 308' },
        { status: 400 }
      );
    }

    // Validate match type
    if (!['exact', 'regex', 'prefix'].includes(matchType)) {
      return NextResponse.json(
        { error: 'Invalid match type. Must be exact, regex, or prefix' },
        { status: 400 }
      );
    }

    // Validate regex if matchType is regex
    if (matchType === 'regex') {
      try {
        new RegExp(source);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid regex pattern' },
          { status: 400 }
        );
      }
    }

    const { redirectRules } = await getCollections();

    // Check if redirect already exists (exact match on source and matchType)
    const existingRedirect = await redirectRules.findOne({
      source,
      matchType,
    });

    if (existingRedirect) {
      return NextResponse.json(
        { error: 'Redirect rule already exists for this source and match type' },
        { status: 400 }
      );
    }

    const redirectData: RedirectRule = {
      id: new ObjectId().toString(),
      source,
      destination,
      type: type as RedirectType,
      matchType: matchType as MatchType,
      status: status as RedirectStatus,
      priority: priority || 0,
      conditions,
      notes,
      createdBy: session.user?.email || session.user?.name || 'admin',
      hitCount: 0,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await redirectRules.insertOne(redirectData as any);

    const { _id, ...formattedRedirect } = redirectData as any;
    return NextResponse.json(
      {
        success: true,
        data: {
          redirect: {
            ...formattedRedirect,
            id: formattedRedirect.id || _id?.toString(),
          },
          message: 'Redirect rule created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating redirect rule:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}








