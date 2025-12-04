/**
 * Sitemap Submission API Route
 * 
 * POST: Submit sitemap to search engines (Google, Bing)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

/**
 * Submit sitemap to Google Search Console
 */
async function submitToGoogle(accessToken: string, siteUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    // Google Search Console API requires OAuth2 token
    // This is a simplified version - in production, you'd need proper OAuth flow
    
    // For now, we'll use the Indexing API ping endpoint
    // Note: This requires proper setup in Google Search Console
    
    const response = await fetch(`https://www.googleapis.com/indexing/v3/urlNotifications:publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: SITEMAP_URL,
        type: 'URL_UPDATED',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to submit to Google');
    }

    return {
      success: true,
      message: 'Sitemap submitted to Google successfully',
    };
  } catch (error) {
    console.error('Error submitting to Google:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit to Google',
    };
  }
}

/**
 * Submit sitemap to Bing Webmaster Tools
 */
async function submitToBing(apiKey: string, siteUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    // Bing Webmaster Tools API
    const response = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${apiKey}&siteUrl=${encodeURIComponent(siteUrl)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to submit to Bing');
    }

    return {
      success: true,
      message: 'Sitemap submitted to Bing successfully',
    };
  } catch (error) {
    console.error('Error submitting to Bing:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit to Bing',
    };
  }
}

/**
 * POST /api/admin/seo/sitemap/submit
 * Submit sitemap to search engines
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
    const { engines, googleAccessToken, bingApiKey } = body;

    if (!engines || !Array.isArray(engines) || engines.length === 0) {
      return NextResponse.json(
        { error: 'At least one search engine must be specified' },
        { status: 400 }
      );
    }

    const results: Record<string, { success: boolean; message: string }> = {};

    // Submit to Google
    if (engines.includes('google')) {
      if (!googleAccessToken) {
        results.google = {
          success: false,
          message: 'Google access token is required',
        };
      } else {
        results.google = await submitToGoogle(googleAccessToken, SITE_URL);
      }
    }

    // Submit to Bing
    if (engines.includes('bing')) {
      if (!bingApiKey) {
        results.bing = {
          success: false,
          message: 'Bing API key is required',
        };
      } else {
        results.bing = await submitToBing(bingApiKey, SITE_URL);
      }
    }

    // Check if all submissions were successful
    const allSuccess = Object.values(results).every(r => r.success);

    return NextResponse.json({
      success: allSuccess,
      results,
      sitemapUrl: SITEMAP_URL,
    });
  } catch (error) {
    console.error('Error submitting sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to submit sitemap' },
      { status: 500 }
    );
  }
}




