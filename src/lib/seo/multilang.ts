/**
 * Multi-language SEO Support
 * Handles SEO for multiple languages
 */

export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

export interface MultilangSEO {
  language: SupportedLanguage;
  title: string;
  description: string;
  content?: string;
  keywords?: string[];
  hreflang?: string; // ISO 639-1 code
}

export interface MultilangEntity {
  id: string;
  entityType: 'product' | 'post' | 'page';
  defaultLanguage: SupportedLanguage;
  translations: Record<SupportedLanguage, MultilangSEO>;
  canonicalUrl?: string;
}

/**
 * Generate hreflang tags
 */
export function generateHreflangTags(
  entity: MultilangEntity,
  baseUrl: string
): Array<{ lang: string; url: string }> {
  const tags: Array<{ lang: string; url: string }> = [];

  Object.entries(entity.translations).forEach(([lang, seo]) => {
    const hreflang = seo.hreflang || lang;
    const url = `${baseUrl}/${lang}/${entity.entityType}/${entity.id}`;
    tags.push({ lang: hreflang, url });
  });

  // Add x-default
  tags.push({
    lang: 'x-default',
    url: `${baseUrl}/${entity.defaultLanguage}/${entity.entityType}/${entity.id}`,
  });

  return tags;
}

/**
 * Get SEO data for specific language
 */
export function getSEOForLanguage(
  entity: MultilangEntity,
  language: SupportedLanguage
): MultilangSEO | null {
  return entity.translations[language] || null;
}

/**
 * Validate multilang SEO
 */
export function validateMultilangSEO(entity: MultilangEntity): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check default language exists
  if (!entity.translations[entity.defaultLanguage]) {
    errors.push(`Default language ${entity.defaultLanguage} translation missing`);
  }

  // Validate each translation
  Object.entries(entity.translations).forEach(([lang, seo]) => {
    if (!seo.title || seo.title.length === 0) {
      errors.push(`Missing title for language ${lang}`);
    }
    if (!seo.description || seo.description.length === 0) {
      errors.push(`Missing description for language ${lang}`);
    }
    if (seo.title && seo.title.length > 60) {
      errors.push(`Title too long for language ${lang} (${seo.title.length} > 60)`);
    }
    if (seo.description && seo.description.length > 160) {
      errors.push(`Description too long for language ${lang} (${seo.description.length} > 160)`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate language-specific sitemap entries
 */
export function generateMultilangSitemapEntries(
  entity: MultilangEntity,
  baseUrl: string
): Array<{
  loc: string;
  lang: string;
  lastmod?: string;
}> {
  const entries: Array<{ loc: string; lang: string; lastmod?: string }> = [];

  Object.entries(entity.translations).forEach(([lang]) => {
    entries.push({
      loc: `${baseUrl}/${lang}/${entity.entityType}/${entity.id}`,
      lang,
    });
  });

  return entries;
}








