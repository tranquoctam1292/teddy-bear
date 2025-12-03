'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { CommentWithRelations, CommentStats } from '@/lib/types/comment';
import { StatusTabs, BulkActions } from '@/components/admin/list';
import {
  CommentThread,
  CommentReplyModal,
  CommentFilterBar,
} from '@/components/admin/comments';

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentWithRelations[]>([]);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [filterPost, setFilterPost] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentWithRelations | null>(
    null
  );
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState<CommentStats>({
    all: 0,
    pending: 0,
    approved: 0,
    spam: 0,
    trash: 0,
  });

  // Posts for filter
  const [posts, setPosts] = useState<Array<{ _id: string; title: string }>>([]);

  useEffect(() => {
    loadComments();
    loadPosts();
  }, [currentStatus, searchQuery, filterPost]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: currentStatus,
        search: searchQuery,
        limit: '100',
      });

      if (filterPost) {
        params.append('postId', filterPost);
      }

      const response = await fetch(`/api/admin/comments?${params}`);
      if (!response.ok) throw new Error('Failed to load comments');

      const data = await response.json();
      setComments(data.comments || []);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error('Error loading comments:', error);
      alert('Không thể tải bình luận!');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts?limit=100');
      if (response.ok) {
        const data = await response.json();
        setPosts(
          data.posts.map((p: any) => ({
            _id: p._id,
            title: p.title,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const toggleSelectComment = (commentId: string) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedComments.size === 0) return;

    const confirmMessages: Record<string, string> = {
      approve: `Duyệt ${selectedComments.size} bình luận?`,
      spam: `Đánh dấu ${selectedComments.size} bình luận là spam?`,
      trash: `Chuyển ${selectedComments.size} bình luận vào thùng rác?`,
      delete: `XÓA VĨNH VIỄN ${selectedComments.size} bình luận?`,
    };

    if (!confirm(confirmMessages[action])) return;

    try {
      const ids = Array.from(selectedComments);

      if (action === 'delete') {
        const response = await fetch(`/api/admin/comments?ids=${ids.join(',')}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Delete failed');
      } else {
        const response = await fetch('/api/admin/comments', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, action }),
        });
        if (!response.ok) throw new Error('Bulk action failed');
      }

      setSelectedComments(new Set());
      loadComments();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) throw new Error('Failed to approve');
      loadComments();
    } catch (error) {
      console.error('Approve error:', error);
      alert('Không thể duyệt bình luận!');
    }
  };

  const handleSpam = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'spam' }),
      });

      if (!response.ok) throw new Error('Failed to mark as spam');
      loadComments();
    } catch (error) {
      console.error('Spam error:', error);
      alert('Không thể đánh dấu spam!');
    }
  };

  const handleTrash = async (id: string) => {
    if (!confirm('Chuyển bình luận vào thùng rác?')) return;

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: currentStatus === 'trash' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:
          currentStatus === 'trash'
            ? undefined
            : JSON.stringify({ status: 'trash' }),
      });

      if (!response.ok) throw new Error('Failed to trash');
      loadComments();
    } catch (error) {
      console.error('Trash error:', error);
      alert('Không thể xóa bình luận!');
    }
  };

  const handleReply = (comment: CommentWithRelations) => {
    setReplyingTo(comment);
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = async (commentId: string, replyData: any) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) throw new Error('Failed to reply');

      setIsReplyModalOpen(false);
      setReplyingTo(null);
      loadComments();
    } catch (error) {
      console.error('Reply error:', error);
      throw error;
    }
  };

  const statusTabs = [
    { id: 'all', value: 'all', label: 'Tất cả', count: stats.all },
    { id: 'pending', value: 'pending', label: 'Đang chờ', count: stats.pending },
    { id: 'approved', value: 'approved', label: 'Đã duyệt', count: stats.approved },
    { id: 'spam', value: 'spam', label: 'Spam', count: stats.spam },
    { id: 'trash', value: 'trash', label: 'Thùng rác', count: stats.trash },
  ];

  const bulkActions = [
    { value: 'approve', label: 'Duyệt' },
    { value: 'spam', label: 'Đánh dấu spam' },
    { value: 'trash', label: 'Chuyển vào thùng rác' },
    ...(currentStatus === 'trash'
      ? [{ value: 'delete', label: 'Xóa vĩnh viễn' }]
      : []),
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-7 w-7" />
              Quản lý Bình luận
            </h1>
            <p className="text-gray-600 mt-1">
              Kiểm duyệt và quản lý bình luận từ khách hàng
            </p>
          </div>
          <Button onClick={loadComments} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {/* Status Tabs */}
        <StatusTabs
          tabs={statusTabs}
          currentStatus={currentStatus}
          baseUrl="/admin/comments"
        />
      </div>

      {/* Toolbar */}
      <div className="mb-4 bg-white rounded-lg border border-gray-200">
        {/* Bulk Actions */}
        {selectedComments.size > 0 && (
          <div className="p-4 border-b border-gray-200">
            <BulkActions
              selectedCount={selectedComments.size}
              actions={bulkActions}
              onAction={handleBulkAction}
            />
          </div>
        )}

        {/* Filters */}
        <CommentFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterPost={filterPost}
          setFilterPost={setFilterPost}
          posts={posts}
        />
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Đang tải bình luận...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có bình luận nào
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterPost
                ? 'Không tìm thấy bình luận phù hợp'
                : 'Bình luận từ khách hàng sẽ hiển thị tại đây'}
            </p>
          </div>
        ) : (
          <CommentThread
            comments={comments}
            selectedIds={selectedComments}
            onApprove={handleApprove}
            onSpam={handleSpam}
            onTrash={handleTrash}
            onReply={handleReply}
            onSelect={toggleSelectComment}
          />
        )}
      </div>

      {/* Reply Modal */}
      <CommentReplyModal
        comment={replyingTo}
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setReplyingTo(null);
        }}
        onSubmit={handleSubmitReply}
      />
    </div>
  );
}
