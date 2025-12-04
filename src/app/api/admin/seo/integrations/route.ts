// Third-party API Integrations Status API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getGAClient } from '@/lib/seo/google-analytics';
import { getGSCClient } from '@/lib/seo/gsc-integration';

/**
 * GET /api/admin/seo/integrations
 * Get status of third-party integrations
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

    const integrations = {
      googleAnalytics: {
        enabled: !!process.env.GA_PROPERTY_ID && !!process.env.GA_ACCESS_TOKEN,
        propertyId: process.env.GA_PROPERTY_ID || null,
        hasAccessToken: !!process.env.GA_ACCESS_TOKEN,
        note: 'Set GA_PROPERTY_ID and GA_ACCESS_TOKEN to enable',
      },
      googleSearchConsole: {
        enabled: !!process.env.GSC_SITE_URL && !!process.env.GSC_ACCESS_TOKEN,
        siteUrl: process.env.GSC_SITE_URL || null,
        hasAccessToken: !!process.env.GSC_ACCESS_TOKEN,
        note: 'Set GSC_SITE_URL and GSC_ACCESS_TOKEN to enable',
      },
      openai: {
        enabled: !!process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        note: 'Set OPENAI_API_KEY to enable AI features',
      },
      claude: {
        enabled: !!process.env.ANTHROPIC_API_KEY,
        model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
        note: 'Set ANTHROPIC_API_KEY to enable Claude AI',
      },
      gemini: {
        enabled: !!process.env.GEMINI_API_KEY,
        model: process.env.GEMINI_MODEL || 'gemini-pro',
        note: 'Set GEMINI_API_KEY to enable Gemini AI',
      },
      resend: {
        enabled: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL || null,
        note: 'Set RESEND_API_KEY to enable email reports',
      },
    };

    // Test connections if enabled
    const connectionTests: Record<string, { connected: boolean; error?: string }> = {};

    if (integrations.googleAnalytics.enabled) {
      try {
        const gaClient = getGAClient();
        connectionTests.googleAnalytics = {
          connected: gaClient !== null,
        };
      } catch (error) {
        connectionTests.googleAnalytics = {
          connected: false,
          error: error instanceof Error ? error.message : 'Connection failed',
        };
      }
    }

    if (integrations.googleSearchConsole.enabled) {
      try {
        const gscClient = getGSCClient();
        connectionTests.googleSearchConsole = {
          connected: gscClient !== null,
        };
      } catch (error) {
        connectionTests.googleSearchConsole = {
          connected: false,
          error: error instanceof Error ? error.message : 'Connection failed',
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        integrations,
        connectionTests,
        summary: {
          total: Object.keys(integrations).length,
          enabled: Object.values(integrations).filter(i => i.enabled).length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching integrations status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



