// Admin: Edit Author Page
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthorForm from '@/components/admin/authors/AuthorForm';
import { Author } from '@/lib/types/author';

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuthor();
  }, [params.id]);

  const fetchAuthor = async () => {
    try {
      const res = await fetch(`/api/admin/authors/${params.id}`);
      const data = await res.json();

      if (res.ok) {
        setAuthor(data);
      } else {
        setError(data.error || 'Không tìm thấy tác giả');
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin tác giả');
      console.error('Error fetching author:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/authors/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Cập nhật tác giả thành công!');
        router.push('/admin/authors');
        router.refresh();
      } else {
        setError(result.error || 'Không thể cập nhật tác giả');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Error updating author:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
      router.push('/admin/authors');
    }
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Bạn có chắc muốn xóa tác giả này?\n\nLưu ý: Không thể xóa nếu tác giả đã có bài viết.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/authors/${params.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Đã xóa tác giả thành công!');
        router.push('/admin/authors');
        router.refresh();
      } else {
        alert(`❌ ${data.message || data.error || 'Không thể xóa tác giả'}`);
      }
    } catch (err) {
      alert('❌ Lỗi khi xóa tác giả');
      console.error('Error deleting author:', err);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !author) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium text-lg mb-4">❌ {error}</p>
            <Link
              href="/admin/authors"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin" className="hover:text-blue-600">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/authors" className="hover:text-blue-600">
            Hồ sơ Tác giả
          </Link>
          <span>/</span>
          <span className="text-gray-900">Chỉnh sửa</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa tác giả</h1>
            <p className="text-gray-600 mt-2">
              {author?.name} {author?.credentials && `(${author.credentials})`}
            </p>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa tác giả
          </button>
        </div>
      </div>

      {/* Stats */}
      {author && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Bài viết đã đăng</p>
            <p className="text-2xl font-bold text-blue-600">{author.postCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Bài viết đã kiểm duyệt</p>
            <p className="text-2xl font-bold text-green-600">{author.reviewedCount || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Slug</p>
            <p className="text-sm font-mono text-gray-900">/author/{author.slug}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">
          ⚠️ Lưu ý khi chỉnh sửa:
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>Không nên thay đổi Slug</strong> sau khi đã publish (ảnh hưởng SEO)</li>
          <li>• Short Bio nên giữ từ 50-200 ký tự</li>
          <li>• Nếu tác giả đã có bài viết, không thể xóa (chỉ có thể đặt status = inactive)</li>
        </ul>
      </div>

      {/* Form */}
      {author && (
        <AuthorForm
          initialData={author}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

