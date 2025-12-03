'use client';

// Enhanced Posts List Page - WordPress Style
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/lib/schemas/post';
import { Button } from '@/components/admin/ui/button';
import { StatusTabs, BulkActions, FilterBar, Pagination } from '@/components/admin/list';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';

export default function AdminPostsPageV2() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  
  // Filters
  const statusFilter = searchParams.get('status') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    mine: 0,
    published: 0,
    draft: 0,
    trash: 0,
  });

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, currentPage, searchQuery, dateFilter, categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (dateFilter) params.append('date', dateFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update counts after fetching posts
  useEffect(() => {
    setStatusCounts({
      all: pagination.total,
      mine: 0, // TODO: filter by user
      published: posts.filter(p => p.status === 'published').length,
      draft: posts.filter(p => p.status === 'draft').length,
      trash: posts.filter(p => p.status === 'archived').length,
    });
  }, [posts, pagination.total]);

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.size === 0) return;

    const postIds = Array.from(selectedPosts);
    
    try {
      if (action === 'trash') {
        // Move to trash
        await Promise.all(
          postIds.map(id =>
            fetch(`/api/admin/posts/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'archived' }), // Use archived as trash
            })
          )
        );
        alert(`Đã chuyển ${postIds.length} bài viết vào thùng rác`);
      } else if (action === 'delete') {
        if (!confirm(`Xóa vĩnh viễn ${postIds.length} bài viết?`)) return;
        await Promise.all(
          postIds.map(id =>
            fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
          )
        );
        alert(`Đã xóa ${postIds.length} bài viết`);
      } else if (action === 'restore') {
        await Promise.all(
          postIds.map(id =>
            fetch(`/api/admin/posts/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'draft' }),
            })
          )
        );
        alert(`Đã khôi phục ${postIds.length} bài viết`);
      }

      setSelectedPosts(new Set());
      fetchPosts();
      fetchStatusCounts();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(p => p.id)));
    }
  };

  const toggleSelect = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {pagination.total} bài viết</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Thêm bài viết mới
          </Button>
        </Link>
      </div>

      {/* Status Tabs */}
      <StatusTabs
        tabs={[
          { label: 'Tất cả', value: 'all', count: statusCounts.all },
          { label: 'Của tôi', value: 'mine', count: statusCounts.mine },
          { label: 'Đã xuất bản', value: 'published', count: statusCounts.published },
          { label: 'Bản nháp', value: 'draft', count: statusCounts.draft },
          { label: 'Thùng rác', value: 'trash', count: statusCounts.trash },
        ]}
        currentStatus={statusFilter}
        baseUrl="/admin/posts"
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col gap-4">
          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedPosts.size}
            onAction={handleBulkAction}
          />

          {/* Filter Bar */}
          <FilterBar
            selectedDate={dateFilter}
            onDateChange={setDateFilter}
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categoryOptions={[
              { value: '', label: 'Tất cả danh mục' },
              { value: 'news', label: 'Tin tức' },
              { value: 'guide', label: 'Hướng dẫn' },
              { value: 'tips', label: 'Mẹo hay' },
            ]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={fetchPosts}
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={posts.length > 0 && selectedPosts.size === posts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-gray-600">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-gray-600">Không có bài viết nào</p>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {post.title}
                      </Link>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{post.slug}</TableCell>
                  <TableCell>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
                      {post.category || 'Uncategorized'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        post.status === 'published'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : post.status === 'draft'
                          ? 'bg-gray-100 text-gray-700 border border-gray-300'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {post.status === 'published'
                        ? 'Đã xuất bản'
                        : post.status === 'draft'
                        ? 'Bản nháp'
                        : 'Lưu trữ'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {post.views || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {post.status === 'archived' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBulkAction('restore')}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

