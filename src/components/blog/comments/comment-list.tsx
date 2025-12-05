'use client';

import { useEffect, useState } from 'react';
import { CommentItem } from './comment-item';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/schemas/comment';

interface CommentWithReplies extends Comment {
  id: string;
  replies?: CommentWithReplies[];
}

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/post/${postId}`);

      if (!response.ok) {
        throw new Error('Không thể tải bình luận');
      }

      const result = await response.json();

      if (result.success && result.data?.comments) {
        setComments(result.data.comments);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bình luận'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
        <span className="ml-2 text-gray-600">Đang tải bình luận...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="outline" onClick={fetchComments}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Bình luận ({comments.length})
        </h3>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

