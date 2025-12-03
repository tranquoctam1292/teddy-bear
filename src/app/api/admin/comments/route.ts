import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { CommentFilter, CommentStats } from '@/lib/types/comment';
import { ObjectId } from 'mongodb';

// GET /api/admin/comments - List all comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filter: CommentFilter = {
      status: (searchParams.get('status') as any) || 'all',
      postId: searchParams.get('postId') || undefined,
      productId: searchParams.get('productId') || undefined,
      search: searchParams.get('search') || '',
      limit: parseInt(searchParams.get('limit') || '50'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const { comments, posts, products } = await getCollections();

    // Build query
    const query: any = {};

    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter.postId) {
      query.postId = filter.postId;
    }

    if (filter.productId) {
      query.productId = filter.productId;
    }

    if (filter.search) {
      query.$or = [
        { content: { $regex: filter.search, $options: 'i' } },
        { authorName: { $regex: filter.search, $options: 'i' } },
        { authorEmail: { $regex: filter.search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await comments.countDocuments(query);

    // Get comments
    const commentsList = await comments
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filter.skip || 0)
      .limit(filter.limit || 50)
      .toArray();

    // Enrich with post/product info
    const enrichedComments = await Promise.all(
      commentsList.map(async (comment: any) => {
        const enriched: any = {
          ...comment,
          _id: comment._id?.toString(),
        };

        // Get post info
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

        // Get product info
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

        // Get parent comment if exists
        if (comment.parentId) {
          const parent = await comments.findOne({
            _id: new ObjectId(comment.parentId),
          });
          if (parent) {
            enriched.parent = {
              ...parent,
              _id: parent._id?.toString(),
            };
          }
        }

        // Count replies
        const replyCount = await comments.countDocuments({
          parentId: comment._id?.toString(),
        });
        enriched.replyCount = replyCount;

        return enriched;
      })
    );

    // Calculate stats
    const stats: CommentStats = {
      all: await comments.countDocuments({}),
      pending: await comments.countDocuments({ status: 'pending' }),
      approved: await comments.countDocuments({ status: 'approved' }),
      spam: await comments.countDocuments({ status: 'spam' }),
      trash: await comments.countDocuments({ status: 'trash' }),
    };

    return NextResponse.json({
      success: true,
      comments: enrichedComments,
      total,
      page: Math.floor((filter.skip || 0) / (filter.limit || 50)) + 1,
      totalPages: Math.ceil(total / (filter.limit || 50)),
      stats,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/comments - Bulk actions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { comments } = await getCollections();

    let update: any = {};

    switch (action) {
      case 'approve':
        update = { status: 'approved' };
        break;
      case 'spam':
        update = { status: 'spam' };
        break;
      case 'trash':
        update = { status: 'trash' };
        break;
      case 'restore':
        update = { status: 'pending' };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    update.updatedAt = new Date();

    const result = await comments.updateMany(
      { _id: { $in: ids.map((id) => new ObjectId(id)) } },
      { $set: update }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error bulk updating comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comments' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/comments - Bulk delete
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    const { comments } = await getCollections();

    // Delete comments and their replies
    const result = await comments.deleteMany({
      $or: [
        { _id: { $in: ids.map((id) => new ObjectId(id)) } },
        { parentId: { $in: ids } },
      ],
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comments' },
      { status: 500 }
    );
  }
}

