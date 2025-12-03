// Keyword Ranking Alerts API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/keywords/alerts
 * Get ranking alerts (keywords that dropped significantly or achieved targets)
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

    const { keywordTracking } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const alertType = searchParams.get('type'); // 'drop' | 'achievement' | 'all'
    const threshold = Number(searchParams.get('threshold')) || 5; // Rank drop threshold

    const keywords = await keywordTracking
      .find({ status: 'tracking' })
      .toArray();

    const alerts: Array<{
      type: 'drop' | 'achievement' | 'target-approaching';
      keyword: string;
      keywordId: string;
      entityType: string;
      entityId?: string;
      currentRank?: number;
      previousRank?: number;
      rankChange: number;
      targetRank?: number;
      message: string;
      severity: 'high' | 'medium' | 'low';
    }> = [];

    keywords.forEach((keyword: any) => {
      // Check for rank drops
      if (
        keyword.currentRank !== undefined &&
        keyword.previousRank !== undefined &&
        keyword.currentRank > keyword.previousRank
      ) {
        const drop = keyword.currentRank - keyword.previousRank;
        if (drop >= threshold) {
          alerts.push({
            type: 'drop',
            keyword: keyword.keyword,
            keywordId: keyword.id,
            entityType: keyword.entityType,
            entityId: keyword.entityId,
            currentRank: keyword.currentRank,
            previousRank: keyword.previousRank,
            rankChange: -drop,
            message: `Từ khóa "${keyword.keyword}" giảm ${drop} vị trí (${keyword.previousRank} → ${keyword.currentRank})`,
            severity: drop >= 10 ? 'high' : drop >= 5 ? 'medium' : 'low',
          });
        }
      }

      // Check for target achievement
      if (
        keyword.targetRank !== undefined &&
        keyword.currentRank !== undefined &&
        keyword.currentRank <= keyword.targetRank
      ) {
        alerts.push({
          type: 'achievement',
          keyword: keyword.keyword,
          keywordId: keyword.id,
          entityType: keyword.entityType,
          entityId: keyword.entityId,
          currentRank: keyword.currentRank,
          targetRank: keyword.targetRank,
          rankChange: 0,
          message: `Từ khóa "${keyword.keyword}" đã đạt mục tiêu thứ hạng #${keyword.targetRank}!`,
          severity: 'high',
        });
      }

      // Check for target approaching
      if (
        keyword.targetRank !== undefined &&
        keyword.currentRank !== undefined &&
        keyword.currentRank > keyword.targetRank &&
        keyword.currentRank <= keyword.targetRank + 3
      ) {
        alerts.push({
          type: 'target-approaching',
          keyword: keyword.keyword,
          keywordId: keyword.id,
          entityType: keyword.entityType,
          entityId: keyword.entityId,
          currentRank: keyword.currentRank,
          targetRank: keyword.targetRank,
          rankChange: keyword.currentRank - keyword.targetRank,
          message: `Từ khóa "${keyword.keyword}" đang gần đạt mục tiêu (hiện tại: #${keyword.currentRank}, mục tiêu: #${keyword.targetRank})`,
          severity: 'medium',
        });
      }
    });

    // Filter by type if specified
    const filteredAlerts = alertType && alertType !== 'all'
      ? alerts.filter(a => a.type === alertType)
      : alerts;

    // Sort by severity and date
    filteredAlerts.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });

    return NextResponse.json({
      success: true,
      data: {
        alerts: filteredAlerts,
        summary: {
          total: filteredAlerts.length,
          drops: filteredAlerts.filter(a => a.type === 'drop').length,
          achievements: filteredAlerts.filter(a => a.type === 'achievement').length,
          approaching: filteredAlerts.filter(a => a.type === 'target-approaching').length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching ranking alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/keywords/alerts
 * Mark alert as read/dismissed
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
    const { alertId, keywordId, action } = body; // action: 'dismiss' | 'read'

    // In production, you would store dismissed alerts in a collection
    // For now, just return success

    return NextResponse.json({
      success: true,
      data: {
        message: 'Alert processed successfully',
      },
    });
  } catch (error) {
    console.error('Error processing alert:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


