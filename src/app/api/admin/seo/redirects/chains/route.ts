// Redirect Chains Detection API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { detectRedirectChains } from '@/lib/seo/redirect-matcher';

/**
 * GET /api/admin/seo/redirects/chains
 * Detect redirect chains
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

    const { redirectRules } = await getCollections();

    // Get all redirect rules
    const allRedirects = await redirectRules.find({}).toArray();

    // Detect chains
    const chains = detectRedirectChains(allRedirects as any);

    return NextResponse.json({
      success: true,
      data: {
        chains,
        totalChains: chains.length,
      },
    });
  } catch (error) {
    console.error('Error detecting redirect chains:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}








