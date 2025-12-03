'use client';

/**
 * JsonLd Component
 * Injects JSON-LD structured data for SEO (Schema.org)
 */
interface JsonLdProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


