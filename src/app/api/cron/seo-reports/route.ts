/**
 * Cron Job: Execute Scheduled SEO Reports
 * 
 * This endpoint should be called periodically (daily) to execute scheduled reports
 * Can be triggered by:
 * - Vercel Cron Jobs
 * - External cron service (cron-job.org, etc.)
 * - Server cron job
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { generateSEOAuditReport, generateKeywordPerformanceReport, generateContentAnalysisReport } from '@/lib/seo/report-generator';
import { sendEmail } from '@/lib/email';
import { generateReportHTML } from '@/lib/seo/pdf-generator';

// Protect this endpoint with a secret token
const CRON_SECRET = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET || 'your-secret-token';

interface ScheduledReport {
  id: string;
  reportType: 'seo-audit' | 'keyword-performance' | 'content-analysis';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'csv' | 'pdf' | 'email';
  enabled: boolean;
  lastRun?: Date;
  nextRun: Date;
  entityType?: string;
  entityIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Execute scheduled reports that are due
 */
async function executeScheduledReports() {
  const { scheduledReports, seoAnalysis, keywordTracking } = await getCollections();
  const now = new Date();

  // Find reports that are due (nextRun <= now) and enabled
  const dueReports = await scheduledReports
    .find({
      enabled: true,
      nextRun: { $lte: now },
    })
    .toArray() as ScheduledReport[];

  const results = [];

  for (const schedule of dueReports) {
    try {
      // Calculate period based on frequency
      const end = new Date();
      let start = new Date();
      
      switch (schedule.frequency) {
        case 'daily':
          start.setDate(start.getDate() - 1);
          break;
        case 'weekly':
          start.setDate(start.getDate() - 7);
          break;
        case 'monthly':
          start.setMonth(start.getMonth() - 1);
          break;
      }

      const period = { start, end };

      // Generate report
      let report: any;

      if (schedule.reportType === 'seo-audit') {
        const query: any = {
          analyzedAt: {
            $gte: start,
            $lte: end,
          },
        };
        if (schedule.entityType) query.entityType = schedule.entityType;
        if (schedule.entityIds && schedule.entityIds.length > 0) {
          query.entityId = { $in: schedule.entityIds };
        }
        const analyses = await seoAnalysis.find(query).toArray();
        report = generateSEOAuditReport(analyses as any, period);
      } else if (schedule.reportType === 'keyword-performance') {
        const query: any = {};
        if (schedule.entityType && schedule.entityType !== 'global') {
          query.entityType = schedule.entityType;
        }
        if (schedule.entityIds && schedule.entityIds.length > 0) {
          query.entityId = { $in: schedule.entityIds };
        }
        const keywords = await keywordTracking.find(query).toArray();
        report = generateKeywordPerformanceReport(keywords as any, period);
      } else if (schedule.reportType === 'content-analysis') {
        const query: any = {
          analyzedAt: {
            $gte: start,
            $lte: end,
          },
        };
        if (schedule.entityType) query.entityType = schedule.entityType;
        if (schedule.entityIds && schedule.entityIds.length > 0) {
          query.entityId = { $in: schedule.entityIds };
        }
        const analyses = await seoAnalysis.find(query).toArray();
        report = generateContentAnalysisReport(analyses as any, period);
      }

      // Send report via email
      if (schedule.format === 'email' || schedule.format === 'pdf') {
        const reportTitle = schedule.reportType === 'seo-audit'
          ? 'SEO Audit Report'
          : schedule.reportType === 'keyword-performance'
          ? 'Keyword Performance Report'
          : 'Content Analysis Report';

        const reportHTML = generateReportHTML({
          title: reportTitle,
          subtitle: `Scheduled Report - ${schedule.frequency}`,
          reportData: report,
          reportType: schedule.reportType,
          generatedAt: new Date(),
          period,
        });

        const emailHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .email-header { background: #2563eb; color: white; padding: 20px; text-align: center; }
              .email-body { padding: 20px; }
              .email-footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="email-header">
              <h1>${reportTitle}</h1>
            </div>
            <div class="email-body">
              <p>Xin chào,</p>
              <p>Bạn nhận được báo cáo SEO được tạo tự động theo lịch trình (${schedule.frequency}).</p>
              ${reportHTML}
              <p>Trân trọng,<br>SEO Management Center - The Emotional House</p>
            </div>
            <div class="email-footer">
              <p>Báo cáo này được tạo tự động. Vui lòng không trả lời email này.</p>
            </div>
          </body>
          </html>
        `;

        const emailSubject = `${reportTitle} - ${new Date().toLocaleDateString('vi-VN')}`;
        
        // Send to all recipients
        const emailResults = await Promise.allSettled(
          schedule.recipients.map((recipient: string) =>
            sendEmail(recipient, emailSubject, emailHTML)
          )
        );

        const successful = emailResults.filter(r => r.status === 'fulfilled' && r.value.success).length;

        results.push({
          scheduleId: schedule.id,
          reportType: schedule.reportType,
          success: true,
          emailsSent: successful,
          totalRecipients: schedule.recipients.length,
        });
      }

      // Calculate next run date
      const nextRun = new Date();
      switch (schedule.frequency) {
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

      // Update schedule
      await scheduledReports.updateOne(
        { id: schedule.id },
        {
          $set: {
            lastRun: now,
            nextRun,
            updatedAt: now,
          },
        }
      );
    } catch (error) {
      console.error(`Error executing scheduled report ${schedule.id}:`, error);
      results.push({
        scheduleId: schedule.id,
        reportType: schedule.reportType,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

export async function GET(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

    if (token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Execute scheduled reports
    const results = await executeScheduledReports();

    return NextResponse.json({
      success: true,
      executed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SEO reports cron error:', error);
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



