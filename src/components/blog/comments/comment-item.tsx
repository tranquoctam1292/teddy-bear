'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Reply } from 'lucide-react';
import { CommentForm } from './comment-form';
import { cn } from '@/lib/utils';
import type { Comment } from '@/lib/schemas/comment';

interface CommentItemProps {
  comment: Comment & {
    id: string;
    replies?: CommentItemProps['comment'][];
  };
  depth?: number;
  maxDepth?: number;
}

/**
 * Generate avatar URL from email using Gravatar
 */
function getAvatarUrl(email: string, name: string): string {
  // Use Gravatar or generate placeholder
  const hash = email
    .toLowerCase()
    .trim()
    .split('')
    .reduce((acc, char) => {
      const charCode = char.charCodeAt(0);
      return ((acc << 5) - acc + charCode) | 0;
    }, 0);

  // Use placeholder service with initials
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials
  )}&background=random&color=fff&size=128`;
}

export function CommentItem({
  comment,
  depth = 0,
  maxDepth = 3,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  const canReply = depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className={cn(
        'space-y-4',
        depth > 0 && 'ml-8 md:ml-12 border-l-2 border-gray-200 pl-4 md:pl-6'
      )}
    >
      {/* Comment Content */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={getAvatarUrl(comment.authorEmail, comment.authorName)}
            alt={comment.authorName}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Comment Body */}
        <div className="flex-1 space-y-2">
          {/* Author & Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">
              {comment.authorName}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: vi,
              })}
            </span>
            {comment.status === 'pending' && (
              <Badge variant="outline" className="text-xs">
                Đang chờ duyệt
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="text-gray-700 whitespace-pre-wrap">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="text-sm text-gray-600 hover:text-pink-600"
              >
                <Reply className="w-4 h-4 mr-1" />
                Phản hồi
              </Button>
            )}

            {hasReplies && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare className="w-4 h-4" />
                <span>{comment.replies?.length} phản hồi</span>
              </div>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && canReply && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <CommentForm
                postId={comment.postId}
                parentId={comment.id}
                onSuccess={() => {
                  setIsReplying(false);
                  // Refresh comments (handled by parent)
                }}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && (
        <div className="space-y-4 mt-4">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

