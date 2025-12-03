/**
 * Sitemap Regeneration API Route
 * 
 * POST: Manually trigger sitemap regeneration
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { triggerSitemapRegeneration, getSitemapTimestamp } from '@/lib/seo/sitemap-regenerate';

/**
 * POST /api/admin/seo/sitemap/regenerate
 * Manually trigger sitemap regeneration
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

    // Trigger regeneration
    await triggerSitemapRegeneration();
    
    const timestamp = await getSitemapTimestamp();

    return NextResponse.json({
      success: true,
      message: 'Sitemap regeneration triggered successfully',
      lastGenerated: timestamp,
    });
  } catch (error) {
    console.error('Error regenerating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate sitemap' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seo/sitemap/regenerate
 * Get sitemap last generated timestamp
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

    const timestamp = await getSitemapTimestamp();

    return NextResponse.json({
      success: true,
      lastGenerated: timestamp,
    });
  } catch (error) {
    console.error('Error getting sitemap timestamp:', error);
    return NextResponse.json(
      { error: 'Failed to get sitemap timestamp' },
      { status: 500 }
    );
  }
}


