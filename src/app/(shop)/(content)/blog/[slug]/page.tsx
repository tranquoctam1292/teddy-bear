'use client';

// Blog Post Detail Page
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generateBlogPostingSchema } from '@/lib/seo/schemas';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import RelatedProducts from '@/components/blog/RelatedProducts';
import type { Post } from '@/lib/schemas/post';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        // Try to fetch from API
        const response = await fetch(`/api/posts?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.post) {
            setPost(data.data.post);
          } else {
            setError('Post not found');
          }
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'Bài viết bạn đang tìm kiếm không tồn tại.'}
          </p>
          <Link
            href="/blog"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  // Generate JSON-LD schemas
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://emotionalhouse.vn');
  const blogPostingSchema = generateBlogPostingSchema(
    {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      author: post.author,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    },
    baseUrl,
    slug
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* JSON-LD Structured Data */}
      <JsonLd data={blogPostingSchema} />

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
          className="mb-8"
        />
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>

          {post.category && (
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
            <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-pink prose-headings:text-gray-900 prose-a:text-pink-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Products */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedProducts
          tags={post.tags || []}
          category={post.category}
        />
      </div>
    </div>
  );
}

