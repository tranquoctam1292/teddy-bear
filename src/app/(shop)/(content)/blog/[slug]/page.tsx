'use client';

// Blog Post Detail Page
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { generateBlogPostingSchema } from '@/lib/seo/schemas';
import { generateArticleWithAuthorSchema } from '@/lib/seo/author-schema';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import RelatedProducts from '@/components/blog/RelatedProducts';
import AuthorBox from '@/components/blog/AuthorBox';
import ReviewerBox from '@/components/blog/ReviewerBox';
import { BlogPostRenderer } from '@/components/blog/blog-post-renderer';
import { SocialShareButtons } from '@/components/blog/social-share-buttons';
import { ReadingTimeBadge } from '@/components/blog/reading-time-badge';
import { CommentSection } from '@/components/blog/comments/comment-section';
import { BlogSidebar } from '@/components/blog/blog-sidebar';
import { TOCFloatingButton } from '@/components/blog/toc-floating-button';
import { ProductLinkCard } from '@/components/blog/product-link-card';
import { generateTableOfContents, injectHeadingIds } from '@/lib/utils/toc-generator';
import type { Post } from '@/lib/schemas/post';
import type { Author } from '@/lib/types/author';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [reviewer, setReviewer] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<Post['tableOfContents']>([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        
        // Check if preview mode (for draft posts)
        const isPreview = searchParams.get('preview') === 'true';
        const postId = searchParams.get('id'); // Post ID from query param (for preview)
        
        // Try to fetch from API
        let apiUrl = `/api/posts?slug=${slug}`; // Default: public API (only published)
        
        if (isPreview) {
          // For preview, try admin API first (requires auth)
          // Use post ID if available (more reliable), otherwise use slug
          if (postId) {
            apiUrl = `/api/admin/posts/${postId}`;
          } else {
            apiUrl = `/api/admin/posts?slug=${slug}`;
          }
        }
          
        // Add cache busting for published posts to ensure fresh data
        const cacheBuster = isPreview ? '' : `&_t=${Date.now()}`;
        const response = await fetch(`${apiUrl}${cacheBuster}`, {
          cache: 'no-store', // Disable caching to get fresh data
        });
        
        // If admin API fails (401), fallback to public API
        if (!response.ok && response.status === 401 && isPreview) {
          // Not authenticated, show message
          setError('Bạn cần đăng nhập để xem trước bài viết nháp');
          setLoading(false);
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          // Handle different response formats
          let postData;
          if (isPreview && postId) {
            // Admin API with ID returns { post: {...} }
            postData = data.post || data.data?.post;
          } else {
            // Admin API with slug or public API returns { data: { post: {...} } } or { post: {...} }
            postData = data.data?.post || data.post;
          }
          
          if (postData) {
            // Generate Table of Contents from content if not present
            let toc: Post['tableOfContents'] = postData.tableOfContents || [];
            
            // If no TOC exists but content exists, generate it on client side
            if (toc.length === 0 && postData.content && typeof window !== 'undefined') {
              try {
                toc = generateTableOfContents(postData.content);
                // Inject heading IDs into content for smooth scrolling
                postData.content = injectHeadingIds(postData.content);
              } catch (err) {
                console.error('Error generating TOC:', err);
              }
            }
            
            setPost(postData);
            setTocItems(toc);
            
            // Fetch author data if exists
            if (postData.authorInfo?.authorId) {
              try {
                const authorRes = await fetch(`/api/admin/authors/${postData.authorInfo.authorId}`);
                if (authorRes.ok) {
                  const authorData = await authorRes.json();
                  setAuthor(authorData);
                }
              } catch (err) {
                console.error('Error fetching author:', err);
              }
            }
            
            // Fetch reviewer data if exists
            if (postData.authorInfo?.reviewerId) {
              try {
                const reviewerRes = await fetch(`/api/admin/authors/${postData.authorInfo.reviewerId}`);
                if (reviewerRes.ok) {
                  const reviewerData = await reviewerRes.json();
                  setReviewer(reviewerData);
                }
              } catch (err) {
                console.error('Error fetching reviewer:', err);
              }
            }
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
  }, [slug, searchParams]);

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
  
  // Use new author schema if author exists, otherwise fallback to old schema
  const blogPostingSchema = author 
    ? generateArticleWithAuthorSchema(
        {
          title: post.title,
          slug,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          category: post.category,
        },
        author,
        reviewer || undefined
      )
    : generateBlogPostingSchema(
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
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <JsonLd data={blogPostingSchema} />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
          className="mb-8"
        />
      </div>

      {/* Article - Two-column layout with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
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

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight max-w-none w-full">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            {/* Author Info (E-E-A-T) */}
            {author ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  Đăng bởi:{' '}
                  <Link 
                    href={`/author/${author.slug}`}
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    {author.name}
                  </Link>
                  {author.credentials && (
                    <span className="text-gray-500 ml-1">({author.credentials})</span>
                  )}
                </span>
              </div>
            ) : (post.authorInfo?.guestAuthor ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  Đăng bởi: {post.authorInfo.guestAuthor.name}
                  {post.authorInfo.guestAuthor.credentials && (
                    <span className="text-gray-500 ml-1">
                      ({post.authorInfo.guestAuthor.credentials})
                    </span>
                  )}
                </span>
              </div>
            ) : post.author ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            ) : null)}
            
            {/* Reviewer (YMYL) */}
            {reviewer && (
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  Kiểm duyệt bởi: {reviewer.name} {reviewer.credentials && `(${reviewer.credentials})`}
                </span>
              </div>
            )}
            
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={typeof post.publishedAt === 'string' ? post.publishedAt : new Date(post.publishedAt).toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            )}
            {post.readingTime && (
              <ReadingTimeBadge readingTime={post.readingTime} variant="compact" />
            )}
          </div>
        </header>

        {/* Featured Image - Enhanced display with Next.js Image */}
        {post.featuredImage && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              unoptimized={post.featuredImage.includes('blob.vercel-storage.com')}
            />
          </div>
        )}

        {/* Blog Post Renderer (Template-based) */}
        <BlogPostRenderer post={post} />

        {/* Tags & Social Share - Combined section */}
        <div className="mt-16 pt-10 border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex-1">
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full text-sm font-medium transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Buttons */}
            <div className="flex-shrink-0">
              <SocialShareButtons
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
                variant="default"
              />
            </div>
          </div>
        </div>

        {/* Author Box (E-E-A-T SEO) */}
        {(author || post.authorInfo?.guestAuthor) && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <AuthorBox
              author={author || post.authorInfo!.guestAuthor!}
              variant="detailed"
              showBio={true}
              showSocial={true}
              showCredentials={true}
            />
          </div>
        )}

        {/* Reviewer Box (YMYL Compliance) */}
        {reviewer && (
          <div className="mt-8">
            <ReviewerBox
              reviewer={reviewer}
              reviewDate={post.authorInfo?.lastReviewedDate}
            />
          </div>
        )}
          </article>

          {/* Sidebar - Sticky on desktop */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
              {/* Sidebar Products */}
              {post.linkedProducts?.filter((lp) => lp.position === 'sidebar').length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm liên quan</h3>
                  {post.linkedProducts
                    ?.filter((lp) => lp.position === 'sidebar')
                    .map((linkedProduct, index) => (
                      <ProductLinkCard
                        key={index}
                        productId={linkedProduct.productId}
                        displayType={linkedProduct.displayType}
                        customMessage={linkedProduct.customMessage}
                      />
                    ))}
                </div>
              )}

              {/* Recent Posts Sidebar */}
              <BlogSidebar excludeSlug={slug} />
            </div>
          </aside>
        </div>
      </div>

      {/* Related Products - Enhanced section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <RelatedProducts
          tags={post.tags || []}
          category={post.category}
        />
      </div>

      {/* Comment Section */}
      {post._id && (
        <CommentSection
          postId={
            typeof post._id === 'string' ? post._id : post._id.toString()
          }
        />
      )}

      {/* Floating TOC Button */}
      {tocItems && tocItems.length > 0 && (
        <TOCFloatingButton items={tocItems} />
      )}
    </div>
  );
}

