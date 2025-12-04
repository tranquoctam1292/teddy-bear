// Public API: Search Authors (Autocomplete)
import { NextRequest, NextResponse } from 'next/server';
import { getCollections } from '@/lib/db';

/**
 * GET /api/authors/search
 * Fast autocomplete search for authors
 * 
 * Query params:
 * - q: Search query (required)
 * - limit: Number of results (default: 10, max: 20)
 * 
 * Returns minimal author data for autocomplete dropdowns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20);

    if (!query || query.length < 2) {
      return NextResponse.json({
        authors: [],
        message: 'Query must be at least 2 characters',
      });
    }

    const { authors } = await getCollections();

    // Search authors
    const results = await authors
      .find({
        status: 'active',
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { jobTitle: { $regex: query, $options: 'i' } },
        ],
      })
      .sort({ name: 1 })
      .limit(limit)
      .project({
        _id: 1,
        name: 1,
        slug: 1,
        avatar: 1,
        jobTitle: 1,
        credentials: 1,
        type: 1,
      })
      .toArray();

    // Format for autocomplete
    const formattedResults = results.map(author => ({
      id: author._id.toString(),
      name: author.name,
      slug: author.slug,
      avatar: author.avatar,
      label: `${author.name}${author.credentials ? ` (${author.credentials})` : ''}`,
      subtitle: author.jobTitle || author.type,
      type: author.type,
    }));

    return NextResponse.json({
      authors: formattedResults,
      total: formattedResults.length,
    });

  } catch (error) {
    console.error('Error searching authors:', error);
    return NextResponse.json(
      { error: 'Failed to search authors' },
      { status: 500 }
    );
  }
}

