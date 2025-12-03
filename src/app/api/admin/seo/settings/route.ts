// SEO Settings API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { SEOSettings } from '@/lib/schemas/seo-settings';
import { DEFAULT_SEO_SETTINGS } from '@/lib/schemas/seo-settings';

/**
 * GET /api/admin/seo/settings
 * Get global SEO settings
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

    // Get global settings (id='global')
    let settings = await seoSettings.findOne({ id: 'global' });

    // If not found, return defaults
    if (!settings) {
      settings = {
        id: 'global',
        siteName: 'The Emotional House',
        siteDescription: 'Cửa hàng gấu bông với tình yêu và cảm xúc',
        siteKeywords: ['gấu bông', 'teddy bear'],
        ...DEFAULT_SEO_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }

    const { _id, ...settingsData } = settings as any;
    return NextResponse.json({
      success: true,
      data: { settings: settingsData },
    });
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/settings
 * Update global SEO settings
 */
export async function PUT(request: NextRequest) {
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
    const { seoSettings } = await getCollections();

    // Check if settings exist
    const existingSettings = await seoSettings.findOne({ id: 'global' });

    const updateData: Partial<SEOSettings> = {
      id: 'global',
      updatedAt: new Date(),
    };

    // Update all provided fields
    if (body.siteName !== undefined) updateData.siteName = body.siteName;
    if (body.siteDescription !== undefined) updateData.siteDescription = body.siteDescription;
    if (body.siteKeywords !== undefined) updateData.siteKeywords = body.siteKeywords;
    if (body.siteLanguage !== undefined) updateData.siteLanguage = body.siteLanguage;
    if (body.siteLocale !== undefined) updateData.siteLocale = body.siteLocale;

    // Sitemap settings
    if (body.sitemapEnabled !== undefined) updateData.sitemapEnabled = body.sitemapEnabled;
    if (body.sitemapUrl !== undefined) updateData.sitemapUrl = body.sitemapUrl;
    if (body.sitemapIncludeProducts !== undefined) updateData.sitemapIncludeProducts = body.sitemapIncludeProducts;
    if (body.sitemapIncludePosts !== undefined) updateData.sitemapIncludePosts = body.sitemapIncludePosts;
    if (body.sitemapIncludePages !== undefined) updateData.sitemapIncludePages = body.sitemapIncludePages;
    if (body.sitemapChangeFrequency !== undefined) updateData.sitemapChangeFrequency = body.sitemapChangeFrequency;
    if (body.sitemapPriority !== undefined) updateData.sitemapPriority = body.sitemapPriority;

    // Robots.txt settings
    if (body.robotsTxtContent !== undefined) updateData.robotsTxtContent = body.robotsTxtContent;
    if (body.robotsTxtCustom !== undefined) updateData.robotsTxtCustom = body.robotsTxtCustom;
    if (body.robotsTxtSitemapUrl !== undefined) updateData.robotsTxtSitemapUrl = body.robotsTxtSitemapUrl;

    // Schema settings
    if (body.organizationSchema !== undefined) updateData.organizationSchema = body.organizationSchema;
    if (body.websiteSchema !== undefined) updateData.websiteSchema = body.websiteSchema;
    if (body.enableBreadcrumbSchema !== undefined) updateData.enableBreadcrumbSchema = body.enableBreadcrumbSchema;
    if (body.enableProductSchema !== undefined) updateData.enableProductSchema = body.enableProductSchema;
    if (body.enablePostSchema !== undefined) updateData.enablePostSchema = body.enablePostSchema;
    if (body.enableLocalBusinessSchema !== undefined) updateData.enableLocalBusinessSchema = body.enableLocalBusinessSchema;

    // Social media settings
    if (body.facebookAppId !== undefined) updateData.facebookAppId = body.facebookAppId;
    if (body.facebookPageUrl !== undefined) updateData.facebookPageUrl = body.facebookPageUrl;
    if (body.twitterHandle !== undefined) updateData.twitterHandle = body.twitterHandle;
    if (body.instagramHandle !== undefined) updateData.instagramHandle = body.instagramHandle;
    if (body.linkedinUrl !== undefined) updateData.linkedinUrl = body.linkedinUrl;
    if (body.youtubeUrl !== undefined) updateData.youtubeUrl = body.youtubeUrl;
    if (body.socialProfiles !== undefined) updateData.socialProfiles = body.socialProfiles;

    // Analytics settings
    if (body.googleAnalyticsId !== undefined) updateData.googleAnalyticsId = body.googleAnalyticsId;
    if (body.googleSearchConsole !== undefined) updateData.googleSearchConsole = body.googleSearchConsole;
    if (body.googleTagManager !== undefined) updateData.googleTagManager = body.googleTagManager;
    if (body.facebookPixelId !== undefined) updateData.facebookPixelId = body.facebookPixelId;
    if (body.microsoftClarityId !== undefined) updateData.microsoftClarityId = body.microsoftClarityId;

    // Redirect settings
    if (body.redirectsEnabled !== undefined) updateData.redirectsEnabled = body.redirectsEnabled;
    if (body.autoRedirect404 !== undefined) updateData.autoRedirect404 = body.autoRedirect404;
    if (body.redirectDefaultType !== undefined) updateData.redirectDefaultType = body.redirectDefaultType;

    // Advanced settings
    if (body.breadcrumbsEnabled !== undefined) updateData.breadcrumbsEnabled = body.breadcrumbsEnabled;
    if (body.internalLinkingEnabled !== undefined) updateData.internalLinkingEnabled = body.internalLinkingEnabled;
    if (body.imageSeoEnabled !== undefined) updateData.imageSeoEnabled = body.imageSeoEnabled;
    if (body.autoGenerateMetaDescriptions !== undefined) updateData.autoGenerateMetaDescriptions = body.autoGenerateMetaDescriptions;
    if (body.autoGenerateAltText !== undefined) updateData.autoGenerateAltText = body.autoGenerateAltText;

    // Performance settings
    if (body.enableLazyLoading !== undefined) updateData.enableLazyLoading = body.enableLazyLoading;
    if (body.enableImageOptimization !== undefined) updateData.enableImageOptimization = body.enableImageOptimization;
    if (body.enableMinification !== undefined) updateData.enableMinification = body.enableMinification;

    // Security settings
    if (body.enableHttps !== undefined) updateData.enableHttps = body.enableHttps;
    if (body.enableSecurityHeaders !== undefined) updateData.enableSecurityHeaders = body.enableSecurityHeaders;

    if (existingSettings) {
      // Update existing
      await seoSettings.updateOne(
        { id: 'global' },
        { $set: updateData }
      );
    } else {
      // Create new with defaults
      const newSettings: SEOSettings = {
        id: 'global',
        siteName: body.siteName || 'The Emotional House',
        siteDescription: body.siteDescription || 'Cửa hàng gấu bông với tình yêu và cảm xúc',
        siteKeywords: body.siteKeywords || ['gấu bông', 'teddy bear'],
        ...DEFAULT_SEO_SETTINGS,
        ...updateData,
        createdAt: new Date(),
      } as SEOSettings;
      await seoSettings.insertOne(newSettings as any);
    }

    // Fetch updated settings
    const updatedSettings = await seoSettings.findOne({ id: 'global' });
    const { _id, ...settingsData } = updatedSettings as any;

    return NextResponse.json({
      success: true,
      data: {
        settings: settingsData,
        message: 'SEO settings updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


