// SEO Analytics Trends API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/analytics/trends
 * Get SEO score trends over time
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
    const days = Number(searchParams.get('days')) || 30;
    const entityType = searchParams.get('entityType');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    const query: any = {
      analyzedAt: { $gte: startDate },
    };

    if (entityType) {
      query.entityType = entityType;
    }

    // Get all analyses
    const analyses = await seoAnalysis
      .find(query)
      .sort({ analyzedAt: 1 })
      .toArray();

    // Group by date
    const trendsByDate: Record<string, { scores: number[]; count: number }> = {};

    analyses.forEach((analysis: any) => {
      const date = new Date(analysis.analyzedAt).toISOString().split('T')[0];
      if (!trendsByDate[date]) {
        trendsByDate[date] = { scores: [], count: 0 };
      }
      trendsByDate[date].scores.push(analysis.overallScore || 0);
      trendsByDate[date].count++;
    });

    // Calculate averages
    const trends = Object.entries(trendsByDate)
      .map(([date, data]) => ({
        date,
        averageScore: data.scores.length > 0
          ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
          : 0,
        pageCount: data.count,
        minScore: Math.min(...data.scores),
        maxScore: Math.max(...data.scores),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate overall stats
    const allScores = analyses.map((a: any) => a.overallScore || 0);
    const currentAverage = allScores.length > 0
      ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
      : 0;

    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - days);
    const previousAnalyses = await seoAnalysis
      .find({
        analyzedAt: {
          $gte: previousPeriodStart,
          $lt: startDate,
        },
        ...(entityType ? { entityType } : {}),
      })
      .toArray();

    const previousScores = previousAnalyses.map((a: any) => a.overallScore || 0);
    const previousAverage = previousScores.length > 0
      ? previousScores.reduce((sum, s) => sum + s, 0) / previousScores.length
      : 0;

    const scoreChange = currentAverage - previousAverage;

    return NextResponse.json({
      success: true,
      data: {
        trends,
        summary: {
          currentAverage: Math.round(currentAverage * 10) / 10,
          previousAverage: Math.round(previousAverage * 10) / 10,
          scoreChange: Math.round(scoreChange * 10) / 10,
          trend: scoreChange > 0 ? 'up' : scoreChange < 0 ? 'down' : 'stable',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching SEO trends:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


