// Public API: Get Author by Slug
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

/**
 * GET /api/authors/[slug]
 * Public API to get author profile by slug
 * Used for: Author archive pages, author boxes, etc.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { authors, posts } = await getCollections();

    // Find author by slug
    const author = await authors.findOne({ 
      slug: slug,
      status: 'active', // Only return active authors
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Get post counts
    const postCount = await posts.countDocuments({
      'authorInfo.authorId': author._id.toString(),
      status: 'published',
    });

    const reviewedCount = await posts.countDocuments({
      'authorInfo.reviewerId': author._id.toString(),
      status: 'published',
    });

    // Get recent posts by this author
    const recentPosts = await posts
      .find({
        'authorInfo.authorId': author._id.toString(),
        status: 'published',
      })
      .sort({ publishedAt: -1 })
      .limit(10)
      .project({
        _id: 1,
        title: 1,
        slug: 1,
        excerpt: 1,
        featuredImage: 1,
        publishedAt: 1,
        category: 1,
      })
      .toArray();

    // Return author data
    return NextResponse.json({
      author: {
        ...author,
        id: author._id.toString(),
        postCount,
        reviewedCount,
      },
      recentPosts: recentPosts.map(post => ({
        ...post,
        id: post._id.toString(),
      })),
    });

  } catch (error) {
    console.error('Error fetching author:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

