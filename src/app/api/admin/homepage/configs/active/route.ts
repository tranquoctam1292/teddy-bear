// Admin API: Get Active Homepage Configuration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

/**
 * GET /api/admin/homepage/configs/active
 * Get currently published configuration
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    const activeConfig = await homepageConfigs.findOne({ status: 'published' });

    if (!activeConfig) {
      return NextResponse.json({
        config: null,
        message: 'No active configuration',
      });
    }

    return NextResponse.json({
      config: { ...activeConfig, _id: activeConfig._id.toString() },
    });
  } catch (error) {
    console.error('Error fetching active homepage config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active configuration' },
      { status: 500 }
    );
  }
}

