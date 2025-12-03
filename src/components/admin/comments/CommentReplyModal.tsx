'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/admin/ui/dialog';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { CommentWithRelations } from '@/lib/types/comment';

interface CommentReplyModalProps {
  comment: CommentWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (commentId: string, replyData: any) => Promise<void>;
}

export default function CommentReplyModal({
  comment,
  isOpen,
  onClose,
  onSubmit,
}: CommentReplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    authorName: 'Admin',
    authorEmail: '', // Will be set from session
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment || !formData.content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(comment._id || '', formData);
      setFormData({ ...formData, content: '' });
      onClose();
    } catch (error) {
      console.error('Failed to reply:', error);
      alert('Không thể gửi trả lời!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!comment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trả lời bình luận</DialogTitle>
        </DialogHeader>

        {/* Original Comment */}
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{comment.authorName}</p>
              <p className="text-xs text-gray-500">{comment.authorEmail}</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm">{comment.content}</p>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tên của bạn</Label>
            <Input
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>Email của bạn</Label>
            <Input
              type="email"
              value={formData.authorEmail}
              onChange={(e) =>
                setFormData({ ...formData, authorEmail: e.target.value })
              }
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label>Nội dung trả lời</Label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập nội dung trả lời..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose} variant="outline">
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

