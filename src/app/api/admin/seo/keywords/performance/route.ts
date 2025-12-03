// Keyword Performance API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/keywords/performance
 * Get keyword performance statistics
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
    const days = Number(searchParams.get('days')) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all tracking keywords
    const keywords = await keywordTracking
      .find({ status: 'tracking' })
      .toArray();

    const totalKeywords = keywords.length;

    // Calculate average rank
    const ranksWithValue = keywords
      .filter((k: any) => k.currentRank !== undefined && k.currentRank !== null)
      .map((k: any) => k.currentRank);
    
    const averageRank = ranksWithValue.length > 0
      ? ranksWithValue.reduce((sum: number, r: number) => sum + r, 0) / ranksWithValue.length
      : null;

    // Calculate rank changes
    const keywordsWithChange = keywords
      .filter((k: any) => k.currentRank !== undefined && k.previousRank !== undefined)
      .map((k: any) => ({
        keyword: k.keyword,
        entityType: k.entityType,
        currentRank: k.currentRank,
        previousRank: k.previousRank,
        rankChange: k.previousRank - k.currentRank, // Positive = improved
      }));

    const improved = keywordsWithChange.filter((k: any) => k.rankChange > 0).length;
    const declined = keywordsWithChange.filter((k: any) => k.rankChange < 0).length;
    const stable = keywordsWithChange.filter((k: any) => k.rankChange === 0).length;

    // Calculate average rank change
    const averageRankChange = keywordsWithChange.length > 0
      ? keywordsWithChange.reduce((sum: number, k: any) => sum + k.rankChange, 0) / keywordsWithChange.length
      : 0;

    // Top performers (improved most)
    const topPerformers = [...keywordsWithChange]
      .filter((k: any) => k.rankChange > 0)
      .sort((a: any, b: any) => b.rankChange - a.rankChange)
      .slice(0, 10);

    // Top decliners (declined most)
    const topDecliners = [...keywordsWithChange]
      .filter((k: any) => k.rankChange < 0)
      .sort((a: any, b: any) => a.rankChange - b.rankChange)
      .slice(0, 10);

    // Count achieved targets
    const achievedTargets = keywords.filter((k: any) => {
      if (!k.targetRank || !k.currentRank) return false;
      return k.currentRank <= k.targetRank;
    }).length;

    return NextResponse.json({
      success: true,
      data: {
        totalKeywords,
        averageRank: averageRank ? Math.round(averageRank * 10) / 10 : null,
        rankChange: Math.round(averageRankChange * 10) / 10,
        improved,
        declined,
        stable,
        achievedTargets,
        topPerformers,
        topDecliners,
      },
    });
  } catch (error) {
    console.error('Error fetching keyword performance:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


