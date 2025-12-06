/**
 * Robots.txt API Route
 * 
 * GET: Get current robots.txt content
 * PUT: Update robots.txt content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { generateRobotsTxt, parseRobotsTxt, validateRobotsTxt, generateDefaultRobotsConfig } from '@/lib/seo/robots-generator';
import type { SEOSettings } from '@/lib/schemas/seo-settings';

/**
 * GET /api/admin/seo/robots
 * Get current robots.txt content
 */
export async function GET(request: NextRequest) {
  try {
    const { seoSettings } = await getCollections();
    
    const settings = await seoSettings.findOne<SEOSettings>({ id: 'global' });
    
    if (!settings) {
      // Return default robots.txt
      const defaultConfig = generateDefaultRobotsConfig();
      const defaultContent = generateRobotsTxt(defaultConfig);
      
      return NextResponse.json({
        content: defaultContent,
        isCustom: false,
        sitemapUrl: defaultConfig.sitemaps?.[0],
      });
    }

    // If custom content exists and robotsTxtCustom is true, use it
    if (settings.robotsTxtCustom && settings.robotsTxtContent) {
      return NextResponse.json({
        content: settings.robotsTxtContent,
        isCustom: true,
        sitemapUrl: settings.robotsTxtSitemapUrl,
      });
    }

    // Otherwise, generate from rules
    const sitemapUrl = settings.robotsTxtSitemapUrl 
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${settings.robotsTxtSitemapUrl}`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`;
    
    const config = generateDefaultRobotsConfig(sitemapUrl);
    const content = generateRobotsTxt(config);

    return NextResponse.json({
      content,
      isCustom: false,
      sitemapUrl,
    });
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch robots.txt' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/robots
 * Update robots.txt content
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, isCustom, sitemapUrl } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate robots.txt content
    const validation = validateRobotsTxt(content);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid robots.txt content',
          validation,
        },
        { status: 400 }
      );
    }

    const { seoSettings } = await getCollections();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Extract sitemap URL from content if not provided
    let finalSitemapUrl = sitemapUrl;
    if (!finalSitemapUrl && content.includes('Sitemap:')) {
      const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch) {
        finalSitemapUrl = sitemapMatch[1].trim();
      }
    }

    // Update SEO settings
    const updateData: Partial<SEOSettings> = {
      robotsTxtContent: content,
      robotsTxtCustom: isCustom !== false, // Default to true if not specified
      robotsTxtSitemapUrl: finalSitemapUrl 
        ? finalSitemapUrl.replace(baseUrl, '') 
        : '/sitemap.xml',
      updatedAt: new Date(),
    };

    await seoSettings.updateOne(
      { id: 'global' },
      {
        $set: updateData,
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      content,
      isCustom: updateData.robotsTxtCustom,
      sitemapUrl: finalSitemapUrl || `${baseUrl}/sitemap.xml`,
      validation,
    });
  } catch (error) {
    console.error('Error updating robots.txt:', error);
    return NextResponse.json(
      { error: 'Failed to update robots.txt' },
      { status: 500 }
    );
  }
}








