// Admin Post API Routes - Single Post Operations (MongoDB)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';
import { ObjectId } from 'mongodb';

// GET - Get single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { posts } = await getCollections();

    // Try to find by id field first, then by _id
    let post = await posts.findOne({ id });
    if (!post) {
      try {
        post = await posts.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Format post
    const { _id, ...postData } = post as any;
    const formattedPost = {
      ...postData,
      id: postData.id || _id.toString(),
    };

    return NextResponse.json({ post: formattedPost });
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
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
      seo,
    } = body;

    const { posts } = await getCollections();

    // Find post
    let post = await posts.findOne({ id });
    if (!post) {
      try {
        post = await posts.findOne({ _id: new ObjectId(id) });
      } catch {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        );
      }
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== post.slug) {
      const slugExists = await posts.findOne({ slug, id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update post
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (seo !== undefined) {
      // Clean SEO data - remove empty strings
      const cleanSeo = seo && Object.keys(seo).length > 0 
        ? {
            ...(seo.canonicalUrl && { canonicalUrl: seo.canonicalUrl }),
            ...(seo.robots && { robots: seo.robots }),
            ...(seo.focusKeyword && { focusKeyword: seo.focusKeyword }),
            ...(seo.altText && { altText: seo.altText }),
          }
        : null;
      updateData.seo = cleanSeo && Object.keys(cleanSeo).length > 0 ? cleanSeo : null;
    }
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await posts.updateOne(
      { id },
      { $set: updateData }
    );

    // Fetch updated post
    const updatedPost = await posts.findOne({ id });
    const { _id, ...postData } = updatedPost as any;
    const formattedPost = {
      ...postData,
      id: postData.id || _id.toString(),
    };

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch(err => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

    return NextResponse.json({
      post: formattedPost,
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { posts } = await getCollections();

    // Try to find and delete by id field first
    let result = await posts.deleteOne({ id });
    
    // If not found, try MongoDB _id
    if (result.deletedCount === 0) {
      try {
        result = await posts.deleteOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

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
