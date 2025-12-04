// Admin: Authors List Page
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Author } from '@/lib/types/author';
import RowActions, {
  createEditAction,
  createTrashAction,
  createViewAction,
  createDuplicateAction,
  createDeleteAction,
} from '@/components/admin/RowActions';

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAuthors();
  }, [search, statusFilter, typeFilter, currentPage]);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { type: typeFilter }),
      });

      const res = await fetch(`/api/admin/authors?${params}`);
      const data = await res.json();

      if (res.ok) {
        setAuthors(data.authors);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tác giả này?')) return;

    try {
      const res = await fetch(`/api/admin/authors/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Đã xóa tác giả thành công!');
        fetchAuthors();
      } else {
        alert(data.message || data.error || 'Không thể xóa tác giả');
      }
    } catch (error) {
      alert('Lỗi khi xóa tác giả');
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      staff: 'bg-blue-100 text-blue-800',
      contributor: 'bg-green-100 text-green-800',
      guest: 'bg-gray-100 text-gray-800',
      expert: 'bg-purple-100 text-purple-800',
    };
    return badges[type as keyof typeof badges] || badges.contributor;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ Tác giả</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tác giả cho E-E-A-T SEO compliance
          </p>
        </div>
        <Link
          href="/admin/authors/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Thêm Tác giả
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Tìm theo tên, email, bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm dừng</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Tất cả loại</option>
            <option value="staff">Biên tập viên</option>
            <option value="contributor">Cộng tác viên</option>
            <option value="expert">Chuyên gia</option>
            <option value="guest">Khách mời</option>
          </select>
        </div>
      </div>

      {/* Authors List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      ) : authors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <p className="text-gray-500 text-lg">Chưa có tác giả nào</p>
          <Link
            href="/admin/authors/new"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thêm tác giả đầu tiên
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chức danh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kiểm duyệt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {authors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">
                            {author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <RowActions
                          title={author.name}
                          titleHref={`/admin/authors/${author.id}/edit`}
                          status={author.credentials}
                          actions={[
                            createEditAction(`/admin/authors/${author.id}/edit`),
                            createViewAction(`/author/${author.slug}`),
                            createTrashAction(async () => {
                              await handleDelete(author.id!);
                            }, `tác giả "${author.name}"`),
                          ]}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          /author/{author.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{author.jobTitle || '-'}</div>
                    {author.company && (
                      <div className="text-xs text-gray-500">{author.company}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(author.type)}`}
                    >
                      {author.type === 'staff' && 'Biên tập viên'}
                      {author.type === 'contributor' && 'Cộng tác viên'}
                      {author.type === 'expert' && 'Chuyên gia'}
                      {author.type === 'guest' && 'Khách mời'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium">{author.postCount || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium">
                      {author.reviewedCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        author.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {author.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/author/${author.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800"
                        title="Xem trang tác giả"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/authors/${author.id}/edit`}
                        className="text-gray-600 hover:text-gray-800"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(author.id!)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

