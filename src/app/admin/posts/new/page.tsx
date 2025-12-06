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
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to create post';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const post = result.data?.post || result.post;

      // Only redirect if this is a new post being published
      // If it's just a draft, stay on the page for further editing
      if (data.status === 'published') {
        // Redirect to edit page after publishing new post
        // This allows user to continue editing if needed
        router.push(`/admin/posts/${post.id}/edit`);
      }
      // If draft, stay on the page (no redirect)
      
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

