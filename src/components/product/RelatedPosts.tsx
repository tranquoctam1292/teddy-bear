'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/schemas/post';

interface RelatedPostsProps {
  productName: string;
  category?: string;
  limit?: number;
}

export default function RelatedPosts({
  productName,
  category,
  limit = 3,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        params.append('status', 'published');
        params.append('limit', limit.toString());
        
        // Search by product name in title or content
        if (productName) {
          params.append('search', productName);
        }
        
        // Filter by category if available
        if (category) {
          params.append('category', category);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.posts) {
            setPosts(data.data.posts.slice(0, limit));
          }
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [productName, category, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center text-gray-600">Đang tải bài viết...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200 mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bài viết liên quan
        </h2>
        <p className="text-gray-600">
          Khám phá thêm về sản phẩm và chủ đề liên quan
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <Link href={`/blog/${post.slug}`}>
              {/* Featured Image */}
              {post.featuredImage ? (
                <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <span className="text-6xl opacity-30">🐻</span>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {post.category && (
                  <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium mb-3">
                    {post.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {post.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  {post.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <time dateTime={post.publishedAt.toISOString()}>
                        {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}
                </div>

                {/* Read More */}
                <div className="mt-4 flex items-center text-pink-600 font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Đọc thêm</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}





