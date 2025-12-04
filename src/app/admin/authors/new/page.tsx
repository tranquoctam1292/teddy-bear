// Admin: Create New Author Page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthorForm from '@/components/admin/authors/AuthorForm';

export default function NewAuthorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Tạo tác giả thành công!');
        router.push('/admin/authors');
        router.refresh();
      } else {
        setError(result.error || 'Không thể tạo tác giả');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error('Error creating author:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
      router.push('/admin/authors');
    }
  };

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
          <span className="text-gray-900">Thêm mới</span>
        </div>

        <h1 className="text-3xl font-bold">Thêm tác giả mới</h1>
        <p className="text-gray-600 mt-2">
          Tạo hồ sơ tác giả với đầy đủ thông tin E-E-A-T cho SEO
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">❌ {error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          💡 Lưu ý khi tạo tác giả:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Name</strong> và <strong>Short Bio</strong> là bắt buộc</li>
          <li>• Short Bio nên từ 50-200 ký tự (tối ưu cho SEO)</li>
          <li>• Slug sẽ tự động tạo từ tên, nhưng bạn có thể chỉnh sửa</li>
          <li>• LinkedIn là quan trọng nhất cho E-E-A-T (Experience, Expertise, Authority, Trust)</li>
          <li>• Đối với <strong>YMYL content</strong> (Y tế, Tài chính), nên có: Credentials + Education + Certifications</li>
        </ul>
      </div>

      {/* Form */}
      <AuthorForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

