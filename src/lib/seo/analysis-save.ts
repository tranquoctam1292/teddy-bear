/**
 * SEO Analysis Save Utility
 * 
 * Helper functions to save SEO analysis results to the database
 * when products or posts are saved.
 */

import type { SEOAnalysisResult } from './analysis-client';

/**
 * Convert client-side analysis result to API format
 */
export function formatAnalysisForAPI(
  analysis: SEOAnalysisResult,
  entityType: 'product' | 'post' | 'page',
  entityId: string,
  entitySlug: string
) {
  return {
    entityType,
    entityId,
    entitySlug,
    seoScore: analysis.seoScore,
    readabilityScore: analysis.readabilityScore,
    overallScore: analysis.overallScore,
    issues: analysis.issues,
    focusKeyword: analysis.focusKeyword,
    contentAnalysis: analysis.contentAnalysis,
    hasSchema: false, // Would need to check actual page
    schemaTypes: [],
    ogImage: undefined, // Would need to extract from page
    ogTitle: analysis.titleAnalysis.length > 0 ? undefined : undefined,
    ogDescription: analysis.metaDescriptionAnalysis.length > 0 ? undefined : undefined,
    twitterCard: undefined,
    hasCanonical: !!analysis.urlAnalysis,
    canonicalUrl: undefined, // Would need to extract from page
    robotsMeta: undefined, // Would need to extract from page
    hasSitemap: true, // Assume sitemap exists
    mobileFriendly: true, // Assume responsive
    pageSpeed: undefined, // Would need actual page speed test
  };
}

/**
 * Save SEO analysis to database
 * 
 * @param analysis - SEO analysis result from client-side analysis
 * @param entityType - Type of entity (product, post, page)
 * @param entityId - ID of the entity (can be 'new' if not yet created)
 * @param entitySlug - URL slug of the entity
 * @param actualEntityId - Optional: actual entity ID after save (if entity was just created)
 */
export async function saveAnalysisToDatabase(
  analysis: SEOAnalysisResult,
  entityType: 'product' | 'post' | 'page',
  entityId: string,
  entitySlug: string,
  actualEntityId?: string
): Promise<void> {
  try {
    // Use actual entity ID if provided (for newly created entities)
    const finalEntityId = actualEntityId || entityId;
    
    // Skip if entity ID is still 'new' (entity not yet created)
    if (finalEntityId === 'new') {
      return;
    }
    
    const formatted = formatAnalysisForAPI(analysis, entityType, finalEntityId, entitySlug);
    
    const response = await fetch('/api/admin/seo/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formatted),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving SEO analysis:', error);
      // Don't throw - analysis save failure shouldn't block product/post save
    }
  } catch (error) {
    console.error('Error saving SEO analysis:', error);
    // Don't throw - analysis save failure shouldn't block product/post save
  }
}

