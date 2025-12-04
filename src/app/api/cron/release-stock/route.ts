/**
 * Background Job: Release Expired Stock Reservations
 * 
 * This endpoint should be called periodically (every 5 minutes) to release expired stock
 * Can be triggered by:
 * - Vercel Cron Jobs
 * - External cron service (cron-job.org, etc.)
 * - Server cron job
 */
import { NextRequest, NextResponse } from 'next/server';
import { releaseExpiredReservations } from '@/lib/stock/reservation';

// Protect this endpoint with a secret token
const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-token';

export async function GET(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

    if (token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Release expired reservations
    const releasedCount = await releaseExpiredReservations();

    return NextResponse.json({
      success: true,
      releasedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Release stock cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support POST for cron services that use POST
export async function POST(request: NextRequest) {
  return GET(request);
}



