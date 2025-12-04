// AI Usage Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserUsageStats } from '@/lib/seo/ai-rate-limiter';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/ai/usage
 * Get current user's AI usage statistics
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

    const stats = await getUserUsageStats(session.user.id || '');
    
    // Get recent usage logs for details
    const { aiUsageLogs } = await getCollections();
    const recentLogs = await aiUsageLogs
      .find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        remaining: {
          daily: stats.limits.daily - stats.daily,
          monthly: stats.limits.monthly - stats.monthly,
        },
        percentage: {
          daily: (stats.daily / stats.limits.daily) * 100,
          monthly: (stats.monthly / stats.limits.monthly) * 100,
        },
        recentActivity: recentLogs.map((log: any) => ({
          action: log.action,
          provider: log.provider,
          timestamp: log.timestamp,
          tokensUsed: log.tokensUsed,
          cost: log.estimatedCost,
          success: log.success,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching AI usage stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

