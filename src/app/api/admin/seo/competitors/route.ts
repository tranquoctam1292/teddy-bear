// Competitors API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Competitor } from '@/lib/schemas/competitor';
import { getCache, generateCacheKey } from '@/lib/seo/cache';

/**
 * GET /api/admin/seo/competitors
 * Get all competitors
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

    const { competitors } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const enabled = searchParams.get('enabled');

    const query: any = {};
    if (enabled === 'true') {
      query.enabled = true;
    }

    // Use cache for frequently accessed data
    const cache = getCache();
    const cacheKey = generateCacheKey('competitors', enabled || 'all');
    
    let competitorList = cache.get<any[]>(cacheKey);
    
    if (!competitorList) {
      competitorList = await competitors
        .find(query)
        .sort({ name: 1 })
        .toArray();
      cache.set(cacheKey, competitorList, 10 * 60 * 1000); // 10 minutes
    }

    const formatted = competitorList.map((c: any) => {
      const { _id, ...data } = c;
      return { ...data, id: data.id || _id.toString() };
    });

    return NextResponse.json({
      success: true,
      data: {
        competitors: formatted,
      },
    });
  } catch (error) {
    console.error('Error fetching competitors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/competitors
 * Create new competitor
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
    const { name, website, domain, notes, tags } = body;

    if (!name || !website) {
      return NextResponse.json(
        { error: 'Missing required fields: name, website' },
        { status: 400 }
      );
    }

    // Extract domain from website if not provided
    const competitorDomain = domain || new URL(website).hostname.replace(/^www\./, '');

    const { competitors } = await getCollections();

    // Check if competitor already exists
    const existing = await competitors.findOne({
      $or: [
        { domain: competitorDomain },
        { website },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Competitor already exists' },
        { status: 400 }
      );
    }

    const competitorData: Competitor = {
      id: new ObjectId().toString(),
      name,
      website,
      domain: competitorDomain,
      enabled: true,
      trackedAt: new Date(),
      checkFrequency: 'weekly',
      notes,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await competitors.insertOne(competitorData as any);

    const { _id, ...formatted } = competitorData as any;

    return NextResponse.json({
      success: true,
      data: {
        competitor: {
          ...formatted,
          id: formatted.id || _id.toString(),
        },
        message: 'Competitor created successfully',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating competitor:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

