// Report Generation API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import {
  generateSEOAuditReport,
  generateKeywordPerformanceReport,
  generateContentAnalysisReport,
  REPORT_TEMPLATES,
  type ReportType,
} from '@/lib/seo/report-generator';

/**
 * POST /api/admin/seo/reports/generate
 * Generate SEO reports
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
    const { reportType, startDate, endDate, entityType, entityIds } = body;

    if (!reportType) {
      return NextResponse.json(
        { error: 'Missing required field: reportType' },
        { status: 400 }
      );
    }

    // Calculate period
    const end = endDate ? new Date(endDate) : new Date();
    let start: Date;
    
    if (startDate) {
      start = new Date(startDate);
    } else {
      // Default to last 30 days
      start = new Date();
      start.setDate(start.getDate() - 30);
    }

    const period = { start, end };

    const { seoAnalysis, keywordTracking } = await getCollections();

    // Generate report based on type
    if (reportType === 'seo-audit') {
      // Get analyses
      const query: any = {
        analyzedAt: {
          $gte: start,
          $lte: end,
        },
      };

      if (entityType) {
        query.entityType = entityType;
      }

      if (entityIds && entityIds.length > 0) {
        query.entityId = { $in: entityIds };
      }

      const analyses = await seoAnalysis.find(query).toArray();
      const report = generateSEOAuditReport(analyses as any, period);

      return NextResponse.json({
        success: true,
        data: {
          report,
          type: 'seo-audit',
        },
      });
    }

    if (reportType === 'keyword-performance') {
      // Get keywords
      const query: any = {};

      if (entityType && entityType !== 'global') {
        query.entityType = entityType;
      }

      if (entityIds && entityIds.length > 0) {
        query.entityId = { $in: entityIds };
      }

      const keywords = await keywordTracking.find(query).toArray();
      const report = generateKeywordPerformanceReport(keywords as any, period);

      return NextResponse.json({
        success: true,
        data: {
          report,
          type: 'keyword-performance',
        },
      });
    }

    if (reportType === 'content-analysis') {
      // Get analyses
      const query: any = {
        analyzedAt: {
          $gte: start,
          $lte: end,
        },
      };

      if (entityType) {
        query.entityType = entityType;
      }

      if (entityIds && entityIds.length > 0) {
        query.entityId = { $in: entityIds };
      }

      const analyses = await seoAnalysis.find(query).toArray();
      const report = generateContentAnalysisReport(analyses as any, period);

      return NextResponse.json({
        success: true,
        data: {
          report,
          type: 'content-analysis',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid report type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seo/reports/templates
 * Get available report templates
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

    return NextResponse.json({
      success: true,
      data: {
        templates: REPORT_TEMPLATES,
      },
    });
  } catch (error) {
    console.error('Error fetching report templates:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


