// Admin Post API Routes - Single Post Operations (MongoDB)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';
import { postUpdateSchema, type PostUpdateFormData } from '@/lib/schemas/post';
import { ObjectId } from 'mongodb';

// GET - Get single post by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update post
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate with Zod schema (partial update)
    let validatedData: PostUpdateFormData;
    try {
      validatedData = postUpdateSchema.parse(body);
    } catch (error: unknown) {
      if (error instanceof Error && 'errors' in error) {
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

    const { posts } = await getCollections();

    // Find post
    let post = await posts.findOne({ id });
    if (!post) {
      try {
        post = await posts.findOne({ _id: new ObjectId(id) });
      } catch {
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

    // Check if slug is being changed and if it conflicts
    if (validatedData.slug && validatedData.slug !== post.slug) {
      const slugExists = await posts.findOne({ slug: validatedData.slug, id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'CONFLICT',
              message: 'Slug đã tồn tại',
            },
          },
          { status: 400 }
        );
      }
    }

    // Build update data object (only include defined fields)
    const updateData: Partial<Post> = {
      updatedAt: new Date(),
    };

    // Update existing fields
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug;
    if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt;
    if (validatedData.content !== undefined) updateData.content = validatedData.content;
    if (validatedData.metaTitle !== undefined) updateData.metaTitle = validatedData.metaTitle;
    if (validatedData.metaDescription !== undefined)
      updateData.metaDescription = validatedData.metaDescription;
    if (validatedData.keywords !== undefined) updateData.keywords = validatedData.keywords;
    if (validatedData.featuredImage !== undefined)
      updateData.featuredImage = validatedData.featuredImage || undefined;
    if (validatedData.images !== undefined) updateData.images = validatedData.images;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.views !== undefined) updateData.views = validatedData.views;
    if (validatedData.likes !== undefined) updateData.likes = validatedData.likes;
    if (validatedData.authorInfo !== undefined) updateData.authorInfo = validatedData.authorInfo;
    if (validatedData.author !== undefined) updateData.author = validatedData.author;

    // 🆕 New fields (Phase 1)
    if (validatedData.linkedProducts !== undefined)
      updateData.linkedProducts = validatedData.linkedProducts;
    if (validatedData.template !== undefined) updateData.template = validatedData.template;
    if (validatedData.templateData !== undefined)
      updateData.templateData = validatedData.templateData;
    if (validatedData.readingTime !== undefined) updateData.readingTime = validatedData.readingTime;
    if (validatedData.tableOfContents !== undefined)
      updateData.tableOfContents = validatedData.tableOfContents;
    if (validatedData.videos !== undefined) updateData.videos = validatedData.videos;
    if (validatedData.comparisonTable !== undefined)
      updateData.comparisonTable = validatedData.comparisonTable;

    // SEO data
    if (validatedData.seo !== undefined) {
      // Clean SEO data - remove empty strings
      const cleanSeo =
        validatedData.seo && Object.keys(validatedData.seo).length > 0
          ? {
              ...(validatedData.seo.canonicalUrl && {
                canonicalUrl: validatedData.seo.canonicalUrl,
              }),
              ...(validatedData.seo.robots && { robots: validatedData.seo.robots }),
              ...(validatedData.seo.focusKeyword && {
                focusKeyword: validatedData.seo.focusKeyword,
              }),
              ...(validatedData.seo.altText && { altText: validatedData.seo.altText }),
            }
          : null;
      updateData.seo = cleanSeo && Object.keys(cleanSeo).length > 0 ? cleanSeo : undefined;
    }

    // Status and publishedAt - CRITICAL: Always update if provided
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      
      // If publishing, ensure publishedAt is set
      if (validatedData.status === 'published') {
        // Priority: provided publishedAt > existing publishedAt > current date
        if (validatedData.publishedAt) {
          updateData.publishedAt = new Date(validatedData.publishedAt);
        } else if (post.publishedAt) {
          // Keep existing publishedAt if already published
          updateData.publishedAt = new Date(post.publishedAt);
        } else {
          // Set to current date if never published before
          updateData.publishedAt = new Date();
        }
      }
      // If changing to draft, keep publishedAt for history (don't remove)
    }
    
    // Handle publishedAt separately if explicitly provided (for scheduled publishing or date changes)
    // This allows updating publishedAt even when status is already published
    if (validatedData.publishedAt !== undefined && validatedData.publishedAt !== null) {
      updateData.publishedAt = new Date(validatedData.publishedAt);
    }

    // Update by id field first, fallback to _id
    let updateResult = await posts.updateOne({ id }, { $set: updateData });
    if (updateResult.matchedCount === 0) {
      try {
        updateResult = await posts.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      } catch {
        // Invalid ObjectId format
      }
    }
    
    if (updateResult.matchedCount === 0) {
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

    // Fetch updated post (try by id first, then _id)
    let updatedPost = await posts.findOne({ id });
    if (!updatedPost) {
      try {
        updatedPost = await posts.findOne({ _id: new ObjectId(id) });
      } catch {
        // Invalid ObjectId format
      }
    }
    
    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Không tìm thấy bài viết sau khi cập nhật',
          },
        },
        { status: 404 }
      );
    }
    
    const { _id, ...postData } = updatedPost as any;
    const formattedPost = {
      ...postData,
      id: postData.id || _id.toString(),
    };

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch((err) => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

    // Revalidate blog pages to clear cache
    // This ensures frontend shows updated content immediately
    try {
      const { revalidatePath } = await import('next/cache');
      if (formattedPost.slug) {
        // Revalidate the specific blog post page
        revalidatePath(`/blog/${formattedPost.slug}`);
        // Also revalidate blog listing page
        revalidatePath('/blog');
        // Revalidate homepage (if it shows blog posts)
        revalidatePath('/');
      }
    } catch (revalidateError) {
      // Revalidation is best-effort, don't fail the request
      console.warn('Failed to revalidate paths:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      data: { post: formattedPost },
      message: 'Bài viết đã được cập nhật thành công',
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Lỗi server khi cập nhật bài viết',
        },
      },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (alias for PUT, for compatibility)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // PATCH is just an alias for PUT
  return PUT(request, { params });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
