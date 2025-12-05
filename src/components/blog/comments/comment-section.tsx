'use client';

import { useState } from 'react';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentSuccess = () => {
    // Trigger refresh of comment list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">Bình luận</h2>
        </div>

        {/* Comment Form */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Viết bình luận
          </h3>
          <CommentForm postId={postId} onSuccess={handleCommentSuccess} />
        </div>

        {/* Comment List */}
        <div key={refreshKey}>
          <CommentList postId={postId} />
        </div>
      </div>
    </section>
  );
}

