// Email Reports API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { generateReportHTML } from '@/lib/seo/pdf-generator';

/**
 * POST /api/admin/seo/reports/email
 * Send report via email
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
    const { report, recipients, subject, message, format = 'html' } = body;

    if (!report || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: report, recipients' },
        { status: 400 }
      );
    }

    try {
      // Generate report HTML
      const reportTitle = report.reportId.includes('audit') 
        ? 'SEO Audit Report' 
        : report.reportId.includes('keyword')
        ? 'Keyword Performance Report'
        : 'Content Analysis Report';

      const reportHTML = generateReportHTML({
        title: reportTitle,
        subtitle: `Generated on ${new Date(report.generatedAt).toLocaleDateString('vi-VN')}`,
        reportData: report,
        reportType: report.reportId.includes('audit') 
          ? 'seo-audit' 
          : report.reportId.includes('keyword')
          ? 'keyword-performance'
          : 'content-analysis',
        generatedAt: new Date(report.generatedAt),
        period: {
          start: new Date(report.period.start),
          end: new Date(report.period.end),
        },
      });

      // Create email HTML
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
            ${message ? '.message { background: #eff6ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }' : ''}
          </style>
        </head>
        <body>
          <div class="email-header">
            <h1>${reportTitle}</h1>
          </div>
          <div class="email-body">
            ${message ? `<div class="message"><p>${message}</p></div>` : ''}
            <p>Xin chào,</p>
            <p>Bạn nhận được báo cáo SEO được tạo tự động. Xem chi tiết bên dưới:</p>
            ${reportHTML}
            <p>Trân trọng,<br>SEO Management Center - The Emotional House</p>
          </div>
          <div class="email-footer">
            <p>Báo cáo này được tạo tự động. Vui lòng không trả lời email này.</p>
          </div>
        </body>
        </html>
      `;

      // Send emails to all recipients
      const emailSubject = subject || `${reportTitle} - ${new Date(report.generatedAt).toLocaleDateString('vi-VN')}`;
      const results = await Promise.allSettled(
        recipients.map((recipient: string) =>
          sendEmail(recipient, emailSubject, emailHTML)
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

      return NextResponse.json({
        success: true,
        data: {
          message: `Email report sent to ${successful} recipient(s)`,
          recipients: {
            total: recipients.length,
            successful,
            failed,
          },
          results: results.map((r, i) => ({
            recipient: recipients[i],
            success: r.status === 'fulfilled' && r.value.success,
            error: r.status === 'rejected' 
              ? 'Failed to send email'
              : r.status === 'fulfilled' && !r.value.success
              ? r.value.error
              : undefined,
          })),
        },
      });
    } catch (error) {
      console.error('Error sending email report:', error);
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Failed to send email report' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

