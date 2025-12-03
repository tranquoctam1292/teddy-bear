// Google Search Console Data API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getGSCClient } from '@/lib/seo/gsc-integration';

/**
 * GET /api/admin/seo/gsc/data
 * Get Google Search Console data
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

    const gscClient = getGSCClient();
    if (!gscClient) {
      return NextResponse.json({
        success: false,
        error: 'Google Search Console not configured. Set GSC_SITE_URL and GSC_ACCESS_TOKEN environment variables.',
      }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'queries'; // queries, pages, countries
    const days = Number(searchParams.get('days')) || 30;
    const limit = Number(searchParams.get('limit')) || 100;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    let data: any = {};

    try {
      switch (type) {
        case 'queries':
          data.queries = await gscClient.getTopQueries(startDateStr, endDateStr, limit);
          break;
        case 'pages':
          data.pages = await gscClient.getTopPages(startDateStr, endDateStr, limit);
          break;
        case 'countries':
          data.countries = await gscClient.getDataByCountry(startDateStr, endDateStr);
          break;
        case 'all':
          data.queries = await gscClient.getTopQueries(startDateStr, endDateStr, limit);
          data.pages = await gscClient.getTopPages(startDateStr, endDateStr, limit);
          data.countries = await gscClient.getDataByCountry(startDateStr, endDateStr);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid type. Use: queries, pages, countries, or all' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          period: {
            start: startDateStr,
            end: endDateStr,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching GSC data:', error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch GSC data',
        note: 'Make sure GSC_ACCESS_TOKEN is valid and has Search Console API access.',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GSC data API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


