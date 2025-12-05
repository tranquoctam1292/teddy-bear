// Blog Posts Section Component - Phase 4: Content Sections Redesign
// Server Component displaying latest blog articles
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/homepage/container';
import { SectionHeader } from '@/components/homepage/section-header';
import type { BlogPost } from '@/lib/mock-data';
import { BLOG_POSTS } from '@/lib/mock-data';
import { formatDateShort } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface BlogPostsProps {
  heading?: string;
  subheading?: string;
  limit?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <p className="text-sm text-gray-500 mb-2">
          {formatDateShort(post.date)}
        </p>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
          {post.excerpt}
        </p>

        {/* Author */}
        <p className="text-xs text-gray-500">Bởi {post.author}</p>
      </div>
    </Link>
  );
}

export function BlogPosts({
  heading = 'Bài viết mới nhất',
  subheading = 'Khám phá những bài viết hữu ích về gấu bông và đồ chơi',
  limit = 3,
  showViewAll = true,
  viewAllLink = '/blog',
}: BlogPostsProps) {
  const posts = BLOG_POSTS.slice(0, limit);

  return (
    <Container variant="standard" padding="desktop">
      {/* Section Header */}
      <SectionHeader
        heading={heading}
        subheading={subheading}
        alignment="center"
        showViewAll={showViewAll}
        viewAllLink={viewAllLink}
        viewAllText="Xem tất cả bài viết"
      />

      {/* Blog Posts Grid */}
      <div
        className={cn(
          'grid gap-6',
          'grid-cols-1', // Mobile: 1 column
          'md:grid-cols-2', // Tablet: 2 columns
          'lg:grid-cols-3' // Desktop: 3 columns
        )}
      >
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </Container>
  );
}

