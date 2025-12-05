import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/admin/comments/[id] - Get single comment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { comments, posts, products } = await getCollections();
    const comment = await comments.findOne({ _id: new ObjectId(params.id) });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Enrich with relations
    const enriched: any = {
      ...comment,
      _id: comment._id?.toString(),
    };

    if (comment.postId) {
      const post = await posts.findOne({ _id: new ObjectId(comment.postId) });
      if (post) {
        enriched.post = {
          _id: post._id?.toString(),
          title: post.title,
          slug: post.slug,
        };
      }
    }

    if (comment.productId) {
      const product = await products.findOne({
        _id: new ObjectId(comment.productId),
      });
      if (product) {
        enriched.product = {
          _id: product._id?.toString(),
          name: product.name,
          slug: product.slug,
        };
      }
    }

    // Get replies
    const replies = await comments
      .find({ parentId: params.id })
      .sort({ createdAt: 1 })
      .toArray();

    enriched.replies = replies.map((r: any) => ({
      ...r,
      _id: r._id?.toString(),
    }));

    return NextResponse.json({
      success: true,
      comment: enriched,
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/comments/[id] - Update comment status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Check authentication
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Unauthorized',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, content, spamScore, spamReasons } = body;

    const { comments } = await getCollections();

    const update: any = {
      updatedAt: new Date(),
    };

    if (status) update.status = status;
    if (content !== undefined) update.content = content;
    if (spamScore !== undefined) update.spamScore = spamScore;
    if (spamReasons !== undefined) update.spamReasons = spamReasons;

    const result = await comments.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Comment not found',
          },
        },
        { status: 404 }
      );
    }

    const updatedComment = await comments.findOne({
      _id: new ObjectId(params.id),
    });

    const { _id, ...commentData } = updatedComment as any;

    return NextResponse.json({
      success: true,
      data: {
        comment: {
          ...commentData,
          id: _id.toString(),
        },
      },
      message: 'Cập nhật bình luận thành công',
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Lỗi server khi cập nhật bình luận',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/comments/[id] - Delete comment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { comments } = await getCollections();

    // Delete comment and all its replies
    const result = await comments.deleteMany({
      $or: [{ _id: new ObjectId(params.id) }, { parentId: params.id }],
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}




