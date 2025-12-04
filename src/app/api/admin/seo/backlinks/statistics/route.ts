// Backlink Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { cached, generateCacheKey } from '@/lib/seo/cache';

/**
 * GET /api/admin/seo/backlinks/statistics
 * Get backlink statistics
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

    const { backlinks } = await getCollections();
    
    // Use cache
    // const cache = getCache();
    const cacheKey = generateCacheKey('backlinks:stats');
    
    const stats = await cached(
      cacheKey,
      async () => {
        // Get all backlinks for aggregation
        const allBacklinks = await backlinks.find({}).toArray();

        const total = allBacklinks.length;
        const active = allBacklinks.filter((b: any) => b.status === 'active').length;
        const lost = allBacklinks.filter((b: any) => b.status === 'lost').length;
        
        const highQuality = allBacklinks.filter((b: any) => b.quality === 'high').length;
        const mediumQuality = allBacklinks.filter((b: any) => b.quality === 'medium').length;
        const lowQuality = allBacklinks.filter((b: any) => b.quality === 'low').length;
        const toxic = allBacklinks.filter((b: any) => b.quality === 'toxic').length;

        const dofollow = allBacklinks.filter((b: any) => b.isDofollow).length;
        const nofollow = allBacklinks.filter((b: any) => b.isNofollow).length;

        // Calculate average metrics
        const withDA = allBacklinks.filter((b: any) => b.domainAuthority !== undefined);
        const averageDA = withDA.length > 0
          ? withDA.reduce((sum: number, b: any) => sum + (b.domainAuthority || 0), 0) / withDA.length
          : 0;

        const withPA = allBacklinks.filter((b: any) => b.pageAuthority !== undefined);
        const averagePA = withPA.length > 0
          ? withPA.reduce((sum: number, b: any) => sum + (b.pageAuthority || 0), 0) / withPA.length
          : 0;

        // Top referring domains
        const domainCounts: Record<string, number> = {};
        allBacklinks.forEach((b: any) => {
          domainCounts[b.sourceDomain] = (domainCounts[b.sourceDomain] || 0) + 1;
        });

        const topDomains = Object.entries(domainCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([domain, count]) => ({ domain, count }));

        return {
          total,
          active,
          lost,
          quality: {
            high: highQuality,
            medium: mediumQuality,
            low: lowQuality,
            toxic,
          },
          follow: {
            dofollow,
            nofollow,
          },
          averages: {
            domainAuthority: Math.round(averageDA * 10) / 10,
            pageAuthority: Math.round(averagePA * 10) / 10,
          },
          topDomains,
        };
      },
      10 * 60 * 1000 // 10 minutes cache
    );

    return NextResponse.json({
      success: true,
      data: {
        statistics: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching backlink statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



