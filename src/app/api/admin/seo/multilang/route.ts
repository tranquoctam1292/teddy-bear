// Multi-language SEO API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generateHreflangTags,
  validateMultilangSEO,
  generateMultilangSitemapEntries,
  type MultilangEntity,
} from '@/lib/seo/multilang';

/**
 * POST /api/admin/seo/multilang/hreflang
 * Generate hreflang tags for entity
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
    const { entity, baseUrl } = body;

    if (!entity || !baseUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: entity, baseUrl' },
        { status: 400 }
      );
    }

    // Validate
    const validation = validateMultilangSEO(entity as MultilangEntity);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid multilang SEO data',
        errors: validation.errors,
      }, { status: 400 });
    }

    // Generate hreflang tags
    const hreflangTags = generateHreflangTags(entity as MultilangEntity, baseUrl);
    const sitemapEntries = generateMultilangSitemapEntries(entity as MultilangEntity, baseUrl);

    return NextResponse.json({
      success: true,
      data: {
        hreflangTags,
        sitemapEntries,
        validation,
      },
    });
  } catch (error) {
    console.error('Error generating multilang SEO:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}





