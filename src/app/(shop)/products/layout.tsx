import type { Metadata } from 'next';

/**
 * Generate SEO metadata for Products Listing Page
 * 
 * This layout provides static metadata for the products listing page.
 * Canonical URL points to /products (without query params) to avoid duplicate content.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Get site URL from environment variables
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  
  // Ensure baseUrl has protocol
  const siteUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  
  // Site name from config or default
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Emotional House';
  
  // Canonical URL - CRITICAL: Always point to /products without query params
  // This prevents duplicate content issues when users filter/sort
  const canonicalUrl = `${cleanSiteUrl}/products`;
  
  // Default OG image (can be customized)
  const ogImage = `${cleanSiteUrl}/images/og-products.jpg`;
  
  // SEO optimized title and description
  const title = 'Sản phẩm - Gấu Bông Cao Cấp | The Emotional House';
  const description =
    'Khám phá bộ sưu tập gấu bông cao cấp tại The Emotional House. Nhiều loại gấu bông: Teddy, Capybara, Panda, Unicorn với nhiều kích thước và màu sắc. Chất liệu mềm mại, an toàn cho trẻ em. Quà tặng ý nghĩa cho mọi dịp đặc biệt.';

  return {
    title,
    description,
    keywords: [
      'gấu bông',
      'teddy bear',
      'gấu bông cao cấp',
      'quà tặng',
      'gấu bông teddy',
      'gấu bông capybara',
      'gấu bông panda',
      'gấu bông unicorn',
      'quà tặng sinh nhật',
      'quà tặng valentine',
      'The Emotional House',
    ].join(', '),

    // Open Graph for Facebook, Zalo, etc.
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Sản phẩm Gấu Bông Cao Cấp - The Emotional House',
        },
      ],
      locale: 'vi_VN',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

    // Canonical URL - CRITICAL for SEO
    // Always point to base /products URL to avoid duplicate content
    alternates: {
      canonical: canonicalUrl,
    },

    // Robots meta tag
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },

    // Metadata base for relative URLs
    metadataBase: new URL(siteUrl),
  };
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


