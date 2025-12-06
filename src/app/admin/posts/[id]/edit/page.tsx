'use client';

// Admin Post Edit Page
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostEditor } from '@/components/admin/PostEditor.lazy';
import type { Post } from '@/lib/schemas/post';
import type { PostFormData } from '@/types/post';

export default function AdminPostEditPage() {
  const { status } = useSession();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || errorData.error || 'Failed to update post';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const updatedPost = result.data?.post || result.post;

      // Refresh post data to show updated content
      if (updatedPost) {
        setPost(updatedPost as Post);
      }

      // Show success message but DON'T redirect
      // User can continue editing
      // Note: SEO analysis will be saved by PostEditor component

      return { post: updatedPost };
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật bài viết');
      throw error; // Re-throw to let PostEditor handle it
    } finally {
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
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
              <p className="text-sm text-gray-600 mt-1">{post.title}</p>
            </div>
            <div className="text-sm text-gray-500">Modern CMS Editor</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
