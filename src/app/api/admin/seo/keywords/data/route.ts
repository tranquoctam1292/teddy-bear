// Keyword Data API - Get comprehensive keyword data
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getKeywordData } from '@/lib/seo/keyword-data-providers';

/**
 * GET /api/admin/seo/keywords/data?keyword=xxx&source=auto
 * Get keyword data from available sources
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const source = (searchParams.get('source') || 'auto') as 'auto' | 'serpapi' | 'gsc' | 'internal';

    if (!keyword) {
      return NextResponse.json(
        { error: 'Missing required parameter: keyword' },
        { status: 400 }
      );
    }

    // Get keyword data
    const data = await getKeywordData(keyword, source);

    return NextResponse.json({
      success: true,
      data,
      note: getSourceNote(data.source, data.confidence || 'medium'),
    });
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSourceNote(source: string, confidence: string): string {
  const notes: { [key: string]: string } = {
    'serpapi': 'Data from Google SERP analysis (high accuracy)',
    'dataforseo': 'Data from DataForSEO API (high accuracy)',
    'internal': `Data calculated from your historical performance (${confidence} confidence)`,
    'gsc': 'Data from Google Search Console',
    'estimated': 'Estimated data based on keyword characteristics (low confidence)',
  };

  return notes[source] || 'Data from unknown source';
}

