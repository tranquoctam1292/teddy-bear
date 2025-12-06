// Trang tin tức (Góc của Gấu)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import type { Post } from '@/lib/schemas/post';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tất cả']);

  // Fetch published posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        // Add cache busting to ensure fresh data
        const res = await fetch(`/api/posts?status=published&limit=100&_t=${Date.now()}`, {
          cache: 'no-store', // Disable caching
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.posts) {
            const fetchedPosts = data.data.posts;
            setPosts(fetchedPosts);
            
            // Extract unique categories from posts
            const uniqueCategories = ['Tất cả', ...new Set(fetchedPosts.map((p: Post) => p.category).filter(Boolean))];
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Fetch featured authors
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const res = await fetch('/api/authors?featured=true&limit=20');
        if (res.ok) {
          const data = await res.json();
          setAuthors(data.authors || []);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    }
    fetchAuthors();
  }, []);

  // Filter posts based on selected category and author
  const filteredPosts = posts.filter((post) => {
    // Filter by category
    const categoryMatch =
      selectedCategory === 'Tất cả' || post.category === selectedCategory;

    // Filter by author (check authorInfo.authorId or guestAuthor.name)
    let authorMatch = true;
    if (selectedAuthor !== 'all') {
      const author = authors.find(a => a.name === selectedAuthor);
      if (author) {
        authorMatch = post.authorInfo?.authorId === author.id;
      } else {
        // Check guest author
        authorMatch = post.authorInfo?.guestAuthor?.name === selectedAuthor;
      }
    }

    return categoryMatch && authorMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Góc của Gấu 🐻
          </h1>
          <p className="text-xl text-pink-100">
            Những câu chuyện, mẹo vặt và tin tức về gấu bông
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Danh mục:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      category === selectedCategory
                        ? 'bg-pink-600 text-white'
                        : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Author Filter (E-E-A-T) */}
          {authors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tác giả:</h3>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="all">Tất cả tác giả</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                    {author.credentials && ` (${author.credentials})`}
                    {author.postCount && ` - ${author.postCount} bài`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Results count */}
          <div className="mb-6 text-sm text-gray-600">
            {loading ? (
              <span>Đang tải...</span>
            ) : (
              <>
                Hiển thị {filteredPosts.length} / {posts.length} bài viết
                {selectedCategory !== 'Tất cả' && ` trong "${selectedCategory}"`}
                {selectedAuthor !== 'all' && ` của "${selectedAuthor}"`}
              </>
            )}
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Tất cả');
                      setSelectedAuthor('all');
                    }}
                    className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const authorName = post.authorInfo?.guestAuthor?.name || 
                    authors.find(a => a.id === post.authorInfo?.authorId)?.name || 
                    'The Emotional House';
                  const publishedDate = post.publishedAt 
                    ? new Date(post.publishedAt).toLocaleDateString('vi-VN')
                    : post.createdAt 
                    ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                    : '';

                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        {/* Image */}
                        <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden">
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized={post.featuredImage.includes('blob.vercel-storage.com')}
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl opacity-30">🐻</span>
                            </div>
                          )}
                          {post.category && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                                {post.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.excerpt || 'Không có mô tả'}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{authorName}</span>
                            </div>
                            {publishedDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{publishedDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Read More */}
                          <div className="flex items-center text-pink-600 font-medium group-hover:gap-2 transition-all">
                            <span>Đọc thêm</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đăng ký nhận tin
          </h2>
          <p className="text-gray-600 mb-8">
            Nhận những bài viết mới nhất và ưu đãi đặc biệt từ Góc của Gấu
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
