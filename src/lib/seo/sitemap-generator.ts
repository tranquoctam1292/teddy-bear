/**
 * XML Sitemap Generator
 * 
 * Generates XML sitemaps for products, posts, and pages
 * following the sitemap protocol: https://www.sitemaps.org/protocol.html
 */

export interface SitemapUrl {
  loc: string; // Required: URL location
  lastmod?: string; // Optional: Last modification date (ISO 8601)
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number; // Optional: Priority (0.0 to 1.0)
}

export interface SitemapIndexEntry {
  loc: string; // Sitemap URL
  lastmod?: string; // Last modification date
}

/**
 * Generate XML sitemap from URLs
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => {
  const lines: string[] = ['  <url>'];
  lines.push(`    <loc>${escapeXML(url.loc)}</loc>`);
  
  if (url.lastmod) {
    lines.push(`    <lastmod>${escapeXML(url.lastmod)}</lastmod>`);
  }
  
  if (url.changefreq) {
    lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
  }
  
  if (url.priority !== undefined) {
    lines.push(`    <priority>${url.priority.toFixed(1)}</priority>`);
  }
  
  lines.push('  </url>');
  return lines.join('\n');
}).join('\n')}
</urlset>`;

  return xml;
}

/**
 * Generate sitemap index XML
 */
export function generateSitemapIndexXML(sitemaps: SitemapIndexEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => {
  const lines: string[] = ['  <sitemap>'];
  lines.push(`    <loc>${escapeXML(sitemap.loc)}</loc>`);
  
  if (sitemap.lastmod) {
    lines.push(`    <lastmod>${escapeXML(sitemap.lastmod)}</lastmod>`);
  }
  
  lines.push('  </sitemap>');
  return lines.join('\n');
}).join('\n')}
</sitemapindex>`;

  return xml;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format date to ISO 8601 (YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+00:00)
 */
export function formatSitemapDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Calculate priority based on entity type and properties
 */
export function calculatePriority(
  entityType: 'product' | 'post' | 'page',
  isHot?: boolean,
  isActive?: boolean,
  status?: string
): number {
  // Base priorities
  const basePriorities: Record<string, number> = {
    page: 0.8,
    product: 0.7,
    post: 0.6,
  };

  let priority = basePriorities[entityType] || 0.5;

  // Adjust for products
  if (entityType === 'product') {
    if (isHot) priority += 0.1; // Hot products get higher priority
    if (isActive === false) priority = 0.3; // Inactive products get lower priority
  }

  // Adjust for posts
  if (entityType === 'post') {
    if (status === 'published') priority += 0.1; // Published posts get higher priority
    if (status === 'draft') priority = 0.3; // Drafts get lower priority
  }

  // Clamp between 0.0 and 1.0
  return Math.max(0.0, Math.min(1.0, priority));
}

/**
 * Determine change frequency based on entity type and last update
 */
export function calculateChangeFreq(
  entityType: 'product' | 'post' | 'page',
  lastModified?: Date
): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  // Base frequencies
  const baseFreqs: Record<string, 'daily' | 'weekly' | 'monthly'> = {
    page: 'monthly',
    product: 'weekly',
    post: 'weekly',
  };

  const baseFreq = baseFreqs[entityType] || 'monthly';

  // If recently modified (within last 7 days), increase frequency
  if (lastModified) {
    const daysSinceModification = (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceModification < 1) {
      return 'daily';
    } else if (daysSinceModification < 7) {
      return baseFreq === 'monthly' ? 'weekly' : baseFreq;
    }
  }

  return baseFreq;
}



