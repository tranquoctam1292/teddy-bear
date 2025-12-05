'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/lib/schemas/comment';

interface CommentWithRelations extends Comment {
  id: string;
  post?: {
    _id: string;
    title: string;
    slug: string;
  };
  spamScore?: number;
  spamReasons?: string[];
}

interface CommentModerationTableProps {
  comments: CommentWithRelations[];
  onRefresh?: () => void;
}

export function CommentModerationTable({
  comments,
  onRefresh,
}: CommentModerationTableProps) {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const filteredComments =
    currentTab === 'all'
      ? comments
      : comments.filter((c) => c.status === currentTab);

  const handleAction = async (
    commentId: string,
    action: 'approve' | 'spam' | 'delete',
    comment: CommentWithRelations
  ) => {
    setProcessingIds((prev) => new Set(prev).add(commentId));

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status:
            action === 'approve'
              ? 'approved'
              : action === 'spam'
                ? 'spam'
                : 'trash',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Có lỗi xảy ra');
      }

      toast({
        title: 'Thành công',
        description: `Đã ${action === 'approve' ? 'duyệt' : action === 'spam' ? 'đánh dấu spam' : 'xóa'} bình luận`,
        variant: 'success',
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Lỗi',
        description:
          error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi cập nhật bình luận',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500">
            Đã duyệt
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Chờ duyệt
          </Badge>
        );
      case 'spam':
      case 'auto-spam':
        return (
          <Badge variant="destructive" className="bg-red-500">
            Spam
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Chờ duyệt ({comments.filter((c) => c.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã duyệt ({comments.filter((c) => c.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="spam">
            Spam (
            {comments.filter((c) => c.status === 'spam' || c.status === 'auto-spam').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-4">
          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Bài viết</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Spam Score</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500">Không có bình luận nào</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComments.map((comment) => {
                    const isProcessing = processingIds.has(comment.id);

                    return (
                      <TableRow key={comment.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded"
                            disabled={isProcessing}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {comment.authorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {comment.authorEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="text-sm">
                              {truncateContent(comment.content, 150)}
                            </p>
                            {comment.spamReasons &&
                              comment.spamReasons.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-red-600 font-semibold">
                                    Lý do spam:
                                  </p>
                                  <ul className="text-xs text-red-500 list-disc list-inside">
                                    {comment.spamReasons.slice(0, 2).map(
                                      (reason, idx) => (
                                        <li key={idx}>{reason}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {comment.post ? (
                            <Link
                              href={`/blog/${comment.post.slug}`}
                              className="text-sm text-pink-600 hover:underline"
                              target="_blank"
                            >
                              {truncateContent(comment.post.title, 50)}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">
                              N/A
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(comment.status)}</TableCell>
                        <TableCell>
                          {comment.spamScore !== undefined ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-semibold ${
                                  comment.spamScore >= 50
                                    ? 'text-red-600'
                                    : comment.spamScore >= 20
                                      ? 'text-yellow-600'
                                      : 'text-green-600'
                                }`}
                              >
                                {comment.spamScore}
                              </span>
                              {comment.spamScore >= 50 && (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(
                              new Date(comment.createdAt),
                              {
                                addSuffix: true,
                                locale: vi,
                              }
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {comment.status !== 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleAction(comment.id, 'approve', comment)
                                }
                                disabled={isProcessing}
                                className="h-8"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Duyệt
                              </Button>
                            )}
                            {comment.status !== 'spam' &&
                              comment.status !== 'auto-spam' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleAction(comment.id, 'spam', comment)
                                  }
                                  disabled={isProcessing}
                                  className="h-8 text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Spam
                                </Button>
                              )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleAction(comment.id, 'delete', comment)
                              }
                              disabled={isProcessing}
                              className="h-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

