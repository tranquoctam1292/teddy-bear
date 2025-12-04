// Trang tin tức (Góc của Gấu)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

// NOTE: Metadata moved to client component state
// If you need static metadata, convert this back to server component

// Mock blog posts data
const blogPosts = [
  {
    id: '1',
    title: 'Cách chọn gấu bông phù hợp cho từng dịp',
    excerpt: 'Gấu bông không chỉ là món quà mà còn là người bạn đồng hành. Hãy cùng tìm hiểu cách chọn gấu bông phù hợp cho từng dịp đặc biệt...',
    author: 'The Emotional House',
    date: '2024-12-01',
    image: '/images/blog/post-1.jpg',
    category: 'Mẹo vặt',
  },
  {
    id: '2',
    title: 'Lịch sử và ý nghĩa của gấu bông Teddy',
    excerpt: 'Teddy Bear đã trở thành biểu tượng của tình yêu và sự ấm áp. Khám phá câu chuyện đằng sau chú gấu bông nổi tiếng nhất thế giới...',
    author: 'The Emotional House',
    date: '2024-11-25',
    image: '/images/blog/post-2.jpg',
    category: 'Kiến thức',
  },
  {
    id: '3',
    title: 'Cách bảo quản gấu bông luôn như mới',
    excerpt: 'Gấu bông của bạn sẽ luôn mềm mại và đẹp như mới nếu bạn biết cách chăm sóc đúng cách. Hãy cùng học những mẹo bảo quản hiệu quả...',
    author: 'The Emotional House',
    date: '2024-11-18',
    image: '/images/blog/post-3.jpg',
    category: 'Chăm sóc',
  },
  {
    id: '4',
    title: 'Top 5 gấu bông được yêu thích nhất năm 2024',
    excerpt: 'Cùng điểm qua những chú gấu bông đang được khách hàng yêu thích nhất trong năm nay tại The Emotional House...',
    author: 'The Emotional House',
    date: '2024-11-10',
    image: '/images/blog/post-4.jpg',
    category: 'Sản phẩm',
  },
];

const categories = ['Tất cả', 'Mẹo vặt', 'Kiến thức', 'Chăm sóc', 'Sản phẩm'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [authors, setAuthors] = useState<any[]>([]);

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
  const filteredPosts = blogPosts.filter((post) => {
    // Filter by category
    const categoryMatch =
      selectedCategory === 'Tất cả' || post.category === selectedCategory;

    // Filter by author
    // Note: selectedAuthor is author name from dropdown (not slug)
    const authorMatch =
      selectedAuthor === 'all' || post.author === selectedAuthor;

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
            Hiển thị {filteredPosts.length} / {blogPosts.length} bài viết
            {selectedCategory !== 'Tất cả' && ` trong "${selectedCategory}"`}
            {selectedAuthor !== 'all' && ` của "${authors.find(a => a.slug === selectedAuthor)?.name}"`}
          </div>
          
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
              filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <Link href={`/blog/${post.id}`}>
                  {/* Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🐻</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-pink-600 font-medium group-hover:gap-2 transition-all">
                      <span>Đọc thêm</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
              ))
            )}
          </div>
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
