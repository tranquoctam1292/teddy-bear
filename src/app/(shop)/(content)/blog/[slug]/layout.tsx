import type { Metadata } from 'next';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Helper function to get absolute URL for images
function getAbsoluteImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  return `${url.replace(/\/$/, '')}${imagePath}`;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { posts } = await getCollections();
    const post = await posts.findOne({ slug });
    if (!post) return null;

    // Format post data
    const { _id, ...postData } = post as any;
    return {
      ...postData,
      id: postData.id || _id.toString(),
    } as Post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // If post not found, return default metadata
  if (!post) {
    return {
      title: 'Bài viết không tìm thấy - The Emotional House',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại.',
    };
  }

  // Get SEO data from post
  const seo = post.seo;
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt || 
    `${post.title} - Bài viết từ Góc của Gấu, The Emotional House.`;
  const altText = seo?.altText || post.title;

  // Get featured image or default
  const shareImage = post.featuredImage || '/images/logo.png';
  const absoluteImageUrl = getAbsoluteImageUrl(shareImage);

  // Get current URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  const url = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const defaultPostUrl = `${url.replace(/\/$/, '')}/blog/${slug}`;
  
  // Use canonical URL from SEO if available, otherwise use default
  const canonicalUrl = seo?.canonicalUrl || defaultPostUrl;
  const absoluteCanonicalUrl = canonicalUrl.startsWith('http') 
    ? canonicalUrl 
    : `${url.replace(/\/$/, '')}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;

  // Format dates
  const publishedTime = post.publishedAt 
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const modifiedTime = new Date(post.updatedAt).toISOString();

  // Build metadata object
  const metadata: Metadata = {
    title: `${metaTitle} - The Emotional House`,
    description: metaDescription,
    keywords: [
      seo?.focusKeyword || post.title,
      ...(post.keywords || []),
      'gấu bông',
      'teddy bear',
      post.category || '',
    ].filter(Boolean).join(', '),
    
    // Open Graph for Facebook, Zalo, etc.
    openGraph: {
      type: 'article',
      url: defaultPostUrl,
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
      publishedTime,
      modifiedTime,
      authors: [post.author || 'The Emotional House'],
      tags: post.tags || [],
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
  };

  // Add robots meta tag if specified in SEO
  if (seo?.robots) {
    metadata.robots = seo.robots as any;
  }

  return metadata;
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return <>{children}</>;
}








