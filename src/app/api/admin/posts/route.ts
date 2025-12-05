// Admin Post API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';
import { postSchema, type PostFormData } from '@/lib/schemas/post';

// Helper to generate unique ID
function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// GET - List all posts with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts } = await getCollections();
    const { searchParams } = new URL(request.url);
    
    // Check if requesting single post by slug (for preview)
    const slug = searchParams.get('slug');
    if (slug) {
      const post = await posts.findOne({ slug }); // Allow any status for admin preview
      if (!post) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Post not found',
            },
          },
          { status: 404 }
        );
      }
      const { _id, ...postData } = post as any;
      return NextResponse.json({
        success: true,
        data: {
          post: {
            ...postData,
            id: postData.id || _id.toString(),
          },
        },
      });
    }
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      query.$or = [
        { title: { $regex: searchLower, $options: 'i' } },
        { slug: { $regex: searchLower, $options: 'i' } },
        { excerpt: { $regex: searchLower, $options: 'i' } },
        { content: { $regex: searchLower, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await posts.countDocuments(query);

    // Fetch posts with pagination
    const postsList = await posts
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format posts
    const formattedPosts = postsList.map((doc: any) => {
      const { _id, ...post } = doc;
      return {
        ...post,
        id: post.id || _id.toString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate with Zod schema
    let validatedData: PostFormData;
    try {
      validatedData = postSchema.parse(body);
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

    // Check if slug already exists
    const existingPost = await posts.findOne({ slug: validatedData.slug });
    if (existingPost) {
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

    // Create post with all new fields
    const newPost: Post = {
      id: generateId(),
      title: validatedData.title,
      slug: validatedData.slug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      metaTitle: validatedData.metaTitle,
      metaDescription: validatedData.metaDescription,
      keywords: validatedData.keywords || [],
      featuredImage: validatedData.featuredImage || undefined,
      images: validatedData.images || [],
      category: validatedData.category,
      tags: validatedData.tags || [],
      status: validatedData.status,
      seo:
        validatedData.seo && Object.keys(validatedData.seo).length > 0
          ? validatedData.seo
          : undefined,
      publishedAt:
        validatedData.status === 'published' ? validatedData.publishedAt || new Date() : undefined,
      author: validatedData.author || session.user?.name || 'Admin',
      views: validatedData.views || 0,
      likes: validatedData.likes || 0,

      // 🆕 New fields (Phase 1)
      linkedProducts: validatedData.linkedProducts || [],
      template: validatedData.template || 'default',
      templateData: validatedData.templateData || {},
      readingTime: validatedData.readingTime,
      tableOfContents: validatedData.tableOfContents || [],
      videos: validatedData.videos || [],
      comparisonTable: validatedData.comparisonTable,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    await posts.insertOne(newPost);

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch((err) => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: { post: newPost },
        message: 'Bài viết đã được tạo thành công',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Lỗi server khi tạo bài viết',
        },
      },
      { status: 500 }
    );
  }
}
