'use client';

import { useState } from 'react';
import {
  Check,
  X,
  Trash2,
  MessageSquare,
  Mail,
  Calendar,
  ExternalLink,
  MoreVertical,
  Edit,
  Flag,
} from 'lucide-react';
import { CommentWithRelations } from '@/lib/types/comment';
import { Button } from '@/components/admin/ui/button';

interface CommentItemProps {
  comment: CommentWithRelations;
  onApprove: (id: string) => void;
  onSpam: (id: string) => void;
  onTrash: (id: string) => void;
  onReply: (comment: CommentWithRelations) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function CommentItem({
  comment,
  onApprove,
  onSpam,
  onTrash,
  onReply,
  onSelect,
  isSelected,
}: CommentItemProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-700' },
      approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-700' },
      spam: { label: 'Spam', className: 'bg-red-100 text-red-700' },
      trash: { label: 'Thùng rác', className: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        isSelected ? 'ring-2 ring-blue-600' : 'border-gray-200'
      } ${comment.parentId ? 'ml-12 border-l-4 border-l-blue-200' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(comment._id || '')}
            className="mt-1 rounded"
          />

          <div className="flex-1">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{comment.authorName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>{comment.authorEmail}</span>
                  <span>•</span>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pl-13">
              <p className="text-gray-700 mb-2">{comment.content}</p>

              {/* Related Post/Product */}
              {(comment.post || comment.product) && (
                <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded">
                  <ExternalLink className="h-3 w-3" />
                  <span>Trên:</span>
                  {comment.post && (
                    <a
                      href={`/blog/${comment.post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {comment.post.title}
                    </a>
                  )}
                  {comment.product && (
                    <a
                      href={`/products/${comment.product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {comment.product.name}
                    </a>
                  )}
                </div>
              )}

              {/* Reply indicator */}
              {comment.replyCount && comment.replyCount > 0 && (
                <div className="inline-flex items-center gap-1 text-sm text-gray-500 mt-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{comment.replyCount} câu trả lời</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusBadge(comment.status)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pl-13">
        {comment.status !== 'approved' && (
          <Button
            onClick={() => onApprove(comment._id || '')}
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Duyệt
          </Button>
        )}

        <Button
          onClick={() => onReply(comment)}
          size="sm"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Trả lời
        </Button>

        {comment.status !== 'spam' && (
          <Button
            onClick={() => onSpam(comment._id || '')}
            size="sm"
            variant="outline"
            className="text-orange-600 hover:text-orange-700"
          >
            <Flag className="h-4 w-4 mr-1" />
            Spam
          </Button>
        )}

        <Button
          onClick={() => onTrash(comment._id || '')}
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Xóa
        </Button>
      </div>
    </div>
  );
}

