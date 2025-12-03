// Keyword Suggestions API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/keywords/suggestions
 * Get keyword suggestions based on content or existing keywords
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
    const content = searchParams.get('content'); // Content to analyze
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const limit = Number(searchParams.get('limit')) || 10;

    const suggestions: Array<{
      keyword: string;
      searchVolume?: number;
      difficulty?: number;
      relevance: number; // 0-100
      source: 'content' | 'related' | 'competitor';
    }> = [];

    // Extract keywords from content (simple keyword extraction)
    if (content) {
      // Simple keyword extraction (in production, use NLP library)
      const words = content
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);

      // Count word frequency
      const wordFreq: Record<string, number> = {};
      words.forEach((word) => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });

      // Get top words as potential keywords
      const topWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, freq]) => ({
          keyword: word,
          relevance: Math.min(100, (freq / words.length) * 100),
          source: 'content' as const,
        }));

      suggestions.push(...topWords);
    }

    // Get related keywords from existing tracked keywords
    if (entityType || entityId) {
      const { keywordTracking } = await getCollections();
      const query: any = { status: 'tracking' };
      
      if (entityType) query.entityType = entityType;
      if (entityId) query.entityId = entityId;

      const relatedKeywords = await keywordTracking
        .find(query)
        .limit(limit)
        .toArray();

      relatedKeywords.forEach((k: any) => {
        if (!suggestions.find((s) => s.keyword === k.keyword)) {
          suggestions.push({
            keyword: k.keyword,
            searchVolume: k.searchVolume,
            difficulty: k.difficulty,
            relevance: 70, // Medium relevance for related keywords
            source: 'related',
          });
        }
      });
    }

    // Sort by relevance
    suggestions.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({
      success: true,
      data: {
        suggestions: suggestions.slice(0, limit),
        total: suggestions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching keyword suggestions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


