import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/data/products';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Helper function to get absolute URL for images
function getAbsoluteImageUrl(imagePath: string): string {
  // If already absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Get base URL from environment or use default
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';

  // Ensure baseUrl has protocol
  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

  // Remove trailing slash and add image path
  return `${url.replace(/\/$/, '')}${imagePath}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // If product not found, return default metadata
  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy - The Emotional House',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
    };
  }

  // Get SEO data from product
  const seo = (product as any).seo || {};
  const metaTitle = (product as any).metaTitle || `${product.name} - The Emotional House`;
  const metaDescription = (product as any).metaDescription || product.description || 
    `${product.name} - Gấu bông cao cấp từ The Emotional House. ${product.tags.length > 0 ? `Phù hợp cho: ${product.tags.join(', ')}.` : ''} Nhiều kích thước, chất liệu mềm mại, an toàn cho trẻ em.`;
  const altText = seo?.altText || product.name;

  // Get the best image for sharing (first variant image or first product image)
  const shareImage =
    product.variants[0]?.image || product.images[0] || '/images/logo.png';
  const absoluteImageUrl = getAbsoluteImageUrl(shareImage);

  // Get current URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const defaultProductUrl = `${url.replace(/\/$/, '')}/products/${slug}`;
  
  // Use canonical URL from SEO if available, otherwise use default
  const canonicalUrl = seo?.canonicalUrl || defaultProductUrl;
  const absoluteCanonicalUrl = canonicalUrl.startsWith('http') 
    ? canonicalUrl 
    : `${url.replace(/\/$/, '')}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;

  // Build metadata object
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      seo?.focusKeyword || product.name,
      'gấu bông',
      'teddy bear',
      product.category,
      ...product.tags,
    ].filter(Boolean).join(', '),
    
    // Open Graph for Facebook, Zalo, etc.
    openGraph: {
      type: 'website',
      url: defaultProductUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: 'The Emotional House',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: altText,
        },
      ],
      locale: 'vi_VN',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [absoluteImageUrl],
    },

    // Canonical URL
    alternates: {
      canonical: absoluteCanonicalUrl,
    },

    // Product-specific metadata
    other: {
      'product:price:amount': product.basePrice.toString(),
      'product:price:currency': 'VND',
      'product:availability': 'in stock',
      'product:category': product.category,
    },
  };

  // Add robots meta tag if specified in SEO
  if (seo?.robots) {
    metadata.robots = seo.robots as any;
  }

  return metadata;
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}

