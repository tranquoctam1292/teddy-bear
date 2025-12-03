'use client';

// Test Page for PostEditorV3
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditorV3 from '@/components/admin/PostEditorV3';
import type { PostFormData } from '@/types/post';

export default function NewPostV3Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PostFormData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      alert('Bài viết đã được tạo thành công!');
      router.push('/admin/posts');
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy? Các thay đổi chưa lưu sẽ bị mất.')) {
      router.push('/admin/posts');
    }
  };

  return (
    <PostEditorV3
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

