// 404 Ignore Patterns API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/seo/404/ignore-patterns
 * Get ignore patterns (stored in seoSettings)
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

    const { seoSettings } = await getCollections();
    const settings = await seoSettings.findOne({ id: 'global' });

    const ignorePatterns = settings?.ignore404Patterns || [];

    return NextResponse.json({
      success: true,
      data: {
        patterns: ignorePatterns,
      },
    });
  } catch (error) {
    console.error('Error fetching ignore patterns:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/404/ignore-patterns
 * Update ignore patterns
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
    const { patterns } = body;

    if (!Array.isArray(patterns)) {
      return NextResponse.json(
        { error: 'Invalid patterns. Expected an array.' },
        { status: 400 }
      );
    }

    const { seoSettings } = await getCollections();

    // Update or create settings
    await seoSettings.updateOne(
      { id: 'global' },
      {
        $set: {
          ignore404Patterns: patterns,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        patterns,
        message: 'Ignore patterns updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating ignore patterns:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check if URL matches any ignore pattern
 */
export function matchesIgnorePattern(url: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    try {
      // Try as regex
      const regex = new RegExp(pattern);
      if (regex.test(url)) {
        return true;
      }
    } catch {
      // If not valid regex, try as substring match
      if (url.includes(pattern)) {
        return true;
      }
    }
  }
  return false;
}



