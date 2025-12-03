// Posts Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCollections } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Get posts statistics and counts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts } = await getCollections();

    // Get counts by status
    const [
      allCount,
      publishedCount,
      draftCount,
      archivedCount,
    ] = await Promise.all([
      posts.countDocuments({}),
      posts.countDocuments({ status: 'published' }),
      posts.countDocuments({ status: 'draft' }),
      posts.countDocuments({ status: 'archived' }),
    ]);

    // Get "mine" count (posts by current user)
    const mineCount = await posts.countDocuments({
      author: session.user?.email || session.user?.name,
    });

    return NextResponse.json({
      all: allCount,
      mine: mineCount || allCount, // Fallback to all if no author field
      published: publishedCount,
      draft: draftCount,
      trash: archivedCount, // Using archived as trash
    });
  } catch (error) {
    console.error('Error fetching post stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


