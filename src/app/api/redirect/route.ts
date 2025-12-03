// Public Redirect Handler API
// This endpoint handles redirects based on redirect rules
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { findMatchingRedirect, resolveDestination } from '@/lib/seo/redirect-matcher';
import type { RedirectRule } from '@/lib/schemas/redirect-rule';

/**
 * GET /api/redirect
 * Handle redirect based on redirect rules
 * Usage: /api/redirect?url=/old-path
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      );
    }

    const { redirectRules } = await getCollections();

    // Get all active redirect rules
    const allRedirects = await redirectRules
      .find({ status: 'active' })
      .sort({ priority: -1, createdAt: -1 })
      .toArray();

    // Find matching redirect
    const matchingRedirect = await findMatchingRedirect(url, allRedirects as RedirectRule[]);

    if (!matchingRedirect) {
      return NextResponse.json(
        { error: 'No redirect rule found' },
        { status: 404 }
      );
    }

    // Resolve destination URL
    const destination = resolveDestination(url, matchingRedirect.destination);

    // Update hit count
    await redirectRules.updateOne(
      { id: matchingRedirect.id },
      {
        $inc: { hitCount: 1 },
        $set: { lastHit: new Date() },
      }
    );

    // Return redirect response
    const statusCode = parseInt(matchingRedirect.type);
    return NextResponse.redirect(destination, statusCode);
  } catch (error) {
    console.error('Error handling redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


