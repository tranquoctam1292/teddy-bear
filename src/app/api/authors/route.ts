// Public API: List Authors (for autocomplete, filters, etc.)
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

/**
 * GET /api/authors
 * Public API to list authors
 * 
 * Query params:
 * - search: Search by name
 * - type: Filter by type (staff, contributor, expert, guest)
 * - limit: Number of results (default: 20, max: 100)
 * - featured: Only featured authors (with posts)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const featured = searchParams.get('featured') === 'true';

    const { authors, posts } = await getCollections();

    // Check if collections are available (null during build phase or connection failures)
    if (!authors || !posts) {
      console.warn('Authors or posts collection not available. Returning empty authors list.');
      return NextResponse.json({
        authors: [],
        total: 0,
      });
    }

    // Build query
    const query: any = {
      status: 'active', // Only return active authors
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) {
      query.type = type;
    }

    // Fetch authors
    let authorsList = await authors
      .find(query)
      .sort({ name: 1 })
      .limit(limit)
      .project({
        _id: 1,
        name: 1,
        slug: 1,
        avatar: 1,
        bio: 1,
        jobTitle: 1,
        company: 1,
        credentials: 1,
        type: 1,
        expertise: 1,
      })
      .toArray();

    // If featured, get post counts and filter
    if (featured) {
      const authorsWithPosts = await Promise.all(
        authorsList.map(async (author) => {
          const postCount = await posts.countDocuments({
            'authorInfo.authorId': author._id.toString(),
            status: 'published',
          });
          return { ...author, postCount };
        })
      );

      // Filter authors with at least 1 post
      authorsList = authorsWithPosts.filter(a => a.postCount > 0);
    }

    // Format response
    const formattedAuthors = authorsList.map(author => ({
      id: author._id.toString(),
      name: author.name,
      slug: author.slug,
      avatar: author.avatar,
      bio: author.bio,
      jobTitle: author.jobTitle,
      company: author.company,
      credentials: author.credentials,
      type: author.type,
      expertise: author.expertise,
      ...(featured && { postCount: (author as any).postCount }),
    }));

    return NextResponse.json({
      authors: formattedAuthors,
      total: formattedAuthors.length,
    });

  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

