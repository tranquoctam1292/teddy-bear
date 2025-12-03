// Report Export API (CSV, PDF)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generateSEOAuditReport,
  generateKeywordPerformanceReport,
  generateContentAnalysisReport,
} from '@/lib/seo/report-generator';
import { generateReportHTML } from '@/lib/seo/pdf-generator';

/**
 * POST /api/admin/seo/reports/export
 * Export report as CSV or PDF
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
    const { report, format = 'csv' } = body; // format: 'csv' | 'pdf'

    if (!report) {
      return NextResponse.json(
        { error: 'Missing required field: report' },
        { status: 400 }
      );
    }

    if (format === 'csv') {
      // Generate CSV
      const csvRows: string[] = [];
      
      // Add report metadata
      csvRows.push('Report Type,Generated At,Period Start,Period End');
      csvRows.push(
        `${report.reportId},${report.generatedAt},${report.period.start},${report.period.end}`
      );
      csvRows.push('');

      // Add summary
      if (report.summary) {
        csvRows.push('Summary');
        Object.entries(report.summary).forEach(([key, value]) => {
          if (typeof value === 'object') {
            Object.entries(value as Record<string, any>).forEach(([k, v]) => {
              csvRows.push(`${key}.${k},${v}`);
            });
          } else {
            csvRows.push(`${key},${value}`);
          }
        });
        csvRows.push('');
      }

      // Add top issues/performers/etc.
      if (report.topIssues) {
        csvRows.push('Top Issues,Type,Field,Affected Pages,Suggestion');
        report.topIssues.forEach(issue => {
          csvRows.push(
            `"${issue.message}","${issue.type}","${issue.field}",${issue.affectedPages},"${issue.suggestion}"`
          );
        });
      }

      if (report.topPerformers) {
        csvRows.push('');
        csvRows.push('Top Performers,Keyword,Current Rank,Previous Rank,Rank Change,Search Volume');
        report.topPerformers.forEach(performer => {
          csvRows.push(
            `"${performer.keyword}",${performer.currentRank},${performer.previousRank || ''},${performer.rankChange},${performer.searchVolume || ''}`
          );
        });
      }

      if (report.topDecliners) {
        csvRows.push('');
        csvRows.push('Top Decliners,Keyword,Current Rank,Previous Rank,Rank Change');
        report.topDecliners.forEach(decliner => {
          csvRows.push(
            `"${decliner.keyword}",${decliner.currentRank},${decliner.previousRank || ''},${decliner.rankChange}`
          );
        });
      }

      // Add recommendations
      if (report.recommendations && report.recommendations.length > 0) {
        csvRows.push('');
        csvRows.push('Recommendations');
        report.recommendations.forEach(rec => {
          csvRows.push(`"${rec}"`);
        });
      }

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="seo-report-${report.reportId}.csv"`,
        },
      });
    }

    // PDF export - Generate HTML first
    if (format === 'pdf') {
      try {
        // Generate HTML report
        const html = generateReportHTML({
          title: report.reportId.includes('audit') 
            ? 'SEO Audit Report' 
            : report.reportId.includes('keyword')
            ? 'Keyword Performance Report'
            : 'Content Analysis Report',
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

        // Return HTML (can be converted to PDF using puppeteer/playwright on server-side)
        // Or use a service like html-pdf-node, pdfkit, etc.
        // For now, return HTML that can be printed to PDF from browser
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `attachment; filename="seo-report-${report.reportId}.html"`,
          },
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to generate PDF' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid format. Use "csv" or "pdf"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error exporting report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

