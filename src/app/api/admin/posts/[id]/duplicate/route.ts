// API: Duplicate Post
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/posts/[id]/duplicate
 * Duplicate a post (create copy with "- Copy" suffix)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { posts } = await getCollections();

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    // Get original post
    const originalPost = await posts.findOne({ _id: new ObjectId(id) });

    if (!originalPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create duplicate
    const { _id, ...postData } = originalPost;

    // Generate unique slug
    let newSlug = `${originalPost.slug}-copy`;
    let counter = 1;

    while (await posts.findOne({ slug: newSlug })) {
      counter++;
      newSlug = `${originalPost.slug}-copy-${counter}`;
    }

    // Create duplicate post
    const duplicatePost = {
      ...postData,
      title: `${originalPost.title} - Copy`,
      slug: newSlug,
      status: 'draft', // Always draft for duplicates
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined, // Clear publish date
    };

    const result = await posts.insertOne(duplicatePost);

    return NextResponse.json(
      {
        message: 'Post duplicated successfully',
        post: {
          ...duplicatePost,
          id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error duplicating post:', error);
    return NextResponse.json({ error: 'Failed to duplicate post' }, { status: 500 });
  }
}
