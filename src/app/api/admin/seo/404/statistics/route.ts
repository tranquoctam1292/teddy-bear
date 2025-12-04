// 404 Error Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Error404Statistics } from '@/lib/schemas/error-404-log';

/**
 * GET /api/admin/seo/404/statistics
 * Get 404 error statistics
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

    const { error404Log } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    const days = Number(searchParams.get('days')) || 30; // Default to last 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all errors
    const allErrors = await error404Log.find({}).toArray();

    // Calculate statistics
    const totalErrors = allErrors.length;
    const activeErrors = allErrors.filter((e: any) => e.status === 'active').length;
    const resolvedErrors = allErrors.filter((e: any) => e.status === 'resolved').length;
    const ignoredErrors = allErrors.filter((e: any) => e.status === 'ignored').length;

    // Top errors by count
    const topErrors = allErrors
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)
      .map((e: any) => ({
        url: e.url,
        count: e.count,
        lastSeen: e.lastSeen,
        status: e.status,
      }));

    // Errors by cause
    const errorsByCause: Record<string, number> = {};
    allErrors.forEach((e: any) => {
      const cause = e.likelyCause || 'unknown';
      errorsByCause[cause] = (errorsByCause[cause] || 0) + e.count;
    });

    // Errors by day (last N days)
    const errorsByDay: Array<{ date: string; count: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Count errors that occurred on this day
      const dayCount = allErrors.reduce((sum: number, e: any) => {
        const errorDate = new Date(e.lastSeen);
        if (errorDate.toISOString().split('T')[0] === dateStr) {
          return sum + e.count;
        }
        return sum;
      }, 0);

      errorsByDay.push({
        date: dateStr,
        count: dayCount,
      });
    }

    const statistics: Error404Statistics = {
      totalErrors,
      activeErrors,
      resolvedErrors,
      ignoredErrors,
      topErrors,
      errorsByCause,
      errorsByDay,
    };

    return NextResponse.json({
      success: true,
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.error('Error fetching 404 statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



