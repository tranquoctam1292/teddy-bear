// Public API: Get Active Homepage Configuration
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

/**
 * GET /api/homepage
 * Get the currently active homepage configuration (public endpoint)
 * Returns only published config with enabled sections
 */
export async function GET(request: NextRequest) {
  try {
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    // Find published config
    const config = await homepageConfigs.findOne(
      { status: 'published' },
      {
        sort: { publishedAt: -1 }, // Get most recently published
      }
    );

    // If no config found, return null
    if (!config) {
      return NextResponse.json(
        {
          config: null,
          message: 'No active homepage configuration',
        },
        { status: 200 }
      );
    }

    // Filter to only enabled sections
    const enabledSections = (config.sections || [])
      .filter((section: any) => section.enabled)
      .sort((a: any, b: any) => a.order - b.order);

    // Clean up for public consumption
    const publicConfig = {
      _id: config._id.toString(),
      name: config.name,
      slug: config.slug,
      sections: enabledSections,
      seo: config.seo,
      schemaMarkup: config.schemaMarkup,
      settings: config.settings,
      publishedAt: config.publishedAt,
    };

    return NextResponse.json(
      {
        config: publicConfig,
        success: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching active homepage config:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch homepage configuration',
        config: null,
      },
      { status: 500 }
    );
  }
}

/**
 * Helper: Get active homepage config (for server-side use)
 */
export async function getActiveHomepageConfig() {
  try {
    const { db } = await getCollections();
    const homepageConfigs = db.collection('homepage_configs');

    const config = await homepageConfigs.findOne(
      { status: 'published' },
      { sort: { publishedAt: -1 } }
    );

    if (!config) return null;

    // Convert ObjectId to string
    return {
      ...config,
      _id: config._id.toString(),
      sections: (config.sections || [])
        .filter((section: any) => section.enabled)
        .sort((a: any, b: any) => a.order - b.order),
    };
  } catch (error) {
    console.error('Error getting active homepage config:', error);
    return null;
  }
}
