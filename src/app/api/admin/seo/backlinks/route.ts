// Backlinks API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Backlink } from '@/lib/schemas/backlink';
import { cached, generateCacheKey } from '@/lib/seo/cache';

/**
 * GET /api/admin/seo/backlinks
 * Get all backlinks
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

    const { backlinks } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status');
    const quality = searchParams.get('quality');
    const targetUrl = searchParams.get('targetUrl');
    const sourceDomain = searchParams.get('sourceDomain');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const sort = searchParams.get('sort') || 'lastSeen';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    const query: any = {};
    if (status) query.status = status;
    if (quality) query.quality = quality;
    if (targetUrl) query.targetUrl = { $regex: targetUrl, $options: 'i' };
    if (sourceDomain) query.sourceDomain = { $regex: sourceDomain, $options: 'i' };

    const sortObj: any = {};
    sortObj[sort] = order;

    // Use cache for list queries
    const cache = getCache();
    const cacheKey = generateCacheKey('backlinks', status || 'all', quality || 'all', page, limit);
    
    let cachedResult = cache.get<{ backlinks: any[]; total: number }>(cacheKey);
    
    if (!cachedResult) {
      const total = await backlinks.countDocuments(query);
      
      const backlinkList = await backlinks
        .find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      cachedResult = {
        backlinks: backlinkList.map((b: any) => {
          const { _id, ...data } = b;
          return { ...data, id: data.id || _id.toString() };
        }),
        total,
      };
      
      cache.set(cacheKey, cachedResult, 5 * 60 * 1000); // 5 minutes
    }

    const totalPages = Math.ceil(cachedResult.total / limit);

    return NextResponse.json({
      success: true,
      data: {
        backlinks: cachedResult.backlinks,
        pagination: {
          page,
          limit,
          total: cachedResult.total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching backlinks:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/backlinks
 * Add new backlink (manual or from monitoring)
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
      sourceUrl,
      sourceDomain,
      targetUrl,
      targetDomain,
      anchorText,
      isDofollow = true,
      isNofollow = false,
      domainAuthority,
      pageAuthority,
      spamScore,
      quality = 'medium',
      notes,
      tags,
    } = body;

    if (!sourceUrl || !targetUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: sourceUrl, targetUrl' },
        { status: 400 }
      );
    }

    const { backlinks } = await getCollections();

    // Check if backlink already exists
    const existing = await backlinks.findOne({
      sourceUrl,
      targetUrl,
    });

    if (existing) {
      // Update last seen
      await backlinks.updateOne(
        { id: existing.id },
        {
          $set: {
            lastSeen: new Date(),
            status: 'active',
            updatedAt: new Date(),
          },
        }
      );

      const { _id, ...data } = existing as any;
      return NextResponse.json({
        success: true,
        data: {
          backlink: { ...data, id: data.id || _id.toString() },
          message: 'Backlink already exists, updated last seen',
        },
      });
    }

    const backlinkData: Backlink = {
      id: new ObjectId().toString(),
      sourceUrl,
      sourceDomain: sourceDomain || new URL(sourceUrl).hostname.replace(/^www\./, ''),
      targetUrl,
      targetDomain: targetDomain || new URL(targetUrl).hostname.replace(/^www\./, ''),
      anchorText,
      isDofollow,
      isNofollow,
      isSponsored: false,
      isUgc: false,
      domainAuthority,
      pageAuthority,
      spamScore,
      quality: quality as BacklinkQuality,
      status: 'active',
      firstSeen: new Date(),
      lastSeen: new Date(),
      notes,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await backlinks.insertOne(backlinkData as any);

    // Invalidate cache
    const cache = getCache();
    cache.delete(generateCacheKey('backlinks', 'all', 'all', 1, 20));

    const { _id, ...formatted } = backlinkData as any;

    return NextResponse.json({
      success: true,
      data: {
        backlink: {
          ...formatted,
          id: formatted.id || _id.toString(),
        },
        message: 'Backlink added successfully',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating backlink:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


