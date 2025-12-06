// Traffic Correlation API (Google Analytics Integration)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { getGAClient } from '@/lib/seo/google-analytics';

/**
 * GET /api/admin/seo/analytics/traffic-correlation
 * Get traffic correlation between SEO scores and Google Analytics data
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

    const searchParams = request.nextUrl.searchParams;
    const days = Number(searchParams.get('days')) || 30;
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const { seoAnalysis } = await getCollections();

    // Get SEO analysis data
    const query: any = {
      analyzedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (entityType) {
      query.entityType = entityType;
    }

    if (entityId) {
      query.entityId = entityId;
    }

    const analyses = await seoAnalysis
      .find(query)
      .sort({ analyzedAt: 1 })
      .toArray();

    // Group analyses by date and calculate average scores
    const scoreByDate: Record<string, { score: number; count: number }> = {};
    analyses.forEach((analysis: any) => {
      const date = new Date(analysis.analyzedAt).toISOString().split('T')[0];
      if (!scoreByDate[date]) {
        scoreByDate[date] = { score: 0, count: 0 };
      }
      scoreByDate[date].score += analysis.overallScore || 0;
      scoreByDate[date].count++;
    });

    const seoScores = Object.entries(scoreByDate).map(([date, data]) => ({
      date,
      averageScore: data.count > 0 ? data.score / data.count : 0,
      pageCount: data.count,
    }));

    // Try to fetch Google Analytics data
    const gaClient = getGAClient();
    let trafficData: any[] = [];
    let correlation: any = null;

    if (gaClient) {
      try {
        const gaStartDate = startDate.toISOString().split('T')[0];
        const gaEndDate = endDate.toISOString().split('T')[0];
        trafficData = await gaClient.getTrafficData(gaStartDate, gaEndDate);

        // Calculate correlation between SEO scores and traffic
        if (trafficData.length > 0 && seoScores.length > 0) {
          // Match dates and calculate correlation
          const matchedData = seoScores
            .map(seo => {
              const traffic = trafficData.find(t => t.date === seo.date);
              return traffic
                ? {
                    date: seo.date,
                    score: seo.averageScore,
                    sessions: traffic.sessions,
                    organicSessions: traffic.organicSessions,
                    pageviews: traffic.pageviews,
                  }
                : null;
            })
            .filter(Boolean);

          if (matchedData.length > 1) {
            // Calculate Pearson correlation coefficient
            const scores = matchedData.map(d => d!.score);
            const sessions = matchedData.map(d => d!.sessions);
            const organicSessions = matchedData.map(d => d!.organicSessions);

            const correlationSessions = calculateCorrelation(scores, sessions);
            const correlationOrganic = calculateCorrelation(scores, organicSessions);

            correlation = {
              sessions: {
                coefficient: correlationSessions,
                interpretation: interpretCorrelation(correlationSessions),
              },
              organicSessions: {
                coefficient: correlationOrganic,
                interpretation: interpretCorrelation(correlationOrganic),
              },
            };
          }
        }
      } catch (error) {
        console.error('Error fetching GA data:', error);
        // Continue without GA data
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        seoScores,
        trafficData: trafficData.length > 0 ? trafficData : null,
        correlation,
        hasGAData: trafficData.length > 0,
        message: gaClient
          ? trafficData.length > 0
            ? 'Traffic correlation calculated successfully'
            : 'GA data not available for the selected period'
          : 'Google Analytics not configured. Set GA_PROPERTY_ID and GA_ACCESS_TOKEN environment variables.',
      },
    });
  } catch (error) {
    console.error('Error calculating traffic correlation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return 0;

  return numerator / denominator;
}

/**
 * Interpret correlation coefficient
 */
function interpretCorrelation(r: number): string {
  const absR = Math.abs(r);
  if (absR >= 0.9) return 'Very strong correlation';
  if (absR >= 0.7) return 'Strong correlation';
  if (absR >= 0.5) return 'Moderate correlation';
  if (absR >= 0.3) return 'Weak correlation';
  return 'Very weak or no correlation';
}








