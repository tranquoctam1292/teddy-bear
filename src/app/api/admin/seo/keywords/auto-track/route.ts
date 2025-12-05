// Auto-track Focus Keywords API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/seo/keywords/auto-track
 * Automatically track focus keywords from SEO analysis
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
    const { analysisId, entityType, entityId, entitySlug } = body;

    if (!analysisId && (!entityType || !entityId)) {
      return NextResponse.json(
        { error: 'Missing required fields: analysisId or (entityType, entityId)' },
        { status: 400 }
      );
    }

    const { seoAnalysis, keywordTracking } = await getCollections();

    // Get analysis
    let analysis: any;
    if (analysisId) {
      analysis = await seoAnalysis.findOne({ id: analysisId });
      if (!analysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        );
      }
    } else {
      // Find latest analysis for entity
      analysis = await seoAnalysis
        .findOne({
          entityType,
          entityId,
        }, { sort: { analyzedAt: -1 } });
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis found' },
        { status: 404 }
      );
    }

    // Extract focus keyword
    const focusKeyword = analysis.focusKeyword?.keyword;
    if (!focusKeyword) {
      return NextResponse.json(
        { error: 'No focus keyword found in analysis' },
        { status: 400 }
      );
    }

    // Check if keyword already tracked
    const existingKeyword = await keywordTracking.findOne({
      keyword: focusKeyword,
      entityType: analysis.entityType,
      entityId: analysis.entityId,
    });

    if (existingKeyword) {
      return NextResponse.json({
        success: true,
        data: {
          keyword: existingKeyword,
          message: 'Keyword already tracked',
          created: false,
        },
      });
    }

    // Create keyword tracking
    const keywordData = {
      id: new ObjectId().toString(),
      keyword: focusKeyword,
      entityType: analysis.entityType,
      entityId: analysis.entityId,
      entitySlug: analysis.entitySlug,
      status: 'tracking' as const,
      trackedAt: new Date(),
      checkFrequency: 'weekly' as const,
      rankingHistory: [],
      totalChecks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await keywordTracking.insertOne(keywordData as any);

    const { _id, ...formattedKeyword } = keywordData as any;

    return NextResponse.json({
      success: true,
      data: {
        keyword: {
          ...formattedKeyword,
          id: formattedKeyword.id || _id.toString(),
        },
        message: 'Focus keyword automatically tracked',
        created: true,
      },
    });
  } catch (error) {
    console.error('Error auto-tracking keyword:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}





