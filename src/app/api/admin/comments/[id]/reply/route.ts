import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

// POST /api/admin/comments/[id]/reply - Reply to a comment
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { content, authorName, authorEmail } = body;

    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { comments } = await getCollections();

    // Get parent comment
    const parentComment = await comments.findOne({
      _id: new ObjectId(params.id),
    });

    if (!parentComment) {
      return NextResponse.json(
        { success: false, error: 'Parent comment not found' },
        { status: 404 }
      );
    }

    // Create reply
    const reply = {
      content,
      authorName,
      authorEmail,
      status: 'approved', // Admin replies are auto-approved
      postId: parentComment.postId,
      productId: parentComment.productId,
      parentId: params.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await comments.insertOne(reply as any);

    return NextResponse.json({
      success: true,
      comment: {
        ...reply,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Error replying to comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reply to comment' },
      { status: 500 }
    );
  }
}

