// Keyword Tracking API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { KeywordTracking } from '@/lib/schemas/keyword-tracking';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/keywords
 * Get all tracked keywords with filtering
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

    const { keywordTracking } = await getCollections();
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const status = searchParams.get('status') as KeywordTracking['status'] | null;
    const entityType = searchParams.get('entityType') as KeywordTracking['entityType'] | null;
    const entityId = searchParams.get('entityId');
    const keyword = searchParams.get('keyword');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const sort = searchParams.get('sort') || 'trackedAt'; // trackedAt, currentRank, keyword
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (entityType) {
      query.entityType = entityType;
    }

    if (entityId) {
      query.entityId = entityId;
    }

    if (keyword) {
      query.keyword = { $regex: keyword, $options: 'i' };
    }

    // Build sort
    const sortObj: any = {};
    sortObj[sort] = order;

    // Get total count
    const total = await keywordTracking.countDocuments(query);

    // Fetch keywords
    const keywords = await keywordTracking
      .find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format keywords
    const formattedKeywords = keywords.map((doc: any) => {
      const { _id, ...keywordData } = doc;
      return {
        ...keywordData,
        id: keywordData.id || _id.toString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        keywords: formattedKeywords,
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
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/keywords
 * Create new keyword tracking
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
      keyword,
      entityType,
      entityId,
      entitySlug,
      searchVolume,
      difficulty,
      cpc,
      competition,
      checkFrequency,
      targetRank,
      targetDate,
      notes,
      tags,
    } = body;

    // Validation
    if (!keyword || !entityType) {
      return NextResponse.json(
        { error: 'Missing required fields: keyword, entityType' },
        { status: 400 }
      );
    }

    const { keywordTracking } = await getCollections();

    // Check if keyword already tracked for this entity
    const existingKeyword = await keywordTracking.findOne({
      keyword,
      entityType,
      entityId: entityId || null,
    });

    if (existingKeyword) {
      return NextResponse.json(
        { error: 'Keyword already tracked for this entity' },
        { status: 400 }
      );
    }

    const keywordData: KeywordTracking = {
      id: new ObjectId().toString(),
      keyword,
      entityType,
      entityId,
      entitySlug,
      status: 'tracking',
      trackedAt: new Date(),
      checkFrequency: checkFrequency || 'weekly',
      rankingHistory: [],
      totalChecks: 0,
      searchVolume,
      difficulty,
      cpc,
      competition,
      targetRank,
      targetDate,
      notes,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await keywordTracking.insertOne(keywordData as any);

    const { _id, ...formattedKeyword } = keywordData as any;
    return NextResponse.json(
      {
        success: true,
        data: {
          keyword: {
            ...formattedKeyword,
            id: formattedKeyword.id || _id.toString(),
          },
          message: 'Keyword tracking created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating keyword tracking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

