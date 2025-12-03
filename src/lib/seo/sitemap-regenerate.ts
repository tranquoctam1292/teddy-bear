/**
 * Sitemap Regeneration Utility
 * 
 * Functions to trigger sitemap regeneration and update timestamps
 */

import { getCollections } from '@/lib/db';
import type { SEOSettings } from '@/lib/schemas/seo-settings';

/**
 * Update sitemap last generated timestamp
 */
export async function updateSitemapTimestamp(): Promise<void> {
  try {
    const { seoSettings } = await getCollections();
    
    await seoSettings.updateOne(
      { id: 'global' },
      {
        $set: {
          sitemapLastGenerated: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error updating sitemap timestamp:', error);
    throw error;
  }
}

/**
 * Get sitemap last generated timestamp
 */
export async function getSitemapTimestamp(): Promise<Date | null> {
  try {
    const { seoSettings } = await getCollections();
    const settings = await seoSettings.findOne<SEOSettings>({ id: 'global' });
    
    return settings?.sitemapLastGenerated || null;
  } catch (error) {
    console.error('Error getting sitemap timestamp:', error);
    return null;
  }
}

/**
 * Trigger sitemap regeneration
 * This function can be called after content updates
 */
export async function triggerSitemapRegeneration(): Promise<void> {
  try {
    // Update timestamp to indicate sitemap needs regeneration
    await updateSitemapTimestamp();
    
    // In a production environment, you might want to:
    // 1. Invalidate CDN cache
    // 2. Trigger a background job to regenerate
    // 3. Ping search engines about the update
    
    console.log('Sitemap regeneration triggered');
  } catch (error) {
    console.error('Error triggering sitemap regeneration:', error);
    throw error;
  }
}


