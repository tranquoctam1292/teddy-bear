// Content Optimization API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generateContentOptimizationSuggestions,
  analyzeContentStructure,
} from '@/lib/seo/content-optimizer';

/**
 * POST /api/admin/seo/content-optimization
 * Analyze content and generate optimization suggestions
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
    const { content, keyword, readabilityScore } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    // Generate optimization suggestions
    const result = generateContentOptimizationSuggestions(
      content,
      keyword,
      readabilityScore
    );

    return NextResponse.json({
      success: true,
      data: {
        suggestions: result.suggestions,
        structure: result.structure,
        keywordPlacement: result.keywordPlacement,
      },
    });
  } catch (error) {
    console.error('Error analyzing content optimization:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




