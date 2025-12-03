// Admin Post API Routes - MongoDB Integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';
import { ObjectId } from 'mongodb';

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { posts } = await getCollections();
    const { searchParams } = new URL(request.url);
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
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
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
      seo,
    } = body;

    // Validation
    if (!title || !slug || !content || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, status' },
        { status: 400 }
      );
    }

    const { posts } = await getCollections();

    // Check if slug already exists
    const existingPost = await posts.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    // Create post
    const newPost: Post = {
      id: generateId(),
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      keywords: keywords || [],
      featuredImage,
      category,
      tags: tags || [],
      status,
      seo: seo && Object.keys(seo).length > 0 ? seo : undefined,
      publishedAt: status === 'published' ? new Date() : undefined,
      author: session.user?.name || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    await posts.insertOne(newPost);

    // Trigger sitemap regeneration (non-blocking)
    import('@/lib/seo/sitemap-regenerate').then(({ triggerSitemapRegeneration }) => {
      triggerSitemapRegeneration().catch(err => {
        console.error('Failed to trigger sitemap regeneration:', err);
      });
    });

    return NextResponse.json(
      { post: newPost, message: 'Post created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
