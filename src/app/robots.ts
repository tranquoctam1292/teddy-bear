import { MetadataRoute } from 'next';
import { getCollections } from '@/lib/db';
import { generateRobotsTxt, parseRobotsTxt, generateDefaultRobotsConfig } from '@/lib/seo/robots-generator';
import type { SEOSettings } from '@/lib/schemas/seo-settings';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const { seoSettings } = await getCollections();
    const settings = await seoSettings.findOne<SEOSettings>({ id: 'global' });

    // If custom content exists and robotsTxtCustom is true, parse it
    if (settings?.robotsTxtCustom && settings.robotsTxtContent) {
      const config = parseRobotsTxt(settings.robotsTxtContent);
      
      // Convert to Next.js MetadataRoute.Robots format
      const rules: MetadataRoute.Robots['rules'] = [];
      
      for (const rule of config.rules) {
        const nextRule: MetadataRoute.Robots['rules'][0] = {
          userAgent: rule.userAgent === '*' ? '*' : rule.userAgent,
        };
        
        if (rule.allow && rule.allow.length > 0) {
          nextRule.allow = rule.allow.length === 1 ? rule.allow[0] : rule.allow;
        }
        
        if (rule.disallow && rule.disallow.length > 0) {
          nextRule.disallow = rule.disallow.length === 1 ? rule.disallow[0] : rule.disallow;
        }
        
        if (rule.crawlDelay !== undefined) {
          nextRule.crawlDelay = rule.crawlDelay;
        }
        
        rules.push(nextRule);
      }

      return {
        rules,
        sitemap: config.sitemaps?.[0] || `${baseUrl}/sitemap.xml`,
      };
    }

    // Otherwise, use default configuration
    const defaultConfig = generateDefaultRobotsConfig(
      settings?.robotsTxtSitemapUrl
        ? `${baseUrl}${settings.robotsTxtSitemapUrl}`
        : `${baseUrl}/sitemap.xml`
    );

    const rules: MetadataRoute.Robots['rules'] = defaultConfig.rules.map(rule => ({
      userAgent: rule.userAgent === '*' ? '*' : rule.userAgent,
      allow: rule.allow && rule.allow.length > 0 
        ? (rule.allow.length === 1 ? rule.allow[0] : rule.allow)
        : undefined,
      disallow: rule.disallow && rule.disallow.length > 0
        ? (rule.disallow.length === 1 ? rule.disallow[0] : rule.disallow)
        : undefined,
      crawlDelay: rule.crawlDelay,
    }));

    return {
      rules,
      sitemap: defaultConfig.sitemaps?.[0] || `${baseUrl}/sitemap.xml`,
    };
  } catch (error) {
    console.error('Error loading robots.txt from database:', error);
    
    // Fallback to default configuration
    const defaultConfig = generateDefaultRobotsConfig();
    const rules: MetadataRoute.Robots['rules'] = defaultConfig.rules.map(rule => ({
      userAgent: rule.userAgent === '*' ? '*' : rule.userAgent,
      allow: rule.allow && rule.allow.length > 0 
        ? (rule.allow.length === 1 ? rule.allow[0] : rule.allow)
        : undefined,
      disallow: rule.disallow && rule.disallow.length > 0
        ? (rule.disallow.length === 1 ? rule.disallow[0] : rule.disallow)
        : undefined,
      crawlDelay: rule.crawlDelay,
    }));

    return {
      rules,
      sitemap: defaultConfig.sitemaps?.[0] || `${baseUrl}/sitemap.xml`,
    };
  }
}

