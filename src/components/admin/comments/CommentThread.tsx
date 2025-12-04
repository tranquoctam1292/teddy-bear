'use client';

import { CommentWithRelations } from '@/lib/types/comment';
import CommentItem from './CommentItem';

interface CommentThreadProps {
  comments: CommentWithRelations[];
  selectedIds: Set<string>;
  onApprove: (id: string) => void;
  onSpam: (id: string) => void;
  onTrash: (id: string) => void;
  onReply: (comment: CommentWithRelations) => void;
  onSelect: (id: string) => void;
}

export default function CommentThread({
  comments,
  selectedIds,
  onApprove,
  onSpam,
  onTrash,
  onReply,
  onSelect,
}: CommentThreadProps) {
  // Group comments by parent
  const commentsByParent = new Map<string | undefined, CommentWithRelations[]>();

  comments.forEach((comment) => {
    const parentId = comment.parentId || undefined;
    if (!commentsByParent.has(parentId)) {
      commentsByParent.set(parentId, []);
    }
    commentsByParent.get(parentId)!.push(comment);
  });

  const renderComment = (comment: CommentWithRelations) => {
    const replies = commentsByParent.get(comment._id) || [];

    return (
      <div key={comment._id}>
        <CommentItem
          comment={comment}
          onApprove={onApprove}
          onSpam={onSpam}
          onTrash={onTrash}
          onReply={onReply}
          onSelect={onSelect}
          isSelected={selectedIds.has(comment._id || '')}
        />

        {/* Render replies */}
        {replies.length > 0 && (
          <div className="ml-8 mt-2 space-y-2">
            {replies.map((reply) => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  // Get top-level comments (no parent)
  const topLevelComments = commentsByParent.get(undefined) || [];

  if (topLevelComments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không có bình luận nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelComments.map((comment) => renderComment(comment))}
    </div>
  );
}



