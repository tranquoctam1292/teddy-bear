'use client';

// Admin Post Create Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import PostEditorV3 from '@/components/admin/PostEditorV3';
import type { PostFormData } from '@/types/post';

export default function AdminPostNewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const handleSubmit = async (data: PostFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const result = await response.json();
      const post = result.post;

      // Return response for PostEditor to extract ID and save analysis
      // Note: SEO analysis will be saved by PostEditor component
      // Redirect after analysis save is initiated (non-blocking)
      router.push('/admin/posts');
      return { post };
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo bài viết');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/posts');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <PostEditorV3
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

