// Public Comments API - GET Comments by Post ID
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Comment } from '@/lib/schemas/comment';

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}

/**
 * GET /api/comments/post/[postId]
 * 
 * Get approved comments for a post (nested structure)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { comments, posts } = await getCollections();

    // Verify post exists
    let post = await posts.findOne({ id: postId });
    if (!post) {
      try {
        post = await posts.findOne({ _id: new ObjectId(postId) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Bài viết không tồn tại',
          },
        },
        { status: 404 }
      );
    }

    // Get all approved comments for this post (no parent = top-level)
    const allComments = await comments
      .find({
        postId,
        status: 'approved',
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Format comments
    const formattedComments = allComments.map((comment: any) => {
      const { _id, ...commentData } = comment;
      return {
        ...commentData,
        id: _id.toString(),
        createdAt: comment.createdAt,
      } as Comment;
    });

    // Build nested structure (tree)
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // First pass: create map of all comments
    formattedComments.forEach((comment) => {
      commentMap.set(comment.id!, {
        ...comment,
        replies: [],
      });
    });

    // Second pass: build tree structure
    formattedComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id!)!;

      if (comment.parentId) {
        // This is a reply
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          if (!parent.replies) {
            parent.replies = [];
          }
          parent.replies.push(commentWithReplies);
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    });

    // Sort replies by createdAt (oldest first)
    const sortReplies = (comments: CommentWithReplies[]) => {
      comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          sortReplies(comment.replies);
        }
      });
    };

    sortReplies(rootComments);

    // Sort root comments by createdAt (newest first)
    rootComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: {
        comments: rootComments,
        total: formattedComments.length,
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Lỗi server khi lấy bình luận',
        },
      },
      { status: 500 }
    );
  }
}

