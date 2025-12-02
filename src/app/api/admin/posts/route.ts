// Admin Post API Routes
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { Post } from '@/lib/schemas/post';
import { mockPosts } from '@/lib/data/posts';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // Filter posts
    let filteredPosts = [...mockPosts];

    if (status) {
      filteredPosts = filteredPosts.filter((p) => p.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.slug.toLowerCase().includes(searchLower) ||
          p.excerpt?.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt (newest first)
    filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
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
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = mockPosts.find((p) => p.slug === slug);
    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create post
    const newPost: Post = {
      id: generateId(),
      title,
      slug,
      excerpt: excerpt || '',
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      keywords: keywords || [],
      featuredImage: featuredImage || '',
      category: category || '',
      tags: tags || [],
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : undefined,
      author: session.user?.name || 'Admin',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPosts.push(newPost);

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


