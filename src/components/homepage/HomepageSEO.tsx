// Homepage SEO Component
import { Metadata } from 'next';
import { HomepageConfig } from '@/lib/types/homepage';

/**
 * Generate SEO metadata for homepage
 */
export function generateHomepageMetadata(config: HomepageConfig): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Teddy Shop';

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords?.join(', '),

    // Open Graph
    openGraph: {
      title: config.seo.ogTitle || config.seo.title,
      description: config.seo.ogDescription || config.seo.description,
      images: config.seo.ogImage
        ? [
            {
              url: config.seo.ogImage,
              width: 1200,
              height: 630,
              alt: config.seo.ogTitle || config.seo.title,
            },
          ]
        : [],
      type: 'website',
      siteName: siteName,
      url: siteUrl,
    },

    // Twitter
    twitter: {
      card: config.seo.twitterCard || 'summary_large_image',
      title: config.seo.ogTitle || config.seo.title,
      description: config.seo.ogDescription || config.seo.description,
      images: config.seo.ogImage ? [config.seo.ogImage] : [],
    },

    // Canonical
    alternates: {
      canonical: config.seo.canonicalUrl || siteUrl,
    },

    // Robots
    robots: {
      index: !config.seo.noindex,
      follow: !config.seo.nofollow,
      googleBot: {
        index: !config.seo.noindex,
        follow: !config.seo.nofollow,
      },
    },

    // Other
    metadataBase: new URL(siteUrl),
  };
}

/**
 * Generate Schema.org JSON-LD for homepage
 */
export function generateHomepageSchema(config: HomepageConfig) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Teddy Shop';

  // Base WebPage schema
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': config.schemaMarkup?.['@type'] || 'WebPage',
    name: config.seo.title,
    description: config.seo.description,
    url: siteUrl,
    inLanguage: 'vi-VN',
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
  };

  // Organization
  schema.publisher = {
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 250,
      height: 60,
    },
    sameAs: [
      // Add social media URLs
      'https://facebook.com/teddyshop',
      'https://instagram.com/teddyshop',
    ],
  };

  // Breadcrumb
  schema.breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
    ],
  };

  // Check if has featured products section
  const productsSection = config.sections?.find(
    (s) => s.type === 'featured-products' && s.enabled
  );

  if (productsSection) {
    schema.mainEntity = {
      '@type': 'ItemList',
      name: 'Featured Products',
      description: 'Our featured products collection',
      numberOfItems: productsSection.content.limit || 8,
    };
  }

  return schema;
}

/**
 * Render Schema.org script tag
 */
export function SchemaScript({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

