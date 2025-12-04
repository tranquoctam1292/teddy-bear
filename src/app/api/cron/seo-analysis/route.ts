/**
 * Cron Job: Scheduled SEO Analysis
 * 
 * This endpoint should be called periodically to analyze entities
 * Can be triggered by:
 * - Vercel Cron Jobs
 * - External cron service
 * - Server cron job
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

// Protect this endpoint with a secret token
const CRON_SECRET = process.env.CRON_SECRET || process.env.VERCEL_CRON_SECRET || 'your-secret-token';

/**
 * Analyze entities that need re-analysis
 */
async function performScheduledAnalysis() {
  const { seoAnalysis, products, posts, pages } = await getCollections();
  
  // Get entities that haven't been analyzed recently (older than 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const results = {
    analyzed: 0,
    skipped: 0,
    errors: 0,
  };

  // Analyze products
  try {
    const productsToAnalyze = await products
      .find({
        $or: [
          { analyzedAt: { $lt: sevenDaysAgo } },
          { analyzedAt: { $exists: false } },
        ],
      })
      .limit(50) // Limit per run
      .toArray();

    for (const product of productsToAnalyze) {
      try {
        // In production, this would call the analysis API
        // For now, just mark as analyzed
        await products.updateOne(
          { id: product.id },
          { $set: { analyzedAt: new Date() } }
        );
        results.analyzed++;
      } catch (error) {
        console.error(`Error analyzing product ${product.id}:`, error);
        results.errors++;
      }
    }
  } catch (error) {
    console.error('Error fetching products for analysis:', error);
  }

  // Similar for posts and pages
  // ... (implementation similar to products)

  return results;
}

export async function GET(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token');

    if (token !== CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Perform scheduled analysis
    const results = await performScheduledAnalysis();

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SEO analysis cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support POST
export async function POST(request: NextRequest) {
  return GET(request);
}




