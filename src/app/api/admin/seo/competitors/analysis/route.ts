// Competitor Analysis API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/competitors/analysis
 * Analyze competitors and compare with our data
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

    const { competitors, competitorKeywords, keywordTracking } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const competitorId = searchParams.get('competitorId');
    const keyword = searchParams.get('keyword');

    // Get competitors
    const query: any = { enabled: true };
    if (competitorId) {
      query.id = competitorId;
    }

    const competitorList = await competitors.find(query).toArray();

    const analysis: any[] = [];

    for (const competitor of competitorList) {
      // Get competitor keywords
      const compKeywords = await competitorKeywords
        .find({ competitorId: competitor.id })
        .toArray();

      // Compare with our keywords
      const comparison: any[] = [];
      
      for (const compKeyword of compKeywords) {
        if (keyword && compKeyword.keyword !== keyword) continue;

        // Find our keyword tracking
        const ourKeyword = await keywordTracking.findOne({
          keyword: compKeyword.keyword,
          status: 'tracking',
        });

        comparison.push({
          keyword: compKeyword.keyword,
          competitorRank: compKeyword.competitorRank,
          ourRank: ourKeyword?.currentRank,
          rankGap: ourKeyword?.currentRank && compKeyword.competitorRank
            ? compKeyword.competitorRank - ourKeyword.currentRank
            : null,
          searchVolume: compKeyword.searchVolume || ourKeyword?.searchVolume,
          difficulty: compKeyword.difficulty || ourKeyword?.difficulty,
        });
      }

      // Calculate statistics
      const keywordsWeRankHigher = comparison.filter(
        c => c.ourRank && c.competitorRank && c.ourRank < c.competitorRank
      ).length;
      
      const keywordsTheyRankHigher = comparison.filter(
        c => c.ourRank && c.competitorRank && c.ourRank > c.competitorRank
      ).length;

      analysis.push({
        competitor: {
          id: competitor.id,
          name: competitor.name,
          domain: competitor.domain,
          domainAuthority: competitor.domainAuthority,
          backlinks: competitor.backlinks,
        },
        keywords: {
          total: comparison.length,
          weRankHigher: keywordsWeRankHigher,
          theyRankHigher: keywordsTheyRankHigher,
          tied: comparison.length - keywordsWeRankHigher - keywordsTheyRankHigher,
        },
        comparison: comparison.slice(0, 20), // Top 20
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        summary: {
          totalCompetitors: analysis.length,
          totalKeywords: analysis.reduce((sum, a) => sum + a.keywords.total, 0),
        },
      },
    });
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




