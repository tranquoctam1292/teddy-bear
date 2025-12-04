import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';
import type { Post } from '@/lib/schemas/post';

/**
 * GET /api/posts
 * 
 * Fetch blog posts with filtering capabilities
 * 
 * Query Parameters:
 * - slug: Get single post by slug
 * - status: Filter by status (draft, published, archived)
 * - category: Filter by category
 * - search: Search in title and content
 * - page, limit: Pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { posts } = await getCollections();
    const searchParams = request.nextUrl.searchParams;
    
    // Check if requesting single post by slug
    const slug = searchParams.get('slug');
    if (slug) {
      const post = await posts.findOne({ slug, status: 'published' });
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Post not found' },
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

    // Parse query parameters
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 12));

    // Build MongoDB query
    const query: any = { status };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await posts.countDocuments(query);

    // Fetch posts
    const postsList = await posts
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Format posts for response
    const formattedPosts: Post[] = postsList.map((doc: any) => {
      const { _id, ...post } = doc;
      return {
        ...post,
        id: post.id || _id.toString(),
      } as Post;
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}



