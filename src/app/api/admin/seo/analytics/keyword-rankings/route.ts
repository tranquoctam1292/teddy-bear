// Keyword Ranking Analytics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/analytics/keyword-rankings
 * Get keyword ranking charts data
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
    const keywordIds = searchParams.get('keywordIds')?.split(',') || [];
    const days = Number(searchParams.get('days')) || 90;

    const query: any = {
      status: 'tracking',
    };

    if (keywordIds.length > 0) {
      query.id = { $in: keywordIds };
    }

    const keywords = await keywordTracking.find(query).toArray();

    // Build ranking charts data
    const charts = keywords.map((keyword: any) => {
      const history = keyword.rankingHistory || [];
      
      // Filter by date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const filteredHistory = history.filter((entry: any) => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate;
      });

      return {
        keyword: keyword.keyword,
        entityType: keyword.entityType,
        currentRank: keyword.currentRank,
        previousRank: keyword.previousRank,
        bestRank: keyword.bestRank,
        worstRank: keyword.worstRank,
        rankChange: keyword.previousRank && keyword.currentRank
          ? keyword.previousRank - keyword.currentRank
          : 0,
        history: filteredHistory.map((entry: any) => ({
          date: new Date(entry.date).toISOString().split('T')[0],
          rank: entry.rank,
        })),
      };
    });

    // Calculate summary statistics
    const ranksWithValue = charts
      .filter(c => c.currentRank !== undefined && c.currentRank !== null)
      .map(c => c.currentRank!);

    const averageRank = ranksWithValue.length > 0
      ? ranksWithValue.reduce((sum, r) => sum + r, 0) / ranksWithValue.length
      : 0;

    const improved = charts.filter(c => c.rankChange > 0).length;
    const declined = charts.filter(c => c.rankChange < 0).length;
    const stable = charts.filter(c => c.rankChange === 0).length;

    return NextResponse.json({
      success: true,
      data: {
        charts,
        summary: {
          totalKeywords: charts.length,
          averageRank: Math.round(averageRank * 10) / 10,
          improved,
          declined,
          stable,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching keyword rankings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


