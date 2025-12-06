// Blog Posts Section Component
// NOTE: This is a Server Component (async function) that uses database
// It should only be imported in Server Components, not Client Components
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BlogPostsContent } from '@/lib/types/homepage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface BlogPostsProps {
  content: BlogPostsContent;
  layout: any;
  isPreview?: boolean;
}

export async function BlogPosts({ content, layout, isPreview }: BlogPostsProps) {
  // Fetch posts based on selection method
  const posts = await getPosts(content);

  if (posts.length === 0) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">
          No blog posts found. Please configure post selection.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="mb-8 text-center">
          {content.heading && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {content.heading}
            </h2>
          )}
          {content.subheading && (
            <p className="mt-2 text-lg text-muted-foreground">
              {content.subheading}
            </p>
          )}
        </div>
      )}

      {/* Posts Grid */}
      <div
        className={
          content.layout === 'list'
            ? 'space-y-6'
            : 'grid gap-6'
        }
        style={
          content.layout !== 'list'
            ? {
                gridTemplateColumns: `repeat(${content.columns || 3}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {posts.map((post: any) => (
          <Link key={post._id} href={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
              {/* Featured Image */}
              {content.showImage && post.featuredImage && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={post.featuredImage.includes('blob.vercel-storage.com')}
                  />
                </div>
              )}

              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-primary">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Excerpt */}
                {content.showExcerpt && post.excerpt && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {content.showAuthor && post.author && (
                    <span>{post.author}</span>
                  )}
                  {content.showDate && post.publishedAt && (
                    <span>
                      {formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* View More Button */}
      {content.viewMoreButton && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={content.viewMoreButton.link}>
              {content.viewMoreButton.text}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

async function getPosts(content: BlogPostsContent) {
  // Lazy-load database helper to avoid bundling issues
  const { getSectionPosts } = await import('@/lib/db-sections');
  return getSectionPosts({
    postSelection: content.postSelection,
    category: content.category,
    postIds: content.postIds,
    limit: content.limit || 6,
  });
}

