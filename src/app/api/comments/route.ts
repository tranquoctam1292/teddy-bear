// Public Comments API - POST (Create Comment)
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { commentInputSchema, type CommentInput } from '@/lib/schemas/comment';
import { detectSpam, sanitizeContent } from '@/lib/utils/spam-detection';
import { ObjectId } from 'mongodb';

/**
 * POST /api/comments
 * 
 * Create a new comment with spam detection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    let validatedData: CommentInput;
    try {
      validatedData = commentInputSchema.parse(body);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Dữ liệu không hợp lệ',
              details: error,
            },
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu không hợp lệ',
          },
        },
        { status: 400 }
      );
    }

    // Verify post exists
    const { comments, posts } = await getCollections();
    
    // Try to find post by id or slug
    let post = await posts.findOne({ id: validatedData.postId });
    if (!post) {
      try {
        post = await posts.findOne({ _id: new ObjectId(validatedData.postId) });
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

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeContent(validatedData.content);

    // Get IP address from request headers
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Run spam detection
    const spamResult = await detectSpam(validatedData, ipAddress);

    // Determine status based on spam detection
    let status: 'approved' | 'pending' | 'spam' | 'auto-spam' = 'pending';
    if (spamResult.isSpam) {
      status = 'auto-spam';
    } else if (spamResult.score < 20) {
      // Low spam score = auto approve
      status = 'approved';
    }

    // Create comment document
    const commentDoc = {
      postId: validatedData.postId,
      authorName: validatedData.authorName,
      authorEmail: validatedData.authorEmail,
      content: sanitizedContent,
      parentId: validatedData.parentId,
      status,
      spamScore: spamResult.score,
      spamReasons: spamResult.reasons.length > 0 ? spamResult.reasons : undefined,
      ipAddress,
      userAgent,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await comments.insertOne(commentDoc);

    // Format response
    const formattedComment = {
      id: result.insertedId.toString(),
      postId: commentDoc.postId,
      authorName: commentDoc.authorName,
      content: commentDoc.content,
      parentId: commentDoc.parentId,
      status: commentDoc.status,
      createdAt: commentDoc.createdAt,
      likes: commentDoc.likes,
      dislikes: commentDoc.dislikes,
    };

    return NextResponse.json(
      {
        success: true,
        data: { comment: formattedComment },
        message:
          status === 'approved'
            ? 'Bình luận đã được đăng thành công'
            : status === 'auto-spam'
              ? 'Bình luận đã được gửi và đang chờ duyệt (phát hiện spam)'
              : 'Bình luận đã được gửi và đang chờ duyệt',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Lỗi server khi tạo bình luận',
        },
      },
      { status: 500 }
    );
  }
}

