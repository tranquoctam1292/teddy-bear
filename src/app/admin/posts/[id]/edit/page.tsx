'use client';

// Admin Post Edit Page
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PostEditor from '@/components/admin/PostEditor';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';

export default function AdminPostEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && postId) {
      fetchPost();
    }
  }, [status, postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');

      const data = await response.json();
      setPost(data.post);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Không tìm thấy bài viết');
      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PostFormData) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      router.push('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật bài viết');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/posts');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !post) {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
          <p className="text-sm text-gray-600 mt-1">{post.title}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostEditor
          post={post}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </main>
    </>
  );
}

