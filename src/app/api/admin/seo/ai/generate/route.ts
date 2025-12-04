// AI Content Generation API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generateMetaDescription,
  generateTitle,
  generateContentSuggestions,
  optimizeTitle,
  generateKeywordVariations,
} from '@/lib/seo/ai-generator';
import { getAIProvider, type AIProvider } from '@/lib/seo/ai-providers';
import { checkRateLimit, logAIUsage, getUserUsageStats, estimateCost } from '@/lib/seo/ai-rate-limiter';

/**
 * POST /api/admin/seo/ai/generate
 * Generate AI content (meta descriptions, titles, etc.)
 */
export async function POST(request: NextRequest) {
  let useAI = false;
  let aiProvider: string | undefined;
  let session;
  
  try {
    // Check authentication
    session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, content, keyword, options = {} } = body;
    useAI = body.useAI || false;
    aiProvider = body.aiProvider;
    
    // Get user IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    // Check rate limit if using AI
    if (useAI) {
      const rateLimitResult = await checkRateLimit(session.user.id || '', ip, 'ai_generation');
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: rateLimitResult.message,
            rateLimitInfo: {
              remaining: rateLimitResult.remaining,
              resetAt: rateLimitResult.resetAt,
              currentUsage: rateLimitResult.currentUsage,
            },
          },
          { status: 429 } // Too Many Requests
        );
      }
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    let result: any = {};

    switch (type) {
      case 'meta-description':
        if (!content) {
          return NextResponse.json(
            { error: 'Missing required field: content' },
            { status: 400 }
          );
        }
        result.metaDescription = await generateMetaDescription(
          {
            content,
            keyword,
            maxLength: options.maxLength || 160,
            tone: options.tone || 'professional',
          },
          useAI,
          aiProvider as AIProvider | undefined
        );
        break;

      case 'title':
        if (!content) {
          return NextResponse.json(
            { error: 'Missing required field: content' },
            { status: 400 }
          );
        }
        result.title = await generateTitle(
          {
            content,
            keyword,
            maxLength: options.maxLength || 60,
          },
          useAI,
          aiProvider as AIProvider | undefined
        );
        break;

      case 'optimize-title':
        if (!body.title) {
          return NextResponse.json(
            { error: 'Missing required field: title' },
            { status: 400 }
          );
        }
        result.optimizedTitle = optimizeTitle(
          body.title,
          keyword,
          options.maxLength || 60
        );
        break;

      case 'content-suggestions':
        if (!content) {
          return NextResponse.json(
            { error: 'Missing required field: content' },
            { status: 400 }
          );
        }
        result.suggestions = generateContentSuggestions(content, keyword);
        break;

      case 'keyword-variations':
        if (!keyword) {
          return NextResponse.json(
            { error: 'Missing required field: keyword' },
            { status: 400 }
          );
        }
        result.variations = generateKeywordVariations(keyword);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    // Check available AI providers
    const availableProviders: string[] = [];
    if (process.env.OPENAI_API_KEY) availableProviders.push('openai');
    if (process.env.ANTHROPIC_API_KEY) availableProviders.push('claude');
    if (process.env.GEMINI_API_KEY) availableProviders.push('gemini');

    // Log AI usage if AI was used
    if (useAI && result.provider && result.provider !== 'rule-based') {
      const tokensUsed = result.tokensUsed || estimateTokens(content || keyword || '');
      const cost = estimateCost(result.provider, tokensUsed);
      
      await logAIUsage(
        session.user.id || '',
        result.provider,
        tokensUsed,
        cost,
        'ai_generation',
        true
      );
    }
    
    // Get current usage stats
    const usageStats = await getUserUsageStats(session.user.id || '');

    return NextResponse.json({
      success: true,
      data: result,
      ai: {
        used: useAI && result.metaDescription ? 'ai' : 'rule-based',
        availableProviders,
        note: useAI
          ? `Using ${aiProvider || 'auto-selected'} AI provider`
          : 'Using rule-based generation. Set useAI=true to use AI.',
      },
      usage: {
        daily: usageStats.daily,
        monthly: usageStats.monthly,
        limits: usageStats.limits,
        totalCost: usageStats.totalCost,
        remaining: {
          daily: usageStats.limits.daily - usageStats.daily,
          monthly: usageStats.limits.monthly - usageStats.monthly,
        },
      },
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    
    // Log failed attempt if it was an AI request
    if (useAI && session?.user?.id) {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      await logAIUsage(
        session.user.id,
        aiProvider || 'unknown',
        0,
        0,
        'ai_generation',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to estimate tokens from text
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

