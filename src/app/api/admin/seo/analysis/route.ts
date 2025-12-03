// SEO Analysis API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { cached, generateCacheKey, getCache } from '@/lib/seo/cache';
import type { SEOAnalysis } from '@/lib/schemas/seo-analysis';
import { ObjectId } from 'mongodb';

/**
 * GET /api/admin/seo/analysis
 * Get all SEO analyses with filtering
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

    const { seoAnalysis } = await getCollections();
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const entityType = searchParams.get('entityType') as 'product' | 'post' | 'page' | null;
    const entityId = searchParams.get('entityId');
    const minScore = searchParams.get('minScore') ? Number(searchParams.get('minScore')) : null;
    const maxScore = searchParams.get('maxScore') ? Number(searchParams.get('maxScore')) : null;
    const hasIssues = searchParams.get('hasIssues') === 'true';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
    const sort = searchParams.get('sort') || 'analyzedAt'; // analyzedAt, overallScore, seoScore
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query
    const query: any = {};

    if (entityType) {
      query.entityType = entityType;
    }

    if (entityId) {
      query.entityId = entityId;
    }

    if (minScore !== null) {
      query.overallScore = { ...query.overallScore, $gte: minScore };
    }

    if (maxScore !== null) {
      query.overallScore = { ...query.overallScore, $lte: maxScore };
    }

    if (hasIssues) {
      query['issues.0'] = { $exists: true }; // Has at least one issue
    }

    // Build sort
    const sortObj: any = {};
    sortObj[sort] = order;

    // Use optimized query với caching
    const cacheKey = generateCacheKey(
      'seo:analyses',
      entityType || 'all',
      entityId || 'all',
      page,
      limit,
      sort,
      order
    );

    const result = await cached(
      cacheKey,
      async () => {
        // Get total count
        const total = await seoAnalysis.countDocuments(query);

        // Fetch analyses với projection để chỉ lấy fields cần thiết
        const projection: any = {
          id: 1,
          entityType: 1,
          entityId: 1,
          entitySlug: 1,
          overallScore: 1,
          seoScore: 1,
          readabilityScore: 1,
          issues: 1,
          analyzedAt: 1,
        };

        const analyses = await seoAnalysis
          .find(query, { projection })
          .sort(sortObj)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();

        return { analyses, total };
      },
      5 * 60 * 1000 // 5 minutes cache
    );

    const { analyses, total } = result;

    // Format analyses for response
    const analysesWithIds = analyses.map((doc: any) => {
      const { _id, ...analysis } = doc;
      return {
        ...analysis,
        id: analysis.id || _id.toString(),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        analyses: analysesWithIds,
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
    console.error('Error fetching SEO analyses:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/analysis
 * Create or update SEO analysis for an entity
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
      entityType,
      entityId,
      entitySlug,
      seoScore,
      readabilityScore,
      overallScore,
      issues,
      focusKeyword,
      contentAnalysis,
      hasSchema,
      schemaTypes,
      ogImage,
      ogTitle,
      ogDescription,
      twitterCard,
      hasCanonical,
      canonicalUrl,
      robotsMeta,
      hasSitemap,
      mobileFriendly,
      pageSpeed,
    } = body;

    // Validation
    if (!entityType || !entityId || !entitySlug) {
      return NextResponse.json(
        { error: 'Missing required fields: entityType, entityId, entitySlug' },
        { status: 400 }
      );
    }

    if (seoScore === undefined || overallScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: seoScore, overallScore' },
        { status: 400 }
      );
    }

    const { seoAnalysis } = await getCollections();

    // Check if analysis already exists
    const existingAnalysis = await seoAnalysis.findOne({
      entityType,
      entityId,
    });

    const analysisData: Partial<SEOAnalysis> = {
      id: existingAnalysis?.id || new ObjectId().toString(),
      entityType,
      entityId,
      entitySlug,
      seoScore,
      readabilityScore,
      overallScore,
      issues: issues || [],
      focusKeyword,
      contentAnalysis,
      hasSchema: hasSchema || false,
      schemaTypes: schemaTypes || [],
      ogImage,
      ogTitle,
      ogDescription,
      twitterCard,
      hasCanonical,
      canonicalUrl,
      robotsMeta,
      hasSitemap,
      mobileFriendly,
      pageSpeed,
      analyzedAt: new Date(),
      updatedAt: new Date(),
    };

    // Store previous analysis for comparison
    if (existingAnalysis) {
      analysisData.previousAnalysis = {
        seoScore: existingAnalysis.seoScore,
        readabilityScore: existingAnalysis.readabilityScore,
        overallScore: existingAnalysis.overallScore,
        analyzedAt: existingAnalysis.analyzedAt,
      };
    }

    let result;
    if (existingAnalysis) {
      // Update existing
      await seoAnalysis.updateOne(
        { entityType, entityId },
        { $set: analysisData }
      );
      result = await seoAnalysis.findOne({ entityType, entityId });
      
      // Invalidate cache
      const cache = getCache();
      cache.delete(generateCacheKey('seo:analysis', entityType, entityId));
      // Clear list caches
      cache.delete(generateCacheKey('seo:analyses', entityType, 'all', 1, 20, 'analyzedAt', -1));
    } else {
      // Create new
      result = await seoAnalysis.insertOne(analysisData as any);
      const insertedId = result.insertedId;
      result = await seoAnalysis.findOne({ _id: insertedId });
      
      // Invalidate cache
      const cache = getCache();
      cache.delete(generateCacheKey('seo:analyses', entityType, 'all', 1, 20, 'analyzedAt', -1));
    }

    const { _id, ...analysis } = result as any;
    const formattedAnalysis = {
      ...analysis,
      id: analysis.id || _id.toString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        analysis: formattedAnalysis,
        message: existingAnalysis ? 'Analysis updated successfully' : 'Analysis created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating/updating SEO analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

