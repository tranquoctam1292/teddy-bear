// Database Cleanup API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { runAllCleanupJobs, getDbSizeStats } from '@/lib/db/cleanup-jobs';

/**
 * POST /api/admin/maintenance/cleanup
 * Run database cleanup jobs
 * Can be triggered manually or by cron
 */
export async function POST(request: NextRequest) {
  try {
    // Check if request is from cron (Vercel Cron Jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      // Request from cron - proceed
      console.log('Cleanup job triggered by cron');
    } else {
      // Manual request - check admin authentication
      const session = await auth();
      if (!session || session.user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      console.log('Cleanup job triggered manually by admin');
    }
    
    // Run cleanup jobs
    const result = await runAllCleanupJobs();
    
    // Get updated database size
    const dbSize = await getDbSizeStats();
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup jobs completed successfully',
      data: {
        ...result,
        dbSize,
      },
    });
  } catch (error) {
    console.error('Cleanup job failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/maintenance/cleanup
 * Get database size and cleanup statistics
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
    
    const dbSize = await getDbSizeStats();
    
    // Calculate estimates
    const totalSizeMB = dbSize.totalSize / (1024 * 1024);
    const dataSizeMB = dbSize.dataSize / (1024 * 1024);
    const indexSizeMB = dbSize.indexSize / (1024 * 1024);
    
    return NextResponse.json({
      success: true,
      data: {
        size: {
          total: totalSizeMB.toFixed(2) + ' MB',
          data: dataSizeMB.toFixed(2) + ' MB',
          index: indexSizeMB.toFixed(2) + ' MB',
        },
        collections: dbSize.collections.map(c => ({
          ...c,
          sizeMB: (c.size / (1024 * 1024)).toFixed(2),
        })),
        recommendations: generateRecommendations(dbSize),
      },
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateRecommendations(dbSize: any): string[] {
  const recommendations: string[] = [];
  const totalSizeMB = dbSize.totalSize / (1024 * 1024);
  
  if (totalSizeMB > 400) {
    recommendations.push('Database size is over 400MB. Consider running cleanup jobs.');
  }
  
  dbSize.collections.forEach((coll: any) => {
    if (coll.name === 'errorLogs' && coll.count > 10000) {
      recommendations.push(`${coll.name} has ${coll.count} documents. Consider aggregating old errors.`);
    }
    if (coll.name === 'seoKeywords' && coll.count > 5000) {
      recommendations.push(`${coll.name} has ${coll.count} keywords. Consider archiving inactive keywords.`);
    }
    if (coll.name === 'aiUsageLogs' && coll.count > 50000) {
      recommendations.push(`${coll.name} has ${coll.count} logs. Old logs should be cleaned up automatically.`);
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('Database health looks good!');
  }
  
  return recommendations;
}

