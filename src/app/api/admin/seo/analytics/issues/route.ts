// Issue Resolution Tracking API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/analytics/issues
 * Track issue resolution over time
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

    const query: any = {
      analyzedAt: { $gte: startDate },
    };

    if (entityType) {
      query.entityType = entityType;
    }

    // Get analyses grouped by date
    const analyses = await seoAnalysis
      .find(query)
      .sort({ analyzedAt: 1 })
      .toArray();

    // Track issues over time
    const issueTracking: Record<string, {
      date: string;
      totalIssues: number;
      errors: number;
      warnings: number;
      info: number;
      resolvedIssues: number; // Issues that were fixed (compared to previous analysis)
    }> = {};

    analyses.forEach((analysis: any, index: number) => {
      const date = new Date(analysis.analyzedAt).toISOString().split('T')[0];
      
      if (!issueTracking[date]) {
        issueTracking[date] = {
          date,
          totalIssues: 0,
          errors: 0,
          warnings: 0,
          info: 0,
          resolvedIssues: 0,
        };
      }

      const issues = analysis.issues || [];
      issueTracking[date].totalIssues += issues.length;
      issueTracking[date].errors += issues.filter((i: any) => i.type === 'error').length;
      issueTracking[date].warnings += issues.filter((i: any) => i.type === 'warning').length;
      issueTracking[date].info += issues.filter((i: any) => i.type === 'info').length;

      // Compare with previous analysis to detect resolved issues
      if (index > 0) {
        const previousAnalysis = analyses[index - 1];
        const previousIssues = previousAnalysis.issues || [];
        const currentIssueKeys = new Set(
          issues.map((i: any) => `${i.field}:${i.message}`)
        );
        const resolved = previousIssues.filter(
          (pi: any) => !currentIssueKeys.has(`${pi.field}:${pi.message}`)
        ).length;
        issueTracking[date].resolvedIssues += resolved;
      }
    });

    const trends = Object.values(issueTracking).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Calculate current vs previous period
    const currentPeriodIssues = analyses
      .slice(-Math.floor(analyses.length / 2))
      .flatMap((a: any) => a.issues || []);
    
    const previousPeriodIssues = analyses
      .slice(0, Math.floor(analyses.length / 2))
      .flatMap((a: any) => a.issues || []);

    const currentTotal = currentPeriodIssues.length;
    const previousTotal = previousPeriodIssues.length;
    const resolutionRate = previousTotal > 0
      ? ((previousTotal - currentTotal) / previousTotal) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        trends,
        summary: {
          currentTotalIssues: currentTotal,
          previousTotalIssues: previousTotal,
          resolutionRate: Math.round(resolutionRate * 10) / 10,
          trend: currentTotal < previousTotal ? 'improving' : currentTotal > previousTotal ? 'worsening' : 'stable',
        },
      },
    });
  } catch (error) {
    console.error('Error tracking issues:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}








