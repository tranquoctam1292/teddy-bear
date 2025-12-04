// Performance Metrics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/analytics/performance
 * Get performance metrics
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

    const { seoAnalysis, keywordTracking, redirectRules, error404Log } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const days = Number(searchParams.get('days')) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all metrics
    const [
      analyses,
      keywords,
      redirects,
      errors404,
    ] = await Promise.all([
      seoAnalysis
        .find({ analyzedAt: { $gte: startDate } })
        .toArray(),
      keywordTracking.find({ status: 'tracking' }).toArray(),
      redirectRules.find({ status: 'active' }).toArray(),
      error404Log.find({ lastSeen: { $gte: startDate } }).toArray(),
    ]);

    // Calculate metrics
    const totalAnalyses = analyses.length;
    const averageScore = totalAnalyses > 0
      ? analyses.reduce((sum: number, a: any) => sum + (a.overallScore || 0), 0) / totalAnalyses
      : 0;

    const totalIssues = analyses.reduce(
      (sum: number, a: any) => sum + (a.issues?.length || 0),
      0
    );

    const resolvedIssues = analyses.filter((a: any) => {
      const issues = a.issues || [];
      return issues.length === 0 || issues.every((i: any) => i.type === 'info');
    }).length;

    const totalKeywords = keywords.length;
    const keywordsWithRank = keywords.filter((k: any) => k.currentRank !== undefined).length;
    const averageRank = keywordsWithRank > 0
      ? keywords
          .filter((k: any) => k.currentRank !== undefined)
          .reduce((sum: number, k: any) => sum + (k.currentRank || 0), 0) / keywordsWithRank
      : 0;

    const totalRedirects = redirects.length;
    const redirectHits = redirects.reduce((sum: number, r: any) => sum + (r.hitCount || 0), 0);

    const total404Errors = errors404.length;
    const active404Errors = errors404.filter((e: any) => e.status === 'active').length;
    const resolved404Errors = errors404.filter((e: any) => e.status === 'resolved').length;

    // Calculate trends (compare with previous period)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const previousAnalyses = await seoAnalysis
      .find({
        analyzedAt: {
          $gte: previousStartDate,
          $lt: startDate,
        },
      })
      .toArray();

    const previousAverageScore = previousAnalyses.length > 0
      ? previousAnalyses.reduce((sum: number, a: any) => sum + (a.overallScore || 0), 0) / previousAnalyses.length
      : 0;

    const scoreChange = averageScore - previousAverageScore;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          seo: {
            totalAnalyses,
            averageScore: Math.round(averageScore * 10) / 10,
            previousAverageScore: Math.round(previousAverageScore * 10) / 10,
            scoreChange: Math.round(scoreChange * 10) / 10,
            totalIssues,
            resolvedIssues,
            resolutionRate: totalIssues > 0
              ? Math.round((resolvedIssues / totalIssues) * 100 * 10) / 10
              : 0,
          },
          keywords: {
            totalKeywords,
            keywordsWithRank,
            averageRank: Math.round(averageRank * 10) / 10,
            trackingRate: totalKeywords > 0
              ? Math.round((keywordsWithRank / totalKeywords) * 100 * 10) / 10
              : 0,
          },
          redirects: {
            totalRedirects,
            redirectHits,
            averageHitsPerRedirect: totalRedirects > 0
              ? Math.round((redirectHits / totalRedirects) * 10) / 10
              : 0,
          },
          errors404: {
            total404Errors,
            active404Errors,
            resolved404Errors,
            resolutionRate: total404Errors > 0
              ? Math.round((resolved404Errors / total404Errors) * 100 * 10) / 10
              : 0,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



