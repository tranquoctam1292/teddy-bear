// Keyword Research API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateKeywordVariations } from '@/lib/seo/ai-generator';

/**
 * POST /api/admin/seo/keywords/research
 * Research keywords and get suggestions
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
    const { keyword, entityType, entityId } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: 'Missing required field: keyword' },
        { status: 400 }
      );
    }

    // Generate keyword variations
    const variations = generateKeywordVariations(keyword);

    // Get related keywords from existing tracked keywords
    const { keywordTracking } = await getCollections();
    const relatedKeywords = await keywordTracking
      .find({
        keyword: { $regex: keyword, $options: 'i' },
        status: 'tracking',
      })
      .limit(10)
      .toArray();

    // Get competitor keywords (would need competitor data)
    // For now, return structure

    return NextResponse.json({
      success: true,
      data: {
        keyword,
        variations,
        relatedKeywords: relatedKeywords.map((k: any) => ({
          keyword: k.keyword,
          searchVolume: k.searchVolume,
          difficulty: k.difficulty,
          currentRank: k.currentRank,
        })),
        // Competitor keywords would be here if competitor data available
        competitorKeywords: [],
        note: 'For advanced keyword research, integrate with Google Keyword Planner, Ahrefs, or SEMrush API.',
      },
    });
  } catch (error) {
    console.error('Error researching keywords:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



