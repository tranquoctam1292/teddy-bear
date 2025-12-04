// Quick Edit Modal - WordPress style inline edit
'use client';

import { useState, useEffect } from 'react';
import type { Post } from '@/lib/schemas/post';

interface QuickEditModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (updates: Partial<Post>) => Promise<void>;
}

export default function QuickEditModal({ post, onClose, onSave }: QuickEditModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setStatus(post.status);
      setCategory(post.category || '');
    }
  }, [post]);

  if (!post) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title,
        slug,
        status,
        category,
      });
      onClose();
    } catch (error) {
      console.error('Quick edit error:', error);
      alert('Lỗi khi lưu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Sửa nhanh</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Đã xuất bản</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn danh mục</option>
              <option value="news">Tin tức</option>
              <option value="guide">Hướng dẫn</option>
              <option value="tips">Mẹo hay</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSaving ? 'Đang lưu...' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}

