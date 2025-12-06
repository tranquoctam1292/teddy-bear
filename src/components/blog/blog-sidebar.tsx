'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import type { Post } from '@/lib/schemas/post';

interface BlogSidebarProps {
  excludeSlug?: string; // Exclude current post from the list
  className?: string;
}

export function BlogSidebar({ excludeSlug, className }: BlogSidebarProps) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const response = await fetch(`/api/posts?status=published&limit=5&_t=${Date.now()}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          // API returns: { success: true, data: { posts: [...], pagination: {...} } }
          let posts = data.data?.posts || data.posts || [];

          // Exclude current post if provided
          if (excludeSlug) {
            posts = posts.filter((post: Post) => post.slug !== excludeSlug);
          }

          // Limit to 5 posts
          setRecentPosts(posts.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPosts();
  }, [excludeSlug]);

  return (
    <aside className={className}>
      {/* BÀI VIẾT MỚI Header */}
      <div className="bg-pink-600 rounded-t-xl px-4 py-3 mb-0">
        <h2 className="text-white font-bold text-base uppercase tracking-wide">
          BÀI VIẾT MỚI
        </h2>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-b-xl border-x border-b border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            Chưa có bài viết nào
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentPosts.map((post, index) => (
              <li key={post._id?.toString() || post.id || index}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block p-4 hover:bg-pink-50 transition-colors group"
                >
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-pink-600 line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.publishedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <time dateTime={typeof post.publishedAt === 'string' ? post.publishedAt : new Date(post.publishedAt).toISOString()}>
                        {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

