// Scheduled Reports API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface ScheduledReport {
  id: string;
  reportType: 'seo-audit' | 'keyword-performance' | 'content-analysis';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'csv' | 'pdf' | 'email';
  enabled: boolean;
  lastRun?: Date;
  nextRun: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/admin/seo/reports/schedule
 * Get scheduled reports
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

    const { scheduledReports } = await getCollections();
    const schedules = await scheduledReports
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        schedules: schedules.map((s: any) => ({
          id: s.id,
          reportType: s.reportType,
          frequency: s.frequency,
          recipients: s.recipients,
          format: s.format,
          enabled: s.enabled,
          lastRun: s.lastRun,
          nextRun: s.nextRun,
          createdAt: s.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching scheduled reports:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/reports/schedule
 * Create scheduled report
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
    const { reportType, frequency, recipients, format = 'email' } = body;

    if (!reportType || !frequency || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: reportType, frequency, recipients' },
        { status: 400 }
      );
    }

    // Calculate next run date
    const nextRun = new Date();
    switch (frequency) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        break;
    }

    const scheduleId = new ObjectId().toString();
    const schedule: ScheduledReport = {
      id: scheduleId,
      reportType,
      frequency,
      recipients,
      format,
      enabled: true,
      nextRun,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to scheduledReports collection
    const { scheduledReports } = await getCollections();
    await scheduledReports.insertOne(schedule as any);

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        message: 'Scheduled report created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating scheduled report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

