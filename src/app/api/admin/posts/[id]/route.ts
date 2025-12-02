// Admin Post API Routes - Single Post Operations
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Post } from '@/lib/schemas/post';
import { mockPosts } from '@/lib/data/posts';

// GET - Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const post = mockPosts.find((p) => p.id === params.id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      keywords,
      featuredImage,
      category,
      tags,
      status,
    } = body;

    const postIndex = mockPosts.findIndex((p) => p.id === params.id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const existingPost = mockPosts[postIndex];

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingPost.slug) {
      const slugExists = mockPosts.some((p) => p.slug === slug && p.id !== params.id);
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update post
    const updatedPost: Post = {
      ...existingPost,
      title: title || existingPost.title,
      slug: slug || existingPost.slug,
      excerpt: excerpt !== undefined ? excerpt : existingPost.excerpt,
      content: content || existingPost.content,
      metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
      metaDescription: metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
      keywords: keywords !== undefined ? keywords : existingPost.keywords,
      featuredImage: featuredImage !== undefined ? featuredImage : existingPost.featuredImage,
      category: category !== undefined ? category : existingPost.category,
      tags: tags !== undefined ? tags : existingPost.tags,
      status: status || existingPost.status,
      publishedAt: status === 'published' && !existingPost.publishedAt
        ? new Date()
        : existingPost.publishedAt,
      updatedAt: new Date(),
    };

    mockPosts[postIndex] = updatedPost;

    return NextResponse.json({
      post: updatedPost,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const postIndex = mockPosts.findIndex((p) => p.id === params.id);

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    mockPosts.splice(postIndex, 1);

    return NextResponse.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


